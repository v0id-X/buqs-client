<<<<<<< HEAD
# Curious Reader Hub

A modern React frontend for discovering and tracking books.

## Stack

- React
- Vite
- TailwindCSS
- shadcn/ui
- React Query

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
=======
# buqs-client

The frontend for **buqs** — a book discovery and personalised reading platform. Built as a fully client-rendered React SPA, this app puts a thoughtfully designed, performant interface on top of an intelligent backend: multi-mode book feeds, real-time fuzzy autocomplete, a personal reading library, notes, star ratings, genre browsing, and a personalised "For You" page that updates as you read and rate. Light and dark mode are both first-class citizens.

---

## What's inside

- Intelligent multi-mode feed with sort controls and multi-genre filtering
- Trending books carousel with ranked numbered covers
- Personalised For You feed (driven by server-side affinity data)
- Fuzzy autocomplete via portal-rendered dropdown (zero database calls)
- Full-text search with infinite scroll pagination
- Genre pages with per-page sort controls and slug-to-name mapping
- Book detail page with similar books, interactive star rating, and library status
- Three-state personal library (reading / wishlist / finished) with tabbed UI
- Full CRUD notes with debounced auto-save and full-text search
- Safe mode / NSFW toggle persisted in localStorage
- Dark / light theme toggle persisted in localStorage
- JWT session persistence and recovery on page refresh
- Google OAuth sign-in integrated via the official `@react-oauth/google` library
- Forgot / reset password flows with confirmation states
- Protected route system with loading-aware guard
- Responsive sidebar with mobile overlay and desktop sticky behaviour
- Skeleton loading states on every data-heavy surface
- Scroll-to-top button on all scrollable pages
- Custom design system (HSL tokens, dual typography, deterministic book card tints)

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 18 | ESM, functional components throughout |
| Build tool | Vite 5 | SWC compiler (`@vitejs/plugin-react-swc`), not Babel |
| SVG handling | vite-plugin-svgr | Logo imported as a React component |
| Routing | React Router DOM v6 | Nested protected routes, URL-driven filter state |
| Server state | TanStack Query v5 | Infinite queries, mutations, cache management |
| HTTP client | Axios | Single instance, request interceptor for JWT injection |
| UI components | shadcn/ui + Radix UI | Select, Tabs, DropdownMenu, Switch, Tooltip, Sonner |
| Styling | Tailwind CSS v3 | Custom tokens, dark mode via class strategy |
| Icons | Lucide React | Consistent icon set throughout |
| Toasts | Sonner | Stacked, dismissible notifications |
| Infinite scroll | react-intersection-observer | IntersectionObserver-based, no polling |
| Google OAuth | @react-oauth/google | `GoogleLogin` button + `GoogleOAuthProvider` |
| Forms | react-hook-form + zod | Schema validation with resolver |
| Dates | date-fns | Lightweight date formatting |
| Animation | tailwindcss-animate | Accordion, fade-in keyframes |
| Testing | Vitest + @testing-library/react | jsdom environment |

---

## Architecture

### State management

The app separates concerns cleanly across three layers:

**React Context** manages global UI and session state. There are five contexts:

`AuthContext` — Owns the authentication lifecycle. On mount, it reads the JWT from `localStorage` and calls `GET /users/me` to verify the token is still valid, populating the `user` state if so or clearing it if not. Exposes `login`, `register`, `googleAuth`, `forgotPassword`, `resetPassword`, and `logout`. All auth mutations update both `localStorage` and the in-memory `user` state via a shared `handleAuthSuccess` helper.

`BookContext` — Owns the feed state for the home page. Sort and genre filters are stored as URL search params (not in React state), so filters survive navigation and can be bookmarked or shared. The context reads `?sort=` and `?genre=` from the URL, feeds them into `useInfiniteFeed`, and exposes `setSort`, `toggleGenre`, and `clearFilters` which all write back to the URL via `setSearchParams`. Trending books are also fetched here.

`SearchContext` — Splits search into two separate states: `searchQuery` (what the user is currently typing) and `submittedQuery` (what was last submitted). Autocomplete runs against `searchQuery` via a 300ms debounce. Full-text search results run against `submittedQuery` — only when the user explicitly submits. This means autocomplete responds to every keystroke while paginated results only fire on submit.

`SettingsContext` — Manages the safe mode toggle. Default is `true` (safe mode on). Reads from and writes to `localStorage` on every change, so the preference survives page reloads.

`ThemeContext` — Manages light/dark theme. Reads from `localStorage` on init, applies the class to `document.documentElement`, and writes back on every change.

**TanStack Query** manages all server state. Every API response is cached with a meaningful `staleTime`:
- Feed data: 5 minutes (data is stable within a server cache cycle)
- Trending data: 10 minutes (matches server Redis TTL)
- Similar books: 24 hours (matches server Redis TTL exactly)
- User ratings: `Infinity` with `refetchOnWindowFocus: 'always'` — once known, the rating is final, but always confirmed on focus to catch edge cases

All paginated endpoints use `useInfiniteQuery` with `getNextPageParam` reading the `nextCursor` / `hasMore` from each page response. All pages in the infinite list are flattened with `useMemo(() => data.pages.flatMap(...))` to avoid re-deriving on every render.

**Service layer** provides typed, named functions for every API call, all using the single Axios `apiClient` instance. Controllers never touch Axios directly — they always go through a service. This makes the HTTP layer swappable and keeps components clean.

### API Client

A single Axios instance is created with `baseURL: import.meta.env.VITE_BACKEND_URL`. A **request interceptor** reads the JWT from `localStorage` on every request and injects `Authorization: Bearer ${token}` if present. This means no component ever manually handles token injection.

### Routing

React Router DOM v6 with a `ProtectedRoute` wrapper component. `ProtectedRoute` reads `user` and `loading` from `AuthContext` — while loading it renders a centered loading indicator, avoiding a flash-redirect for users with valid sessions. Once resolved, it redirects unauthenticated users to `/auth`.

Public routes: `/auth`, `/forgot-password`, `/reset-password/:resetToken`  
Protected routes: `/`, `/for-you`, `/search`, `/notes`, `/notes/:id`, `/books/:isbn`, `/library`, `/genre/:slug`  
Catch-all: `*` → `NotFound`

---

## Pages

### Home (`/`)

The home page is the main discovery surface. It opens with a personalised hero greeting using the first word of the authenticated user's name. Below that:

**Trending Carousel** — Shows the top 10 trending books in a horizontal scroll carousel (see `TopTenCarousel` below). While loading, five pulse skeletons are shown in place.

**Feed** — A 3-column responsive grid of `BookCard`s driven by `useBookContext`. Sort and genre filters are applied via the `SortFilter` component, which updates URL params. The feed uses `useInfiniteQuery`; when the sentinel `div` at the bottom enters the viewport via `useInView`, `fetchNextPage()` is called automatically. A `Loader2` spinner renders while the next page is fetching; an end-of-library message renders when `hasNextPage` is false.

A scroll-to-top `ArrowUp` button appears (via CSS opacity/translate transition) after scrolling 800px and smooth-scrolls back on click.

### For You (`/for-you`)

Identical infinite-scroll layout to the home feed, but backed by `useForYouFeed` which calls `GET /books/for-you`. Shows an empty state with instructions if the user hasn't rated or saved any books yet (guiding them back to discover to build taste data). Same scroll-to-top behaviour.

### Book Details (`/books/:isbn`)

The most feature-rich page. It:
- Fetches the book via `getBookByIsbn(isbn)` (useQuery, 5min stale)
- Fetches the user's current library status via `useBookStatus(isbn)`
- Fetches the user's existing rating via `useUserRating(isbn)` (staleTime: Infinity)
- Fetches 6 similar books via `useSimilarBooks(isbn, 6)` (24h stale)

**Deterministic cover tint.** The hero card background colour is computed from the book's ISBN: `charSum = isbn.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)`, then `TINTS[charSum % TINTS.length]`. This means every book gets a stable, unique-feeling tint without any server data.

**Genre tags.** Each genre is rendered as a coloured pill using a three-colour rotation (pink/mint/amber CSS token variables) and links to the corresponding `/genre/:slug` page.

**Star rating.** The `StarRating` component renders 5 interactive star buttons. Once a rating exists (fetched or just submitted), `readOnly={true}` disables further interaction and a "Ratings are final." message appears. Submission uses `useSubmitRating`, which on success calls `queryClient.setQueryData` to update the cached rating immediately and `invalidateQueries` to refresh the book detail.

**Library status.** Three buttons (Start reading / Add to wishlist / Mark as finished) call `useUpdateLibrary` on click. The active status drives each button's `variant` (`default` vs `secondary`/`outline`). If the book is in the library, a "Remove" button also appears using `useRemoveFromLibrary`. All three mutations show meaningful Sonner toasts on success and error.

**Similar books.** A grid of `BookCard`s from `useSimilarBooks`. Hidden entirely when the similar books list is empty (no empty-state clutter).

On each ISBN change, `scrollRestoration` is set to `"manual"` and a 10ms timeout scrolls to the top — handling the case where React Router retains scroll position.

### Search (`/search`)

Displays results for `submittedQuery` from `SearchContext`. Uses `useInfiniteSearch` with keyset cursor pagination. Shows `BookCardSkeleton`s while loading, a `SearchX` icon empty state when no results are found, and an infinite-scroll grid otherwise. The query string is displayed in the page header.

### Genre (`/genre/:slug`)

Dynamic genre pages. A `SLUG_MAP` maps URL slugs (e.g. `science-fiction`, `young-adult-fiction`) to their proper display names (`Science Fiction`, `Young Adult`) for both the heading and the API genre filter parameter. If a slug isn't in the map, hyphens are replaced with spaces as a fallback. Uses `useInfiniteFeed` with `{ sort, genre: exactGenre }`, defaulting sort to `top_rated` (best experience for genre browsing). `SortFilter` is rendered with `allGenres=[]` to show sort-only controls.

### Library (`/library`)

Three-tab layout (Radix UI `Tabs`) — "Currently reading", "Finished", "Wishlist". Each tab renders a `LibraryGrid` component in isolation, with its own `useUserLibrary(status)` infinite query. This means each tab fetches and paginates independently. Switching tabs doesn't trigger a re-fetch if the data is still fresh.

### Notes (`/notes` and `/notes/:id`)

**Notes list (`/notes`):** Grid of note cards fetched via `useNotesList`. Supports full-text search via a debounced input (300ms, using `setTimeout`/`clearTimeout` directly in the component). Creating a note fires `useCreateNote`, then navigates immediately to `/notes/:id` using the returned note ID. Deleting from the card uses `stopPropagation` to prevent the card navigation from firing alongside the delete.

**Note editor (`/notes/:id`):** Fetches the note via `useNote(id)`. The title and body are controlled inputs. Auto-save runs on a **800ms debounce** — any change to `title` or `body` sets a timeout, which is cleared and reset on the next change. The save fires `useUpdateNote` and updates the "Saved at HH:MM" timestamp. A manual "Save" button is also always visible. Deleting from this view navigates back to `/notes`. The editor is a bare `<textarea>` and `<input>` with transparent backgrounds — intentionally distraction-free.

### Auth (`/auth`)

Tabbed `Sign in` / `Create account` UI backed by Radix UI `Tabs`. A reusable `Field` component renders labelled inputs with an absolute-positioned icon on the left. Both tabs share the same form submit handler, branching on `tab === 'login'`. Google OAuth via `@react-oauth/google`'s `GoogleLogin` component (pill shape, "continue_with" text, 350px width). After any successful auth, the user is redirected to `/`. Already-authenticated users are redirected away on mount via `useEffect`.

### Forgot Password (`/forgot-password`)

Email input form. On success, flips to a "Check your inbox" confirmation state (no page navigation). Offers a "Try another email?" button to reset back to the form. Server always returns success regardless of whether the email exists, so the UI never leaks which emails are registered.

### Reset Password (`/reset-password/:resetToken`)

Reads `:resetToken` from URL params. Client validates password ≥ 8 chars and both fields match before sending to server. On success, navigates to `/auth`.

---

## Components

### SearchBar

The most technically interesting component. Autocomplete suggestions come from `useSearch().suggestions` (backed by `useAutocomplete` in `SearchContext`, itself debounced 300ms and only enabled for queries longer than 2 characters).

The dropdown is rendered via **`ReactDOM.createPortal(document.body)`** — this bypasses any `overflow: hidden` or `z-index` stacking contexts in parent containers that would otherwise clip the dropdown. The dropdown's `top`, `left`, and `width` are computed from `wrapperRef.current.getBoundingClientRect()` and updated on both `scroll` (with `{capture: true}`) and `resize` events while open, so the dropdown tracks its anchor even on nested scroll containers.

Closing: `Escape` key, `Enter` key (submits + navigates to `/search`), and click-outside (detected via `mousedown` listener on `document`, excluding the portal element itself).

### BookCard

Lazy-loaded cover image with a three-state render cycle: skeleton (`animate-pulse`) while loading, image when loaded (fades in via opacity transition), and an emoji fallback (`📕`) if the image errors. Cover tint is deterministic from the book's `isbn` or `id` charSum — books always get the same background colour on every render without any API call. Genre tags use a three-colour rotation from CSS token variables (`--tag-pink`, `--tag-mint`, `--tag-amber`), adapting correctly in dark mode. `BookCardSkeleton` matches the card's exact layout.

### TopTenCarousel

A horizontally scrollable `snap-x snap-mandatory` container showing ranked books. Each book has a giant outlined rank number (`-webkit-text-stroke: 2px hsl(var(--foreground))`) positioned with `translate-y-2` to partially overlap the cover. ChevronLeft/Right buttons scroll by `max(280, 70% viewport width)`. The scroll container has `no-scrollbar` applied (`::-webkit-scrollbar: none` + `scrollbar-width: none`) so only the buttons are used for navigation.

### Sidebar

On mobile (below `768px`): fixed to the left edge with a `z-100` backdrop overlay that closes the sidebar on click. On desktop: sticky at `top: 0` with `height: 100vh` in the scrollable layout. State is managed by `SidebarProvider` (`useSidebarToggle`), which initialises open/closed based on `window.matchMedia("(min-width: 768px)")` and adds a resize listener to auto-close when the window drops below the breakpoint.

Genre list has four primary genres always visible, with ten additional genres behind a "More / Less" toggle. The sidebar footer contains `SafeModeToggle` and `DarkModeToggle`, then a logout action that calls `logout()` and navigates to `/auth`.

### SortFilter

Composes two Radix UI components: a `Select` for sort mode and a `DropdownMenu` with `DropdownMenuCheckboxItem`s for multi-genre filtering. A "Clear" button appears only when `selectedGenres.length > 0 || sort !== "newest"`.

### StarRating

Five `<button>` elements, each with `aria-label="Rate N stars"`. `readOnly=true` sets `disabled` on all buttons and `cursor-default`. A `size` prop (`sm`/`md`/`lg`) maps to Tailwind size classes. Filled stars use `fill-amber-400 text-amber-400`.

### DarkModeToggle

Custom animated pill with an absolute-positioned white circle that translates via `translate-x-7` in dark mode. Shows a `Moon` icon (dark) or `Sun` icon (light) inside the moving circle. Background changes from `bg-blue-400` (light) to `bg-slate-700` (dark).

### SafeModeToggle

Uses Radix UI `Switch.Root` and `Switch.Thumb` directly. Inverts the NSFW label: `isNsfw = !isSafeMode`. Pressing the toggle calls `toggleSafeMode()` in `SettingsContext` which flips the value and writes to localStorage.

---

## Custom Hooks

**`useDebounce(value, delay)`** — Standard debounce with `useEffect` + `setTimeout`/`clearTimeout`. Returns the debounced value.

**`useSidebarToggle`** — Context hook exposing `open`, `setOpen`, `toggle`, `close`. Initialises from `matchMedia`, listens for resize changes.

**`useInfiniteFeed(filters)`** — `useInfiniteQuery` for the main feed. Reads `isSafeMode` from `SettingsContext` and includes it in the query key so changing safe mode triggers a cache miss and fresh fetch. 5min stale time. `getNextPageParam` reads `lastPage.nextCursor`.

**`useForYouFeed()`** — Same pattern for the personalised feed endpoint.

**`useTrendingBooks()`** — `useQuery` with a `select` transform that extracts `.books`. 10min stale time.

**`useAutocomplete(query)`** — `useQuery`, enabled only when `query.length > 2`. 5min stale time.

**`useInfiniteSearch(query)`** — `useInfiniteQuery` with cursor pagination on `(cursorYear, cursorIsbn)`. Only enabled when `query` is non-empty.

**`useSimilarBooks(isbn, limit)`** — `useQuery` with 24-hour stale time (intentionally matching the server's Redis TTL for similar books cache).

**`useUserRating(isbn)`** — `useQuery` with `staleTime: Infinity` + `refetchOnWindowFocus: 'always'`. Ratings are immutable once set, so they never need re-fetching unless the user navigates away and back.

**`useSubmitRating()`** — `useMutation`. On success: `queryClient.setQueryData(['books','userRating', isbn], rating)` for an instant UI update, then `invalidateQueries` to refresh book detail stats.

---

## Design System

The design uses a dual-font pairing: **Plus Jakarta Sans** (all UI text, labels, body) and **Instrument Serif** (all display headings, notes editor, italic hero text). Both are loaded from Google Fonts in `index.html`.

All colours are **HSL CSS custom properties** defined in `:root` and `.dark`, consumed by Tailwind via the `hsl(var(--...))` pattern. This means the entire colour system flips seamlessly with a single class change on `<html>`.

**Custom tokens defined:**

- `--shadow-card` and `--shadow-soft` — two elevation levels used across cards and surfaces
- `--gradient-purple/pink/orange/magenta` — used for decorative blobs on auth pages
- `--tag-pink/mint/amber` + `--tag-pink-fg/mint-fg/amber-fg` — genre tag colours with proper dark mode variants
- `--book-bg-1/2/3/4` — book background tint values (referenced in card logic)
- `--radius: 1rem` — base border radius with Tailwind `2xl` (`1.5rem`) and `3xl` (`2rem`) extensions

**Tailwind extensions:**
- `fontFamily.sans` and `fontFamily.serif` mapped to the Google Fonts
- `borderRadius` extended with `2xl` and `3xl`
- `boxShadow` extended with `card` and `soft`
- `backgroundImage` extended with four named gradients
- `keyframes` with `fade-in` (opacity + 8px translateY) and accordion animations
- `animation` shortcuts for `fade-in`, `accordion-down`, `accordion-up`
- `.no-scrollbar` utility layer rule to hide scrollbars cross-browser

**Book card tints.** Rather than assigning colours from the API or randomly, card tints are deterministic: `charSum = isbn.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)`, then `TINTS[charSum % TINTS.length]`. The same ISBN always gets the same colour. Six tints are defined, each with hover and dark-mode variants.

---

## Project Structure

```
buqs-client/src/
├── api/
│   └── apiClient.js           # Axios instance + JWT request interceptor
├── assets/
│   └── bookshelf1.svg         # Logo SVG (imported as React component via svgr)
│   └── bookshelf2.svg
├── components/
│   ├── AppLayout.jsx           # Shell: sidebar + main content + header
│   ├── BookCard.jsx            # Book card + skeleton
│   ├── DarkModeToggle.jsx      # Animated pill light/dark toggle
│   ├── SafeModeToggle.jsx      # Radix Switch NSFW toggle
│   ├── ScrollToTop.jsx         # Scroll-to-top utility
│   ├── SearchBar.jsx           # Autocomplete with portal dropdown
│   ├── Sidebar.jsx             # Responsive nav sidebar
│   ├── SortFilter.jsx          # Sort select + multi-genre dropdown filter
│   ├── StarRating.jsx          # Interactive/readonly 1-5 star rating
│   ├── TopTenCarousel.jsx      # Numbered horizontal scroll carousel
│   └── ui/                    # shadcn/ui components (button, input, tabs, select, etc.)
├── Context/
│   ├── AuthContext.jsx         # Session, JWT, auth methods
│   ├── BookContext.jsx         # Feed state, URL-driven sort/genre filters
│   ├── SearchContext.jsx       # Autocomplete + full-text search state
│   ├── SettingsContext.jsx     # Safe mode toggle, persisted
│   └── ThemeContext.jsx        # Light/dark theme, persisted
├── hooks/
│   ├── useBooks.js             # Feed, trending, autocomplete, search, similar book queries
│   ├── useDebounce.js          # Generic debounce hook
│   ├── useLibrary.jsx          # Library CRUD (API-backed queries + mutations)
│   ├── useNotes.jsx            # Notes CRUD (API-backed queries + mutations)
│   ├── useRating.js            # Rating queries + submit mutation
│   └── useSidebarToggle.jsx    # Sidebar open/close state with breakpoint awareness
├── pages/
│   ├── Auth.jsx                # Login + register tabs, Google OAuth
│   ├── BookDetails.jsx         # Full book page with rating, library, similar books
│   ├── ForgotPassword.jsx      # Password reset request
│   ├── ForYou.jsx              # Personalised feed page
│   ├── Genre.jsx               # Dynamic genre pages
│   ├── Index.jsx               # Home: hero, trending carousel, discovery feed
│   ├── Library.jsx             # Tabbed library view
│   ├── NotFound.jsx            # 404
│   ├── NoteView.jsx            # Note editor with auto-save
│   ├── Notes.jsx               # Notes list with search and create
│   ├── ResetPassword.jsx       # Password reset confirm
│   └── SearchResults.jsx       # Full-text search results
├── services/
│   ├── authService.js          # Auth API calls
│   ├── bookService.js          # Book API calls
│   ├── libraryService.js       # Library API calls
│   ├── noteService.js          # Notes API calls (with field mapping)
│   └── ratingsService.js       # Ratings API calls
├── lib/
│   └── utils.js               # cn() utility (clsx + tailwind-merge)
├── App.jsx                     # Router + providers + ProtectedRoute
├── main.jsx                    # Root render: providers, QueryClient config
├── index.css                   # CSS custom properties, Tailwind base
└── App.css                     # App-level styles
```

---

## Getting Started

```bash
git clone <repo-url>
cd buqs-client
npm install

# Set up environment
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:3000/api

npm run dev        # Development server (port 5174)
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Run tests
```

**Requirements:** Node.js 18+, a running `buqs-server` instance.

---

## Environment Variables

```
VITE_BACKEND_URL=https://your-backend-url/api
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
```

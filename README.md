# buqs-client

The frontend for **Buqs** — a personalized book discovery app. Built with React 18 and Vite, it's the client half of a full-stack project where the interesting engineering happens on both sides of the wire: the backend computes personalized recommendations and trending scores, and this app is built to consume that efficiently — infinite-scrolling feeds, debounced search-as-you-type, optimistic UI updates, and URL-driven filter state, all wired through React Query rather than hand-rolled fetch/loading logic.

---

## What's inside

- Infinite-scroll book feeds (Discovery, For You, Trending, Search) powered by React Query's infinite queries against the backend's cursor-paginated API
- Debounced, portal-rendered autocomplete search with keyboard navigation and click-outside handling
- Optimistic UI updates for library status changes and ratings — the interface updates instantly, before the network request even resolves
- URL-driven filter state — sort order and genre filters live in the query string via `useSearchParams`, so filtered views are shareable links and survive a page refresh or back-button press
- Google OAuth sign-in alongside email/password auth, with silent session restoration on page load
- Full dark mode with persisted preference
- A "Safe Mode" content filter, persisted client-side and threaded through every single data-fetching hook
- Personal library (wishlist/reading/finished), notes with search, and a 1–5 star rating system
- Responsive, custom-designed UI built on shadcn/ui + Tailwind — not a default component-library look
- CI/CD to Azure Static Web Apps, with automatic PR preview environments

---

## Architecture

### Data fetching: React Query, not ad-hoc `useEffect` + `fetch`

Every piece of server data in this app — feeds, search, library, notes, ratings — goes through **TanStack Query**, not manual `useEffect`/`useState` fetch logic. This isn't just a style preference; it's what makes the following actually work correctly:

- **Automatic caching with tuned staleness per data type.** Similar-books results are cached client-side for 24 hours (matching the backend's own 24-hour Redis cache for that same data — client and server caching strategy were deliberately kept in sync). A user's own rating on a book is cached indefinitely (`staleTime: Infinity`) since the backend enforces ratings as immutable — the client's cache policy directly reflects a business rule enforced on the server.
- **Infinite queries for every paginated feed.** `useInfiniteQuery` combined with `react-intersection-observer` powers real infinite scroll — an invisible sentinel element at the bottom of the list triggers `fetchNextPage()` when it enters the viewport, which reads the `nextCursor` the backend returned on the last page. This lines up directly with the backend's keyset pagination design — the client never guesses an offset, it just forwards whatever cursor the API gave it.
- **Optimistic cache updates on mutation.** Updating a book's library status or submitting a rating calls `queryClient.setQueryData()` immediately in the mutation's `onSuccess`, so the UI reflects the change instantly, with `invalidateQueries()` alongside it to reconcile with the server in the background.

### Auth: JWT in an Axios interceptor, not manually attached per-request

```javascript
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```
Every API call automatically carries the JWT — no service function has to remember to attach it. Session state is restored on page load by calling `/users/me` with whatever token is in storage; an invalid/expired token is caught and cleared automatically, falling back to the logged-out state rather than getting stuck.

### Filter state lives in the URL, not component state

Sort order and genre filters are read from and written to `useSearchParams`, not `useState`. That means:
- Filtered/sorted views are shareable — copy the URL, send it to someone, they see the same filtered feed
- Refreshing the page doesn't reset your filters
- Browser back/forward navigates through filter changes naturally, for free

### Search: debounce for autocomplete, explicit submit for full results

The search box separates two concerns that are easy to conflate: a debounced value (300ms) drives the lightweight autocomplete dropdown as you type, while full search results only run against a separately-tracked "submitted" query — so autocomplete doesn't spam the backend on every keystroke, but committing a search still feels instant once you actually hit enter.

### The autocomplete dropdown is a React Portal

Rather than rendering the suggestions dropdown inline (where it can get clipped by a parent's `overflow: hidden` or fight with `z-index` stacking), it's rendered via `ReactDOM.createPortal` directly onto `document.body`, with its position calculated manually from the input's bounding rect and kept in sync on scroll/resize. It's a small detail, but it's the kind of thing that only comes up once you've actually hit the clipping/stacking problem in a real layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, Vite (SWC-based dev/build) |
| Routing | React Router v6, including protected-route wrapping based on auth state |
| Server state | TanStack Query (React Query) — caching, infinite queries, optimistic mutations |
| Forms & validation | React Hook Form + Zod |
| Styling | Tailwind CSS + shadcn/ui (Radix UI primitives), custom design tokens (CSS variables for tags/tints), dark mode via class-based theming |
| HTTP | Axios, with a request interceptor for JWT attachment |
| Auth | JWT (email/password) + Google OAuth (`@react-oauth/google`) |
| Icons | lucide-react |
| Infinite scroll | `react-intersection-observer` |
| Toasts | Sonner |
| Deployment | Azure Static Web Apps, CI/CD via GitHub Actions with automatic PR preview environments |

---

## Project Structure

```
buqs-client/
├── src/
│   ├── Context/
│   │   ├── AuthContext.jsx       # JWT session state, login/register/OAuth/logout
│   │   ├── BookContext.jsx       # Feed filters (URL-driven), trending + feed queries
│   │   ├── SearchContext.jsx     # Debounced query, autocomplete, submitted search
│   │   ├── SettingsContext.jsx   # Safe Mode toggle, persisted
│   │   └── ThemeContext.jsx      # Dark/light mode, persisted
│   ├── api/
│   │   └── apiClient.js          # Axios instance + JWT request interceptor
│   ├── services/                 # One file per backend resource — thin API wrappers
│   ├── hooks/                    # React Query hooks — one set per resource
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── BookCard.jsx          # Deterministic per-book color tinting, lazy image load
│   │   ├── SearchBar.jsx         # Portal-rendered autocomplete dropdown
│   │   ├── Sidebar.jsx, AppLayout.jsx
│   │   └── ...
│   └── pages/                    # One component per route
├── staticwebapp.config.json      # Azure SWA SPA fallback routing
└── .github/workflows/            # CI/CD to Azure Static Web Apps
```

---

## Pages & Routes

```
/auth                      Login / register (email or Google)
/forgot-password
/reset-password/:resetToken
/                           Discovery feed (protected)
/for-you                    Personalized feed (protected)
/search                     Search results (protected)
/notes                      Notes list (protected)
/notes/:id                  Single note (protected)
/books/:isbn                Book detail page (protected)
/library                    Personal library (protected)
/genre/:slug                Genre-filtered feed (protected)
```
All protected routes redirect to `/auth` if there's no authenticated user, with a skeleton loading state shown while the session is being verified on initial load.

---

## Deployment

Deployed on **Azure Static Web Apps**, with CI/CD via **GitHub Actions**: every push to `main` builds and deploys automatically, and every pull request gets its own temporary preview environment that's cleaned up when the PR closes. SPA routing is handled via `staticwebapp.config.json`'s navigation fallback, so direct links to any client-side route (e.g. `/books/9780123456789`) resolve correctly instead of 404ing.
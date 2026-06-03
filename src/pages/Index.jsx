import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { SearchBar } from "@/components/SearchBar"; 
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { SortFilter } from "@/components/SortFilter";
import { TopTenCarousel } from "@/components/TopTenCarousel";
import { ArrowUp, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { useAuth } from "../Context/AuthContext";
import { useBookContext, ALL_GENRES } from "../Context/BookContext"; 

const Index = () => {
  const { user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const {
      sort, 
      setSort, 
      genres, 
      toggleGenre, 
      clearFilters,
      trendingData,
      isTrendingLoading,
      feedBooks, 
      feedQuery
  } = useBookContext();

  const { ref: loadMoreRef, inView } = useInView({
      threshold: 0.1, 
      rootMargin: "100px", 
  });

  useEffect(() => {
      if (inView && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
          feedQuery.fetchNextPage();
      }
  }, [inView, feedQuery.hasNextPage, feedQuery.isFetchingNextPage, feedQuery]);

  useEffect(() => {
      const handleScroll = () => {
          setShowScrollTop(window.scrollY > 800);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mb-8 sm:mb-10 relative z-50">
          <SearchBar />
      </div>
      <section className="mb-12 sm:mb-16">
        <p className="text-xs font-semibold text-muted-foreground tracking-[0.25em] uppercase mb-4">
            So good to see you....
        </p>
        <h1 className="font-serif italic font-extrabold tracking-tight leading-[0.95] text-5xl sm:text-7xl md:text-[6.5rem] lg:text-[8rem]">
            Hi, <span className="text-accent">{user?.name?.split(' ')[0] || 'Reader'}</span>,
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Here's what the world's reading today — pick up where you left off or discover something new.
        </p>
      </section>

      <section className="mb-12 sm:mb-16">
        <header className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-[0.25em] uppercase mb-2">
                Trending now
            </p>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Books of the moment
            </h2>
          </div>
        </header>
        
        {isTrendingLoading ? (
          <div className="flex gap-6 overflow-hidden pl-12">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-32 sm:w-40 md:w-44 aspect-[2/3] rounded-2xl bg-muted animate-pulse shrink-0" />
            ))}
          </div>
        ) : (
          <TopTenCarousel books={trendingData?.slice(0, 10) || []} />
        )}
      </section>

      <section>
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold">All Books</h2>
          <SortFilter 
              sort={sort} 
              onSortChange={setSort} 
              allGenres={ALL_GENRES} 
              selectedGenres={genres} 
              onToggleGenre={toggleGenre} 
              onClear={clearFilters} 
          />
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-4">
          {feedQuery.isLoading 
            ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
            : feedBooks.map((b) => <BookCard key={b.isbn || b.id} book={b} />)}
            
          {!feedQuery.isLoading && feedBooks.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-12">
              No books found. Try adjusting your filters.
            </p>
          )}
        </div>

        {!feedQuery.isLoading && feedBooks.length > 0 && (
          <div ref={loadMoreRef} className="w-full flex justify-center py-12">
              {feedQuery.isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Loading more books...</span>
                  </div>
              ) : feedQuery.hasNextPage ? (
                  <div className="h-10" /> 
              ) : (
                  <span className="text-sm text-muted-foreground">You've reached the end of the library.</span>
              )}
          </div>
        )}
      </section>

      <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              showScrollTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll to top"
      >
          <ArrowUp className="w-5 h-5" />
      </button>
    </AppLayout>
  );
};

export default Index;
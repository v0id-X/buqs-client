import { useMemo, useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { SearchBar } from "@/components/SearchBar";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { ArrowUp, Loader2,ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useForYouFeed } from "../hooks/useBooks";
import { useInView } from "react-intersection-observer";

const ForYou = () => {
  const { data: feedData, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useForYouFeed();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
      threshold: 0.1, 
      rootMargin: "100px", 
  });

  useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
      }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 400) {
              setShowScrollTop(true);
          } else {
              setShowScrollTop(false);
          }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleBooks = useMemo(() => {
      if (!feedData) return [];
      return feedData.pages.flatMap(page => page.books || page); 
  }, [feedData]);

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase mb-2">Curated</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">For You</h1>
        <p className="text-muted-foreground">
          Handpicked reads based on the books you love.
        </p>
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Go back
        </Link>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-2">
        {isLoading 
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : visibleBooks.map((b) => <BookCard key={b.isbn} book={b} />)}
      </div>

      {!isLoading && visibleBooks.length === 0 && (
        <p className="text-muted-foreground w-full text-center py-12">
          Your feed is empty. Try saving or rating some books on the Discover page to get recommendations!
        </p>
      )}

      {!isLoading && visibleBooks.length > 0 && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-12">
            {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Curating more books...</span>
                </div>
            ) : hasNextPage ? (
                <div className="h-10" /> 
            ) : (
                <span className="text-sm text-muted-foreground">You've reached the end of your recommendations.</span>
            )}
        </div>
      )}

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

export default ForYou;
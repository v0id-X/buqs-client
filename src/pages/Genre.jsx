import { useMemo, useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { AppLayout } from "@/components/AppLayout";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { SortFilter } from "@/components/SortFilter"; 
import { useInfiniteFeed } from "../hooks/useBooks";

const SLUG_MAP = {
  "fiction": "Fiction",
  "poetry": "Poetry",
  "fantasy": "Fantasy",
  "romance": "Romance",
  "mystery": "Mystery",
  "thriller": "Thriller",
  "science-fiction": "Science Fiction",
  "horror": "Horror",
  "biography": "Biography",
  "history": "History",
  "self-help": "Self Help",
  "young-adult-fiction": "Young Adult",
  "kids": "Kids",
  "business": "Business"
};

const Genre = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const exactGenre = SLUG_MAP[slug] || slug.replace(/-/g, " ");
  const sort = searchParams.get("sort") || "top_rated";

  const feedQuery = useInfiniteFeed({ sort, genre: exactGenre });
  
  const { ref: loadMoreRef, inView } = useInView({
      threshold: 0.1, 
      rootMargin: "100px", 
  });

  const visibleBooks = useMemo(() => {
    if (!feedQuery.data) return [];
    return feedQuery.data.pages.flatMap(page => page.books);
  }, [feedQuery.data]);

  useEffect(() => {
    if (inView && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
      feedQuery.fetchNextPage();
    }
  }, [inView, feedQuery.hasNextPage, feedQuery.isFetchingNextPage, feedQuery]);

  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 800) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSort === 'top_rated') {
        newParams.delete('sort'); 
    } else {
        newParams.set('sort', newSort);
    }
    setSearchParams(newParams);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());
  
  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppLayout>
      

      <header className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase mb-2">Genre</p>
        <h1 className="text-4xl font-extrabold capitalize mb-3">{exactGenre}</h1>
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Go back
      </Link>
      </header>

      <div className="flex justify-end mb-6">
        <SortFilter
          sort={sort}
          onSortChange={handleSortChange}
          allGenres={[]} 
          selectedGenres={[]}
          onToggleGenre={() => {}}
          onClear={clearAll}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-2">
        {feedQuery.isLoading
          ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
          : visibleBooks.map((b) => <BookCard key={b.isbn || b.id} book={b} />)}
          
        {!feedQuery.isLoading && visibleBooks.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No books found in this genre.
          </p>
        )}
      </div>

      {!feedQuery.isLoading && visibleBooks.length > 0 && (
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

export default Genre;
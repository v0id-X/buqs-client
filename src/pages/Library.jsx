import { useMemo, useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserLibrary } from "../hooks/useLibrary";

const LibraryGrid = ({ status }) => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useUserLibrary(status);

  const { ref: loadMoreRef, inView } = useInView({
      threshold: 0.1, 
      rootMargin: "100px", 
  });

  const books = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-6">
        {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold mb-2">No books found</h3>
        <p className="text-muted-foreground">
          Nothing here yet — add some books from Discover.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {books.map((b) => (
          <BookCard key={b.isbn} book={b} />
        ))}
      </div>

      <div ref={loadMoreRef} className="w-full flex justify-center py-12">
          {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Loading more books...</span>
              </div>
          ) : hasNextPage ? (
              <div className="h-10" /> 
          ) : (
              <span className="text-sm text-muted-foreground">You've reached the end of your list.</span>
          )}
      </div>
    </div>
  );
};

const Library = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">My Library</h1>
        <p className="text-muted-foreground">
          Your personal collection — keep track of what you're reading.
        </p>
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Go back
        </Link>
      </header>

      <Tabs defaultValue="reading" className="w-full relative z-10">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-2">
          <TabsList className="rounded-full">
            <TabsTrigger value="reading" className="rounded-full">Currently reading</TabsTrigger>
            <TabsTrigger value="finished" className="rounded-full">Finished</TabsTrigger>
            <TabsTrigger value="wishlist" className="rounded-full">Wishlist</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reading" className="mt-0">
          <LibraryGrid status="reading" />
        </TabsContent>

        <TabsContent value="finished" className="mt-0">
          <LibraryGrid status="finished" />
        </TabsContent>

        <TabsContent value="wishlist" className="mt-0">
          <LibraryGrid status="wishlist" />
        </TabsContent>
      </Tabs>

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

export default Library;
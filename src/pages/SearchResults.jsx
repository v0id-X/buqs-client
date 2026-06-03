import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, SearchX, ArrowUp, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { useSearch } from "../Context/SearchContext";
import { useInView } from "react-intersection-observer";

const SearchResults = () => {
    const { searchResults, submittedQuery } = useSearch();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.1, 
        rootMargin: "100px", 
    });

    useEffect(() => {
        if (inView && searchResults.hasNextPage && !searchResults.isFetchingNextPage) {
            searchResults.fetchNextPage();
        }
    }, [inView, searchResults.hasNextPage, searchResults.isFetchingNextPage, searchResults]);

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

    const books = useMemo(() => {
        if (!searchResults.data) return [];
        return searchResults.data.pages.flatMap(page => page.books);
    }, [searchResults.data]);

    return (
        <AppLayout>
            
            <header className="mb-8">
                <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                    Search Results
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold truncate mb-5">
                    {submittedQuery ? `"${submittedQuery}"` : "Waiting for search..."}
                </h1>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Go back
            </Link>
            </header>

            {searchResults.isLoading && (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-2">
                    {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
                </div>
            )}

            {!searchResults.isLoading && books.length === 0 && submittedQuery && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No books found</h2>
                    <p className="text-muted-foreground max-w-md">
                        We couldn't find any matches for "{submittedQuery}". Try checking for typos or searching by author name instead.
                    </p>
                </div>
            )}

            {!searchResults.isLoading && books.length > 0 && (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pt-2">
                        {books.map((b) => <BookCard key={b.isbn || b.id} book={b} />)}
                    </div>
                    <div ref={loadMoreRef} className="w-full flex justify-center py-12">
                        {searchResults.isFetchingNextPage ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-medium">Loading more books...</span>
                            </div>
                        ) : searchResults.hasNextPage ? (
                            
                            <div className="h-10" /> 
                        ) : (
                            <span className="text-sm text-muted-foreground">You've reached the end of the results.</span>
                        )}
                    </div>
                </>
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

export default SearchResults;
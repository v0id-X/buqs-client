import { useParams, Link } from "react-router-dom";
import { useEffect,useMemo } from "react";
import { ArrowLeft, Star, BookmarkPlus, BookOpen, CheckCircle2, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { toast } from "sonner";

import { getBookByIsbn, useSimilarBooks } from "../hooks/useBooks";
import { useUserRating, useSubmitRating } from "../hooks/useRating";
import { useBookStatus, useUpdateLibrary, useRemoveFromLibrary } from "../hooks/useLibrary";

const TINTS = [
  "bg-rose-500/5 dark:bg-rose-500/10",
  "bg-blue-500/5 dark:bg-blue-500/10",
  "bg-emerald-500/5 dark:bg-emerald-500/10",
  "bg-purple-500/5 dark:bg-purple-500/10",
  "bg-amber-500/5 dark:bg-amber-500/10",
  "bg-slate-500/5 dark:bg-slate-500/10"
];

const tagStyles = [
  "bg-[hsl(var(--tag-pink))] text-[hsl(var(--tag-pink-fg))]",
  "bg-[hsl(var(--tag-mint))] text-[hsl(var(--tag-mint-fg))]",
  "bg-[hsl(var(--tag-amber))] text-[hsl(var(--tag-amber-fg))]",
];

const BookDetails = () => {
  const { isbn } = useParams();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10); 

    return () => clearTimeout(timeout);
  }, [isbn]);
  
  const { data: book, isLoading, isError } = getBookByIsbn(isbn);
  const { data: currentStatus, isLoading: isLoadingStatus } = useBookStatus(isbn);
  const { data: userRating, isLoading: isLoadingRating } = useUserRating(isbn);
  
  const { data: similarData, isLoading: isLoadingSimilar } = useSimilarBooks(isbn, 6);

  const submitRatingMutation = useSubmitRating();
  const updateLibraryMutation = useUpdateLibrary();
  const removeLibraryMutation = useRemoveFromLibrary();

  const handleRate = (newRating) => {
    if (userRating || submitRatingMutation.isPending) return;

    submitRatingMutation.mutate({
      isbn: isbn,
      rating: newRating
    }, {
      onSuccess: () => toast.success(`You rated this ${newRating} stars!`)
    });
  };

  const handleUpdateStatus = (newStatus) => {
    if (currentStatus === newStatus || updateLibraryMutation.isPending) return;

    updateLibraryMutation.mutate(
      { isbn: isbn, status: newStatus },
      {
        onSuccess: () => {
           const messages = {
               reading: "Added to Currently Reading",
               wishlist: "Added to Wishlist",
               finished: "Marked as Finished"
           };
           toast.success(messages[newStatus]);
        },
        onError: (error) => {
           toast.error(error.response?.data?.error || "Failed to update library");
        }
      }
    );
  };

  const handleRemove = () => {
    if (removeLibraryMutation.isPending) return;
    
    removeLibraryMutation.mutate(isbn, {
      onSuccess: () => toast.success("Removed from library"),
      onError: () => toast.error("Failed to remove book from library")
    });
  };

  const cardTint = useMemo(() => {
    if (!book) return 'bg-muted';
    const charSum = (book.isbn || book.title || "book").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TINTS[charSum % TINTS.length]; 
  }, [book]); 

  const displayGenres = useMemo(() => {
    if (!book?.genres) return ['Unknown Genre'];
    const genreLength = book?.genres.length || 0;

    if (Array.isArray(book.genres)) return book.genres.slice(0, genreLength);
    if (typeof book.genres === 'string') {
        return book.genres.split(',').map(g => g.trim()).slice(0, genreLength);
    }
    return [];
  }, [book]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-6" />
        <div className="rounded-3xl bg-muted/40 p-8 md:p-12 mb-10 animate-pulse">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-48 h-64 rounded-2xl bg-muted shrink-0 mx-auto md:mx-0" />
            <div className="flex-1 space-y-4">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-2/3 bg-muted rounded" />
              <div className="h-5 w-1/3 bg-muted rounded" />
              <div className="h-20 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      </AppLayout>
    );
  }

  if (isError || !book) {
    return (
      <AppLayout>
        <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Book not found</h2>
            <p className="text-muted-foreground">The book you are looking for doesn't exist or was removed.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Go back
      </Link>

      <div className={`rounded-3xl ${cardTint} p-8 md:p-12 flex flex-col md:flex-row gap-10 mb-10 shadow-soft`}>
        <div className="w-48 h-64 rounded-2xl bg-card shadow-card overflow-hidden shrink-0 mx-auto md:mx-0">
          <img
            src={book.cover_image}
            alt={`Cover of ${book.title}`}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {displayGenres.map((genre, index) => (
              <span 
                key={index} 
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagStyles[index % tagStyles.length]}`}
              >
                <Link key={genre} to={`/genre/${genre}`}>{genre}</Link>
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{book.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">by {book.author}</p>

          <div className="flex flex-wrap gap-6 mb-6 text-sm">
            <Stat label="Rating" value={
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {Number(book.average_rating || 0).toFixed(1)}
              </span>
            } />
            <Stat label="Pages" value={book.pages} />
            <Stat label="Year" value={book.published_year} />
            <Stat label="Publisher" value={book.publisher} />
            <Stat label="ISBN" value={book.isbn} />
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Your rating
            </p>
            {isLoadingRating ? (
               <div className="h-7 w-32 bg-background/50 rounded animate-pulse" />
            ) : (
                <div className="flex flex-col gap-2">
                    <StarRating 
                        value={userRating || 0} 
                        onChange={handleRate} 
                        readOnly={!!userRating || submitRatingMutation.isPending}
                        size="lg" 
                    />
                    {userRating && (
                        <p className="text-xs text-muted-foreground font-medium">
                            Ratings are final.
                        </p>
                    )}
                    {submitRatingMutation.isError && (
                        <p className="text-xs text-red-500 font-medium">
                            {submitRatingMutation.error.response?.data?.error || "Failed to save rating."}
                        </p>
                    )}
                </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
                size="lg" 
                className="rounded-full transition-all" 
                onClick={() => handleUpdateStatus("reading")}
                disabled={isLoadingStatus || updateLibraryMutation.isPending}
                variant={currentStatus === "reading" ? "default" : "secondary"}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {currentStatus === "reading" ? "Currently Reading" : "Start reading"}
            </Button>

            <Button 
                size="lg" 
                variant={currentStatus === "wishlist" ? "default" : "outline"}
                className="rounded-full transition-all" 
                onClick={() => handleUpdateStatus("wishlist")}
                disabled={isLoadingStatus || updateLibraryMutation.isPending}
            >
              <BookmarkPlus className="w-4 h-4 mr-2" /> 
              {currentStatus === "wishlist" ? "In Wishlist" : "Add to wishlist"}
            </Button>

            <Button
              size="lg"
              variant={currentStatus === "finished" ? "default" : "outline"}
              className="rounded-full transition-all"
              onClick={() => handleUpdateStatus("finished")}
              disabled={isLoadingStatus || updateLibraryMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> 
              {currentStatus === "finished" ? "Finished" : "Mark as finished"}
            </Button>

            {currentStatus && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-all"
                onClick={handleRemove}
                disabled={isLoadingStatus || removeLibraryMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-3xl mb-16">
        <h2 className="text-xl font-extrabold mb-3">About this book</h2>
        <p className="text-muted-foreground leading-relaxed">{book.description}</p>
      </section>

      {(isLoadingSimilar || similarData?.books?.length > 0) && (
        <section className="mb-16">
          <h2 className="text-xl font-extrabold mb-6">More Like This</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {isLoadingSimilar 
              ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
              : similarData.books.map((b) => <BookCard key={b.isbn} book={b} />)
            }
          </div>
        </section>
      )}
    </AppLayout>
  ); 
}; 

const Stat = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
    <p className="font-bold text-base">{value}</p>
  </div>
);

export default BookDetails;
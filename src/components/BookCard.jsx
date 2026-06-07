import { Link } from "react-router-dom";
import { useState, useMemo } from "react";


const tagStyles = [
  "bg-[hsl(var(--tag-pink))] text-[hsl(var(--tag-pink-fg))]",
  "bg-[hsl(var(--tag-mint))] text-[hsl(var(--tag-mint-fg))]",
  "bg-[hsl(var(--tag-amber))] text-[hsl(var(--tag-amber-fg))]",
];


const TINTS = [
  "bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/20",
  "bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/20",
  "bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
  "bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/10 dark:hover:bg-purple-500/20",
  "bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 dark:hover:bg-amber-500/20",
  "bg-slate-500/5 hover:bg-slate-500/10 dark:bg-slate-500/10 dark:hover:bg-slate-500/20"
];

export const BookCard = ({ book }) => {
  
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  
  const displayGenres = useMemo(() => {
    if (!book?.genres) return ['Unknown Genre'];
    
    
    if (Array.isArray(book.genres)) {
        return book.genres.slice(0, 4);
    }
    
    if (typeof book.genres === 'string') {
        return book.genres.split(',').map(g => g.trim()).slice(0, 3);
    }
    
    return [];
  }, [book]);

  const cardTint = useMemo(() => {
    if (book.tint) return book.tint; 
    
    const uniqueString = book.isbn || book.id || book.title || "book";
    const charSum = uniqueString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return TINTS[charSum % TINTS.length];
  }, [book.isbn, book.id, book.title, book.tint]);

  return (
    <Link
      to={`/books/${book.isbn || book.id}`}
      className={`group relative flex items-center gap-5 p-4 pr-8 rounded-3xl ${cardTint} min-w-[360px] shadow-soft hover:shadow-card transition-all duration-300`}
    >
      <div className="relative w-24 h-32 rounded-xl bg-card shadow-card shrink-0 -mt-6 -mb-6 group-hover:-translate-y-1 transition-transform overflow-hidden flex items-center justify-center">
        {!loaded && !errored && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
        )}
        {!errored && (
          <img
            src={book.cover_image}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {errored && <span className="text-4xl">📕</span>}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-base leading-tight mb-1 truncate">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 truncate">{book.author}</p>
        
        <div className="flex flex-wrap gap-2">
          {displayGenres.map((genre, index) => (
            <span 
              key={index} 
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagStyles[index % tagStyles.length]}`}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};


export const BookCardSkeleton = () => (
  <div className="flex items-center gap-5 p-4 pr-8 rounded-3xl bg-muted/40 min-w-[360px] shadow-soft animate-pulse">
    <div className="w-24 h-32 rounded-xl bg-muted -mt-6 -mb-6" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="h-3 w-1/2 bg-muted rounded" />
      <div className="h-5 w-24 bg-muted rounded-full mt-3" />
    </div>
  </div>
);
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, FileText, Sparkles, Glasses } from "lucide-react";

const Recommendation = ({ recommendation }) => (
  <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-secondary/50 hover:shadow-card dark:border-white/[0.08]">
    <div className="flex gap-3">
      <div className="mt-0.5 h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-[hsl(var(--tag-amber))] shadow-soft">
        {recommendation.cover_image ? (
          <img
            src={recommendation.cover_image}
            alt={`Cover of ${recommendation.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[hsl(var(--tag-amber-fg))]">
            <BookOpen className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          to={recommendation.bookUrl || `/books/${recommendation.isbn}`}
          className="block truncate text-sm font-bold hover:underline"
        >
          {recommendation.title}
        </Link>
        {recommendation.author && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {recommendation.author}
          </p>
        )}
        {recommendation.reason && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {recommendation.reason}
          </p>
        )}
        {recommendation.noteUrl && (
          <Link
            to={recommendation.noteUrl}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground/70 hover:text-foreground"
          >
            Open note <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

const Note = ({ note }) => (
  <Link
    to={note.noteUrl}
    className="flex gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-secondary/50 hover:shadow-card dark:border-white/[0.08]"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--tag-mint))] text-[hsl(var(--tag-mint-fg))]">
      <FileText className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-bold">{note.title}</p>
      {note.content && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>}
    </div>
  </Link>
);

export const LibrarianMessage = ({ item }) => {
  const isUser = item.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground sm:max-w-[72%]">
          {item.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--tag-pink))] text-[hsl(var(--tag-pink-fg))] shadow-soft">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm leading-7 text-foreground/90">{item.content}</p>
        {item.recommendations?.length > 0 && (
          <div className="mt-4 space-y-3">
            {item.recommendations.map((recommendation, index) => (
              <Recommendation
                key={`${recommendation.isbn}-${index}`}
                recommendation={recommendation}
              />
            ))}
          </div>
        )}
        {item.notes?.length > 0 && (
          <div className="mt-4 space-y-3">
            {item.notes.map((note) => <Note key={note.id} note={note} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export const LibrarianTyping = () => (
  <div className="flex gap-3 sm:gap-4" aria-label="The Librarian is preparing a response">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--tag-pink))] text-[hsl(var(--tag-pink-fg))] shadow-soft">
      <Sparkles className="h-4 w-4" />
    </div>
    <div className="w-full max-w-xl animate-pulse rounded-3xl border border-border/50 bg-card/70 p-5 shadow-soft dark:border-white/[0.08]" aria-hidden="true">
      <div className="h-3 w-2/5 rounded-full bg-muted" />
      <div className="mt-3 h-3 w-full rounded-full bg-muted" />
      <div className="mt-2 h-3 w-4/5 rounded-full bg-muted" />
      <div className="mt-5 flex gap-3">
        <div className="h-14 w-10 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-1/2 rounded-full bg-muted" />
          <div className="h-3 w-3/4 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

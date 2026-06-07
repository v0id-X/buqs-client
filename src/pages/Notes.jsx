import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, NotebookPen, Search, ArrowUp,ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNotesList, useCreateNote, useDeleteNote } from "@/hooks/useNotes";

const Notes = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  const observerTarget = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotesList(debouncedSearch);
  const createNoteMutation = useCreateNote();
  const deleteNoteMutation = useDeleteNote();

  const notes = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const handleCreate = () => {
    createNoteMutation.mutate(
      { title: "", body: "" },
      { onSuccess: (newNote) => navigate(`/notes/${newNote.id}`) }
    );
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNoteMutation.mutate(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppLayout>
      <header className="mb-8 sm:mb-10">
        <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-3">Your space</p>
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.95] mb-4">
          Personal <span className="text-accent">notes</span>.
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Capture thoughts, quotes and reflections from everything you read.
        </p>
         <Link to='/' className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to discover
      </Link>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all notes by title or content …"
            className="w-full bg-transparent border-0 border-b border-border pl-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <Button onClick={handleCreate} disabled={createNoteMutation.isPending} size="lg" className="rounded-full self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-2" /> New note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[180px] bg-muted/40 animate-pulse rounded-3xl" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-10 sm:p-16 text-center">
          <NotebookPen className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <p className="font-serif italic text-2xl mb-2">No notes found.</p>
          <p className="text-muted-foreground mb-6">Try adjusting your search query or create a new entry.</p>
          <Button onClick={handleCreate} disabled={createNoteMutation.isPending} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" /> Create a note
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {notes.map((n) => (
              <Link
                key={n.id}
                to={`/notes/${n.id}`}
                className="group relative flex flex-col p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow min-h-[180px]"
              >
                <h3 className="font-serif italic text-2xl sm:text-3xl font-bold leading-tight mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  {n.title || "Untitled note"}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-4 flex-1 leading-relaxed whitespace-pre-wrap">
                  {n.body?.trim() || "Empty — click to start writing."}
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, n.id)}
                    aria-label="Delete note"
                    className="w-8 h-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div ref={observerTarget} className="h-4 w-full" />
          {isFetchingNextPage && (
            <div className="flex justify-center pb-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {showTopBtn && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </AppLayout>
  );
};

export default Notes;
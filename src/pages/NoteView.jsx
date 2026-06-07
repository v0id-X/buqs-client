import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Save, Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNote, useUpdateNote, useDeleteNote } from "@/hooks/useNotes";
import { toast } from "sonner";

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading } = useNote(id);
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setBody(note.body || "");
      setSavedAt(note.updatedAt);
    }
  }, [note]);

  const timer = useRef(null);
  useEffect(() => {
    if (!note || (title === note.title && body === note.body)) return;
    
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      updateNoteMutation.mutate({ id, title: title, body });
      setSavedAt(new Date().toISOString());
    }, 800);
    
    return () => clearTimeout(timer.current);
  }, [title, body, note, id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-8" />
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-14 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-[400px] w-full bg-muted rounded animate-pulse mt-8" />
        </div>
      </AppLayout>
    );
  }

  if (!note && !isLoading) {
    return (
      <AppLayout>
        <Link to="/notes" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to notes
        </Link>
        <p className="text-lg">Note not found.</p>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    deleteNoteMutation.mutate(id, {
        onSuccess: () => navigate("/notes")
    });
  };

  const handleManualSave = () => {
    updateNoteMutation.mutate({ id, title: title, body });
    setSavedAt(new Date().toISOString());
    toast.success("Saved");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        <Link to="/notes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> All notes
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Check className="w-3 h-3" />
            {savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Not saved"}
          </span>
          <Button size="sm" variant="outline" className="rounded-full" onClick={handleManualSave} disabled={updateNoteMutation.isPending}>
            <Save className="w-4 h-4 mr-1.5" /> Save
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={handleDelete} disabled={deleteNoteMutation.isPending}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
          </Button>
        </div>
      </div>

      <article className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-4">
          {new Date(note.createdAt).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled note"
          className="w-full bg-transparent border-0 outline-none font-serif italic text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1] mb-8 placeholder:text-muted-foreground/50"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing your thoughts…"
          className="w-full min-h-[60vh] bg-transparent border-0 outline-none text-base sm:text-lg leading-relaxed resize-none placeholder:text-muted-foreground/60"
        />
      </article>
    </AppLayout>
  );
};

export default NoteView;
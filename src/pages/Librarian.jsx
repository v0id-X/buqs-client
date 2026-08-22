import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Glasses, RotateCcw, Sparkles, GlassesIcon, ArrowLeft } from "lucide-react";
import Logo from "@/assets/bookshelf2.svg?react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useSettings } from "@/Context/SettingsContext";
import { LibrarianComposer } from "@/components/LibrarianComposer";
import { LibrarianMessage, LibrarianTyping } from "@/components/LibrarianMessage";
import { askLibrarian } from "@/services/librarianService";


const CONVERSATION_KEY = "buqs_librarian_conversation_id";
const MESSAGES_KEY = "buqs_librarian_messages";

const STARTERS = [
  "What should I read next?",
  "Show me what's trending on Buqs",
  "What have I rated recently?",
  "Can you check on my notes?"
];

const createConversationId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `librarian-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readStoredMessages = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem(MESSAGES_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const Librarian = () => {
  const { isSafeMode } = useSettings();
  const [conversationId] = useState(() => {
    const saved = sessionStorage.getItem(CONVERSATION_KEY);
    if (saved) return saved;

    const next = createConversationId();
    sessionStorage.setItem(CONVERSATION_KEY, next);
    return next;
  });
  const [messages, setMessages] = useState(readStoredMessages);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  const hasConversation = messages.length > 0;
  const messageCount = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  const sendMessage = async (content) => {
    if (isSending) return;

    const userMessage = { id: `user-${Date.now()}`, role: "user", content };
    setMessages((current) => [...current, userMessage]);
    setError("");
    setIsSending(true);

    try {
      const response = await askLibrarian({
        message: content,
        conversationId,
        safeMode: isSafeMode,
      });

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.message,
          recommendations: response.recommendations || [],
          notes: response.notes || [],
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "The library is currently too loud. Please try again in a moment."
      );
    } finally {
      setIsSending(false);
    }
  };

  const startOver = () => {
    setMessages([]);
    setError("");
    sessionStorage.removeItem(MESSAGES_KEY);
    const next = createConversationId();
    sessionStorage.setItem(CONVERSATION_KEY, next);
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col">
        <header className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Your reading companion
            </p>
            <h1 className="font-serif text-5xl font-extrabold italic tracking-tight sm:text-6xl">
             Buqs Librarian
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A quiet guide to your books, notes, and next great read.
            </p>
              <Link to={-1} className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Go back
        </Link>
          </div>
          {hasConversation && (
            <button
              type="button"
              onClick={startOver}
              className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Start a new conversation"
              title="Start a new conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </header>

        {!hasConversation ? (
          <section className="flex flex-1 flex-col justify-center pb-10">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card dark:border-white/[0.08]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_0%,hsl(var(--accent)/0.15),transparent_40%),radial-gradient(circle_at_5%_100%,hsl(var(--tag-mint)/0.22),transparent_38%)] dark:opacity-60" />
              <div className="relative p-6 sm:p-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--tag-pink))] text-[hsl(var(--tag-pink-fg))]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-3xl font-bold italic">Where shall we begin?</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Ask about your reading history, find a comparable book, or explore your saved notes.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {STARTERS.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => sendMessage(starter)}
                      disabled={isSending}
                      className="rounded-full bg-secondary px-4 py-2 text-left text-sm font-semibold text-foreground/80 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex-1 space-y-6 pb-8 sm:space-y-8">
            {messages.map((item) => <LibrarianMessage key={item.id} item={item} />)}
            {isSending && <LibrarianTyping />}
            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div ref={endRef} />
          </section>
        )}

        {!hasConversation && error && (
          <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="sticky bottom-0 -mx-4 bg-background/90 px-4 pb-2 pt-4 backdrop-blur sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
          <LibrarianComposer disabled={isSending} onSend={sendMessage} />
        </div>
        {messageCount > 0 && (
          <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" /> Your conversation is private to this session.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default Librarian;

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

const MAX_MESSAGE_LENGTH = 500;

export const LibrarianComposer = ({ disabled, onSend }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  const submit = (event) => {
    event?.preventDefault();
    const value = message.trim();

    if (!value || disabled) return;

    onSend(value);
    setMessage("");
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      submit(event);
    }
  };

  return (
    <form onSubmit={submit} className="relative isolate">
      <div className="flex items-end gap-2 rounded-3xl border border-border/60 bg-card p-2 shadow-soft transition-all focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-accent/10 dark:border-white/[0.08]">
        <textarea
          ref={textareaRef}
          value={message}
          disabled={disabled}
          onChange={(event) => setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Ask Librarian...."
          aria-label="Message the BUQS Librarian"
          className="block max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          aria-label="Send message"
          className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-2 px-2 text-xs text-muted-foreground">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

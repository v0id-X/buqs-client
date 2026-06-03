import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "buqs:notes:v1";

const readInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const NotesCtx = createContext(null);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(readInitial);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  const create = useCallback((data = {}) => {
    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();
    const note = {
      id,
      title: data.title?.trim() || "Untitled note",
      body: data.body || "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    return id;
  }, []);

  const update = useCallback((id, patch) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    );
  }, []);

  const remove = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const get = useCallback((id) => notes.find((n) => n.id === id), [notes]);

  return (
    <NotesCtx.Provider value={{ notes, create, update, remove, get }}>
      {children}
    </NotesCtx.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesCtx);
  return ctx;
};

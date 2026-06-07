import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "buqs:library:v1";

const defaultState = {
  reading: [],
  wishlist: [],
  finished: [],
  ratings: {},
};

const readInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

const LibraryContext = createContext(null);

export const LibraryProvider = ({ children }) => {
  const [state, setState] = useState(readInitial);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const moveTo = useCallback((bucket, id) => {
    setState((prev) => {
      const stripped = {
        reading:  prev.reading.filter((x) => x !== id),
        wishlist: prev.wishlist.filter((x) => x !== id),
        finished: prev.finished.filter((x) => x !== id),
      };
      return {
        ...prev,
        ...stripped,
        [bucket]: [id, ...stripped[bucket]],
      };
    });
  }, []);

  const remove = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      reading:  prev.reading.filter((x) => x !== id),
      wishlist: prev.wishlist.filter((x) => x !== id),
      finished: prev.finished.filter((x) => x !== id),
    }));
  }, []);

  const setRating = useCallback((id, value) => {
    setState((prev) => ({ ...prev, ratings: { ...prev.ratings, [id]: value } }));
  }, []);

  const statusOf = useCallback((id) => {
    if (state.reading.includes(id))  return "reading";
    if (state.wishlist.includes(id)) return "wishlist";
    if (state.finished.includes(id)) return "finished";
    return null;
  }, [state]);

  const value = { ...state, moveTo, remove, setRating, statusOf };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
};

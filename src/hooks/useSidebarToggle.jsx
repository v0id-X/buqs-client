import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SidebarCtx = createContext(null);

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(() => isDesktop());

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setOpen(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <SidebarCtx.Provider value={{ open, setOpen, toggle, close }}>
      {children}
    </SidebarCtx.Provider>
  );
};

export const useSidebarToggle = () => {
  const ctx = useContext(SidebarCtx);
  return ctx;
};

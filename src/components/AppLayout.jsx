import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { Menu } from "lucide-react";
import Logo from "@/assets/bookshelf2.svg?react";

export const AppLayout = ({ children }) => {
  const { open, toggle } = useSidebarToggle();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-6 md:py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          {!open ? (
            <button
              type="button"
              onClick={toggle}
              aria-label="Open sidebar"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-soft hover:bg-secondary"
            >
              <Menu className="w-4 h-4" />
            </button>
          ) : (
            <span />
          )}

          <Link
            to="/"
            aria-label="Buqs home"
            className="flex items-center gap-0.5 sm:gap-0.5 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-7 h-7 sm:w-8 sm:h-8 dark:invert transition-all" />

            <span className="font-serif italic text-3xl sm:text-4xl font-bold tracking-tight leading-none">
              Buqs
            </span>
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
};
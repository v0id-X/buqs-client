import { NavLink, useLocation } from "react-router-dom";
import {
  Home, BookOpen, Feather, Sparkles, FlowerIcon, Library,
  MoreHorizontal, ChevronUp, PanelLeftClose, X, LogOut,
  Search as MysteryIcon, Rocket, User, Globe, Zap, Ghost, Baby, Briefcase,
  TrendingUp, Trophy, NotebookPen, Heart, WandSparkles
} from "lucide-react";
import { useState } from "react";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useAuth } from "../Context/AuthContext";
import { SafeModeToggle } from "./SafeModeToggle";
import { DarkModeToggle } from "./DarkModeToggle";

const discoverItems = [
  { to: "/",        label: "Home",            icon: Home,        color: "text-foreground" },
  { to: "/for-you", label: "For You",         icon: Sparkles,    color: "text-purple-500"},
  { to: "/notes",   label: "Personal Notes",  icon: NotebookPen, color: "text-indigo-500" },
];

const primaryGenres = [
  { to: "/genre/fiction",  label: "Fiction",  icon: BookOpen,   color: "text-emerald-500" },
  { to: "/genre/poetry",   label: "Poetry",   icon: Feather,    color: "text-orange-500"  },
  { to: "/genre/fantasy",  label: "Fantasy",  icon: WandSparkles, color: "text-violet-500"  },
  { to: "/genre/romance",  label: "Romance",  icon: FlowerIcon, color: "text-rose-500"    },
];

const extraGenres = [
  { to: "/genre/mystery",            label: "Mystery",         icon: MysteryIcon, color: "text-indigo-500" },
  { to: "/genre/thriller",           label: "Thriller",        icon: Zap,         color: "text-red-500"    },
  { to: "/genre/science-fiction",    label: "Science Fiction", icon: Rocket,      color: "text-sky-500"    },
  { to: "/genre/horror",             label: "Horror",          icon: Ghost,       color: "text-purple-500" },
  { to: "/genre/biography",          label: "Biography",       icon: User,        color: "text-amber-500"  },
  { to: "/genre/history",            label: "History",         icon: Globe,       color: "text-teal-500"   },
  { to: "/genre/self-help",          label: "Self Help",       icon: Heart,       color: "text-pink-400"   },
  { to: "/genre/young-adult-fiction",label: "Young Adult",     icon: BookOpen,    color: "text-lime-500"   },
  { to: "/genre/kids",               label: "Kids",            icon: Baby,        color: "text-yellow-500" },
  { to: "/genre/business",           label: "Business",        icon: Briefcase,   color: "text-slate-500"  },
];

const pinnedItems = [
  { to: "/library", label: "My Library", icon: Library, color: "text-violet-500" },
];

export const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const { open, close, toggle } = useSidebarToggle();
  const { logout } = useAuth();

  if (!open) return null;

  const renderRow = ({ to, label, icon: Icon, color }) => {
    const currentPath = location.pathname + location.search;
    const active = currentPath === to;
    return (
      <NavLink
        key={to}
        to={to}
        onClick={close}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
          active ? "bg-secondary text-foreground" : "text-foreground/70 hover:bg-secondary"
        }`}
      >
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </NavLink>
    );
  };

  return (
    <>
      <div
        className="md:hidden fixed inset-0 z-[90] bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={
          "z-[100] md:z-40 flex w-72 md:w-64 shrink-0 flex-col bg-card border-r border-border " +
          "px-6 py-8 overflow-y-auto overflow-x-hidden no-scrollbar " +
          "fixed inset-y-0 left-0 md:sticky md:top-0 md:h-screen h-screen"
        }
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight">Shelf</h1>
          <button
            type="button"
            onClick={toggle}
            aria-label="Hide sidebar"
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 hidden md:block" />
            <X className="w-4 h-4 md:hidden" />
          </button>
        </div>

        <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">DISCOVER</p>
        <nav className="flex flex-col gap-1 mb-8">
          {discoverItems.map(({ to, label, icon: Icon, color }) => {
            const isHome = to === "/";
            const hasSearchParams = location.search.length > 0;
            
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => {
                  const practicallyActive = isHome ? (isActive && !hasSearchParams) : isActive;
                  return `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-colors ${
                    practicallyActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`;
                }}
                onClick={close}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-3">LIBRARY</p>
        <nav className="flex flex-col gap-1">
          {primaryGenres.map(renderRow)}
          {showMore && extraGenres.map(renderRow)}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-foreground/70 hover:bg-secondary transition-colors text-left"
            aria-expanded={showMore}
          >
            {showMore ? (
              <ChevronUp className="w-4 h-4 text-amber-500" />
            ) : (
              <MoreHorizontal className="w-4 h-4 text-amber-500" />
            )}
            {showMore ? "Less" : "More"}
          </button>
          {pinnedItems.map(renderRow)}
        </nav>
        
        <div className="mt-auto pt-6 flex flex-col w-full">
          <div className="flex flex-col gap-5 px-4 pb-6">
            <SafeModeToggle />
            <DarkModeToggle />
          </div>
          
          <div className="border-t border-border/50 pt-3">
            <NavLink
              to="/auth"
              onClick={() => { try { logout(); } catch {} close(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              Log out
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
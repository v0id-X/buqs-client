import { useTheme } from "../Context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm font-medium text-foreground/70">
        Dark Mode<span className="text-foreground ml-1"></span>
      </span>

      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
          isDark ? "bg-slate-700" : "bg-blue-400"
        }`}
        aria-label="Toggle Dark Mode"
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex justify-center items-center ${
            isDark ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-slate-700" />
          ) : (
            <Sun className="w-3 h-3 text-yellow-500" />
          )}
        </div>
      </button>
    </div>
  );
};
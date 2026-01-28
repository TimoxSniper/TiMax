"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Vereinfachter Dark Mode - kein MutationObserver mehr
  useEffect(() => {
    const html = document.documentElement;
    const isDarkMode = html.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-md sm:backdrop-blur-lg border border-black/10 dark:border-white/10 hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-300 shadow-lg focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2"
      aria-label="Dark Mode umschalten"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-black dark:text-white" />
      ) : (
        <Moon className="w-5 h-5 text-black dark:text-white" />
      )}
    </button>
  );
}


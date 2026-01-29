"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DarkModeToggleProps {
  variant?: "fixed" | "inline";
  className?: string;
}

export function DarkModeToggle({ variant = "fixed", className }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  // Dark Mode mit Persistenz und System-Präferenz
  useEffect(() => {
    // Lade gespeicherte Präferenz oder nutze System-Präferenz
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    // Speichere Präferenz
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  if (variant === "inline") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className={cn("h-9 w-9", className)}
        aria-label="Dark Mode umschalten"
      >
        {isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    );
  }

  // Fixed variant (für Homepage)
  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-md sm:backdrop-blur-lg border border-black/10 dark:border-white/10 hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-300 shadow-lg focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2",
        className
      )}
      aria-label="Dark Mode umschalten"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
      )}
    </button>
  );
}


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
    const applyTheme = (isDarkMode: boolean) => {
      const html = document.documentElement;
      if (isDarkMode) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      setIsDark(isDarkMode);
    };

    // Lade gespeicherte Präferenz oder nutze System-Präferenz
    const savedTheme = localStorage.getItem("theme");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const initialIsDark = savedTheme === "dark" || (!savedTheme && mediaQuery.matches);
    applyTheme(initialIsDark);

    // Listener für System-Änderungen
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    // Speichere Präferenz
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  if (variant === "inline") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className={cn("h-9 w-9", className)}
        aria-label={isDark ? "In den hellen Modus wechseln" : "In den dunklen Modus wechseln"}
      >
        {isDark ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    );
  }

  // Fixed variant (für Homepage) - Editorial Modernism
  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "bg-card border-border shadow-editorial-sm hover:shadow-editorial-md focus:ring-accent fixed top-4 right-4 z-50 rounded-[6px] border p-3 transition-all duration-300 focus:ring-2 focus:ring-offset-2 sm:top-6 sm:right-6",
        className
      )}
      aria-label={isDark ? "In den hellen Modus wechseln" : "In den dunklen Modus wechseln"}
    >
      {isDark ? (
        <Sun className="text-accent h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="text-foreground h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

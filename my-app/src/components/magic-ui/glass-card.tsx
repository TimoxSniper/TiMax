"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "subtle" | "elevated";
}

export function GlassCard({ children, className, hover = true, variant = "default" }: GlassCardProps) {
  // Optimiert für Mobile: Weniger Blur auf kleinen Screens
  const variantClasses = {
    default: "bg-white/70 dark:bg-black/70 backdrop-blur-md sm:backdrop-blur-lg md:backdrop-blur-xl border border-black/10 dark:border-white/10",
    subtle: "bg-white/60 dark:bg-black/60 backdrop-blur-sm sm:backdrop-blur-md md:backdrop-blur-lg border border-black/8 dark:border-white/8",
    elevated: "bg-white/80 dark:bg-black/80 backdrop-blur-lg sm:backdrop-blur-xl md:backdrop-blur-2xl border border-black/15 dark:border-white/15 shadow-2xl",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        variantClasses[variant],
        "transition-all duration-500 ease-out",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]",
        hover && "hover:bg-white/80 dark:hover:bg-black/80 hover:border-black/15 dark:hover:border-white/15 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.08)]",
        className
      )}
    >
      {/* Liquid glass gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 pointer-events-none" />
      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}


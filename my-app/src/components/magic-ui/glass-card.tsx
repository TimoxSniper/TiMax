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
  const variantClasses = {
    default: "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-black/5 dark:border-white/5",
    subtle: "bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-black/5 dark:border-white/5",
    elevated: "bg-white/50 dark:bg-black/50 backdrop-blur-3xl border border-black/10 dark:border-white/10 shadow-lg",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        variantClasses[variant],
        "transition-all duration-500 ease-out",
        hover && "hover:bg-white/50 dark:hover:bg-black/50 hover:border-black/10 dark:hover:border-white/10 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5",
        className
      )}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}


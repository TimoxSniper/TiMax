"use client";

import { cn } from "@/lib/utils";

interface GlowEffectProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "subtle" | "soft" | "accent";
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[32rem] h-[32rem]",
};

const variantClasses = {
  subtle: "bg-black/5 dark:bg-white/5",
  soft: "bg-black/10 dark:bg-white/10",
  accent: "bg-[rgb(var(--accent-rgb)_/_0.08)] dark:bg-[rgb(var(--accent-rgb)_/_0.12)]",
};

export function GlowEffect({ className, size = "lg", variant = "subtle" }: GlowEffectProps) {
  return (
    <>
      {/* Primary glow layer */}
      <div
        className={cn(
          "absolute rounded-full blur-3xl opacity-40 animate-pulse",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        style={{ animationDuration: '6s' }}
        aria-hidden="true"
      />
      {/* Outer glow layer for depth */}
      <div
        className={cn(
          "absolute rounded-full blur-[60px] opacity-20",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-hidden="true"
      />
    </>
  );
}


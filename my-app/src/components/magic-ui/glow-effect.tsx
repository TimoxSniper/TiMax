"use client";

import { cn } from "@/lib/utils";

interface GlowEffectProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "accent" | "purple" | "blue";
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[32rem] h-[32rem]",
};

const colorClasses = {
  primary: "bg-primary/20",
  accent: "bg-accent/20",
  purple: "bg-purple-500/20",
  blue: "bg-blue-500/20",
};

export function GlowEffect({ className, size = "lg", color = "primary" }: GlowEffectProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl opacity-50 animate-pulse",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      aria-hidden="true"
    />
  );
}


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
  // Performance-optimiert: Reduzierter Blur auf Mobile, prefers-reduced-motion Support
  const variantClasses = {
    default: "bg-white/70 dark:bg-black/70 backdrop-blur-sm sm:backdrop-blur-md md:backdrop-blur-lg border border-black/10 dark:border-white/10",
    subtle: "bg-white/60 dark:bg-black/60 backdrop-blur-sm sm:backdrop-blur-md border border-black/8 dark:border-white/8",
    elevated: "bg-white/80 dark:bg-black/80 backdrop-blur-md sm:backdrop-blur-lg md:backdrop-blur-xl border border-black/15 dark:border-white/15 shadow-2xl",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        variantClasses[variant],
        "transition-all duration-300 ease-out",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]",
        hover && "hover:bg-white/80 dark:hover:bg-black/80 hover:border-black/15 dark:hover:border-white/15 hover:shadow-[0_16px_64px_0_rgba(0,0,0,0.2)] dark:hover:shadow-[0_16px_64px_0_rgba(255,255,255,0.12)] hover:scale-[1.02]",
        "will-change-transform",
        className
      )}
    >
      {/* Mehrschichtige Gradient-Overlays für mehr Tiefe */}
      {/* Radialer Gradient von oben links */}
      <div className="absolute inset-0 bg-gradient-radial from-white/30 via-white/10 to-transparent dark:from-white/15 dark:via-white/5 pointer-events-none" />
      {/* Linearer Gradient von oben rechts */}
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-black/5 to-black/10 dark:from-transparent dark:via-white/5 dark:to-white/10 pointer-events-none" />
      {/* Liquid glass gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 pointer-events-none" />
      {/* Subtle border highlight mit mehrschichtigen Rändern */}
      <div className="absolute inset-0 rounded-3xl border border-white/30 dark:border-white/15 pointer-events-none" />
      <div className="absolute inset-[1px] rounded-3xl border border-black/5 dark:border-white/5 pointer-events-none" />
      {/* Innerer Glow-Effekt */}
      <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}


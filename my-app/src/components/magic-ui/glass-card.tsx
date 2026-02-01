"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "subtle" | "outline";
}

export function Card({ children, className, hover = true, variant = "default" }: CardProps) {
  const variantClasses = {
    // Standard: Weiß mit leichtem Schatten (Light), dunkelgrau (Dark)
    default: "bg-card text-card-foreground border border-border shadow-sm",
    // Subtle: Sekundärfarbe, weniger prominent
    subtle: "bg-secondary text-secondary-foreground border border-border",
    // Outline: Nur Rahmen, kein Hintergrund
    outline: "bg-transparent text-foreground border border-border",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        variantClasses[variant],
        "transition-all duration-200 ease-out",
        hover && "hover:shadow-md hover:border-border/80",
        "focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}

// Alias für backward compatibility
export const GlassCard = Card;

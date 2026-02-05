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
    default: "bg-card/80 text-card-foreground border border-border/60 shadow-sm backdrop-blur-sm",
    subtle: "bg-secondary/60 text-secondary-foreground border border-border/40 backdrop-blur-sm",
    outline: "bg-transparent text-foreground border border-border/50",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        variantClasses[variant],
        "transition-all duration-300 ease-out",
        hover && "hover:shadow-md hover:border-[rgb(var(--accent-rgb)_/_0.15)] hover:bg-card",
        "dark:hover:bg-card/90",
        "focus-within:ring-2 focus-within:ring-[rgb(var(--accent-rgb)_/_0.2)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export const GlassCard = Card;

"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EditorialCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "subtle" | "outline" | "accent";
}

export function EditorialCard({ children, className, hover = true, variant = "default" }: EditorialCardProps) {
  const variantClasses = {
    default: "bg-card text-card-foreground border border-border shadow-editorial-md",
    subtle: "bg-secondary text-secondary-foreground border border-border shadow-editorial-sm",
    outline: "bg-transparent text-foreground border-2 border-border",
    accent: "bg-card text-card-foreground border-l-4 border-accent shadow-editorial-md",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px]",
        variantClasses[variant],
        "transition-all duration-300 ease-out cubic-bezier(0.4, 0, 0.2, 1)",
        hover && "hover:shadow-editorial-lg hover:-translate-y-[2px]",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent",
        className
      )}
    >
      {children}
    </div>
  );
}

// Backwards compatibility
export const GlassCard = EditorialCard;
export const Card = EditorialCard;

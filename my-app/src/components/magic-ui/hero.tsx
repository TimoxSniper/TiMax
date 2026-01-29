"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeroProps {
  heading: string;
  subheading: string;
  className?: string;
}

export function Hero({ heading, subheading, className }: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center justify-center space-y-6 text-center", className)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
        <span 
          className={cn(
            "bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text",
            "transition-all duration-1000 ease-out"
          )}
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'inherit', // Fallback falls Gradient nicht funktioniert
          }}
        >
          {heading}
        </span>
      </h1>
      <p 
        className={cn(
          "max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl",
          "transition-all duration-1000 ease-out"
        )}
      >
        {subheading}
      </p>
    </div>
  );
}


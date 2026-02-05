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
            "bg-gradient-to-r from-foreground via-foreground/80 to-[rgb(var(--accent-rgb)_/_0.7)] bg-clip-text",
            "transition-all duration-1000 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'inherit',
            textShadow: '0 0 80px rgb(var(--accent-rgb) / 0.1)',
          }}
        >
          {heading}
        </span>
      </h1>
      <p
        className={cn(
          "max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl",
          "transition-all duration-1000 ease-out delay-150",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        {subheading}
      </p>
    </div>
  );
}


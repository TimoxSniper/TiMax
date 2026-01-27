"use client";

import { cn } from "@/lib/utils";

interface HeroProps {
  heading: string;
  subheading: string;
  className?: string;
}

export function Hero({ heading, subheading, className }: HeroProps) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center space-y-6 text-center", className)}>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
          {heading}
        </span>
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
        {subheading}
      </p>
    </div>
  );
}


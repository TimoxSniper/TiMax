"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeroProps {
  heading: string;
  subheading: string;
  className?: string;
  align?: "center" | "left";
}

export function Hero({ heading, subheading, className, align = "center" }: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const alignClasses = align === "left" ? "text-left" : "text-center";

  return (
    <div className={cn(`relative flex flex-col justify-center space-y-6 ${alignClasses}`, className)}>
      <h1 className={cn("font-serif font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground", "transition-all duration-500 ease-out cubic-bezier(0.4, 0, 0.2, 1)", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        {heading}
      </h1>
      <div className={cn("transition-all duration-500 ease-out delay-100", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="w-24 h-1 bg-accent" />
      </div>
      <p
        className={cn(
          "max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl font-sans leading-relaxed",
          "transition-all duration-500 ease-out delay-150",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {subheading}
      </p>
    </div>
  );
}


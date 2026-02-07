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
  const dividerClasses = align === "left" ? "" : "mx-auto";

  return (
    <div
      className={cn(
        `relative flex flex-col justify-center space-y-4 sm:space-y-6 ${alignClasses}`,
        className
      )}
    >
      <h1
        className={cn(
          "text-foreground font-serif font-bold tracking-tight",
          "text-3xl sm:text-5xl md:text-6xl lg:text-7xl",
          "transition-all duration-500 ease-out",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        {heading}
      </h1>
      <div
        className={cn(
          "transition-all delay-100 duration-500 ease-out",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className={cn("bg-accent h-1 w-16 sm:w-24", dividerClasses)} />
      </div>
      <p
        className={cn(
          "text-muted-foreground font-sans leading-relaxed",
          "text-base sm:text-lg md:text-xl lg:text-2xl",
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
          "transition-all delay-150 duration-500 ease-out",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        {subheading}
      </p>
    </div>
  );
}

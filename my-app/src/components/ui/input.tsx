import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:text-foreground border-border h-11 w-full min-w-0 border-0 border-b-2 bg-transparent px-0 py-2 text-base transition-all duration-300 outline-none selection:bg-[rgb(var(--accent-rgb)_/_0.2)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
        "focus-visible:border-accent focus-visible:border-b-2 focus-visible:outline-none",
        "aria-invalid:border-b-destructive dark:aria-invalid:border-b-destructive aria-invalid:border-b-4",
        className
      )}
      {...props}
    />
  );
}

export { Input };

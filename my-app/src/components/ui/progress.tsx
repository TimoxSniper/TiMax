"use client";

import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={`w-full bg-muted rounded-full overflow-hidden ${className || ""}`}
    >
      <div
        className="h-2 bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

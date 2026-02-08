"use client";

import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div className={`bg-secondary w-full overflow-hidden rounded-[4px] ${className || ""}`}>
      <div
        className={`cubic-bezier(0.4, 0, 0.2, 1) h-2 transition-all duration-500 ease-out ${indicatorClassName || "bg-accent"}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

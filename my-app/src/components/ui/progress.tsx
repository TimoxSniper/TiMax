"use client";

import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={`w-full bg-secondary rounded-[4px] overflow-hidden ${className || ""}`}
    >
      <div
        className="h-2 bg-accent transition-all duration-500 ease-out cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

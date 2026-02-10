/**
 * Status Badge Component
 *
 * Displays status indicators with Editorial Modernism styling
 */

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-[4px] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide font-sans shadow-editorial-sm transition-all",
  {
    variants: {
      status: {
        completed: "bg-accent/10 text-accent dark:bg-accent/20",
        processing: "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-500",
        failed: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        pending: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500",
        cancelled: "bg-muted/50 text-muted-foreground",
        active: "bg-accent/10 text-accent dark:bg-accent/20",
        banned: "bg-destructive/10 text-destructive dark:bg-destructive/20",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const displayLabel = label || (status ? status.replace("_", " ") : "Unknown");

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {displayLabel}
    </span>
  );
}

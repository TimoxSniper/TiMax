/**
 * Stat Card Component
 *
 * Displays key metrics with optional trend indicator
 * Editorial Modernism design with sharp shadows
 */

import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/admin/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs. last period",
  icon,
  trend,
  className,
}: StatCardProps) {
  // Auto-detect trend from change if not provided
  const effectiveTrend = trend || (change && change > 0 ? "up" : change && change < 0 ? "down" : "neutral");

  const trendIcon = {
    up: <ArrowUp className="h-3 w-3" />,
    down: <ArrowDown className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />,
  }[effectiveTrend];

  const trendColor = {
    up: "text-accent",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }[effectiveTrend];

  return (
    <Card className={cn("p-6 shadow-editorial-md hover:shadow-editorial-lift transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-sans text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-serif font-bold">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              {trendIcon}
              <span className="font-semibold">
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground text-xs ml-1">
                {changeLabel}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-[6px] bg-accent/10 text-accent">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

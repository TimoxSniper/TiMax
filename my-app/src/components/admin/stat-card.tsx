"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card className={cn("hover:shadow-editorial-lift", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
      </CardHeader>
      <CardContent>
        <div className="font-serif text-2xl font-bold">{value}</div>
        {(change !== undefined || changeLabel) && (
          <div className="mt-1 flex items-center text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  "mr-2 font-medium",
                  isPositive ? "text-green-600 dark:text-green-400" : "",
                  isNegative ? "text-red-600 dark:text-red-400" : "",
                  change === 0 && "text-muted-foreground"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
            )}
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

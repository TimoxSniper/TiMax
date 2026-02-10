/**
 * Empty State Component
 *
 * Displays a friendly empty state message with optional action
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("p-12 text-center shadow-editorial-md", className)}>
      <div className="flex flex-col items-center gap-4">
        {icon && (
          <div className="p-4 rounded-full bg-muted/50 text-muted-foreground">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground font-sans max-w-md">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            className="rounded-[4px] shadow-editorial-sm mt-2"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

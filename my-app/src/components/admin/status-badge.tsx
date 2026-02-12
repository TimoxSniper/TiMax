import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status:
    | "completed"
    | "processing"
    | "failed"
    | "pending"
    | "cancelled"
    | "healthy"
    | "degraded"
    | "down";
  className?: string;
}

const statusConfig: Record<
  StatusBadgeProps["status"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  completed: { variant: "default", label: "Abgeschlossen" },
  processing: { variant: "secondary", label: "In Bearbeitung" },
  failed: { variant: "destructive", label: "Fehlgeschlagen" },
  pending: { variant: "secondary", label: "Ausstehend" },
  cancelled: { variant: "outline", label: "Abgebrochen" },
  healthy: { variant: "default", label: "Gesund" },
  degraded: { variant: "secondary", label: "Eingeschränkt" },
  down: { variant: "destructive", label: "Offline" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: "secondary", label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

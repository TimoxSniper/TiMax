/**
 * Health Monitor Component
 *
 * Displays real-time system health metrics
 */

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SystemHealth } from "@/types/admin";

export function HealthMonitor() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/system/health");
      const { data } = await res.json();
      setHealth(data);
    } catch (error) {
      console.error("Failed to fetch health:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 shadow-editorial-md">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className="p-6 shadow-editorial-md">
        <p className="text-muted-foreground">Failed to load system health</p>
      </Card>
    );
  }

  const statusIcon = {
    healthy: <CheckCircle2 className="h-6 w-6 text-accent" />,
    degraded: <AlertCircle className="h-6 w-6 text-yellow-600" />,
    down: <XCircle className="h-6 w-6 text-destructive" />,
  }[health.status];

  const statusColor = {
    healthy: "bg-accent/10 text-accent",
    degraded: "bg-yellow-500/10 text-yellow-600",
    down: "bg-destructive/10 text-destructive",
  }[health.status];

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="p-6 shadow-editorial-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {statusIcon}
          <h3 className="font-serif text-xl font-bold">System Health</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${statusColor} rounded-[4px] uppercase tracking-wide`}>
            {health.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealth}
            disabled={isRefreshing}
            className="rounded-[4px]"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
            Database
          </p>
          <div className="flex items-center gap-2">
            {health.databaseConnected ? (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-semibold">
              {health.databaseConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
            Storage
          </p>
          <div className="flex items-center gap-2">
            {health.storageConnected ? (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-semibold">
              {health.storageConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
            API Response
          </p>
          <span className="font-semibold font-mono text-lg">
            {health.apiResponseTime}ms
          </span>
        </div>

        <div>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
            Uptime
          </p>
          <span className="font-semibold font-mono text-lg">
            {formatUptime(health.uptime)}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
            Active Users (7 days)
          </p>
          <span className="font-serif text-2xl font-bold">{health.activeUsers}</span>
        </div>
      </div>
    </Card>
  );
}

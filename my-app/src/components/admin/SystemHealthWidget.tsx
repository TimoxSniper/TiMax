"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "down";
}

interface HealthData {
  overallStatus: "healthy" | "degraded" | "down";
  checks: HealthCheck[];
}

export function SystemHealthWidget() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      const response = await fetch("/api/admin/health");
      const result = await response.json();

      if (result.success) {
        setHealth(result.health);
      }
    } catch (error) {
      console.error("Failed to load health:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "healthy":
        return "Alle Systeme betriebsbereit";
      case "degraded":
        return "Eingeschränkte Verfügbarkeit";
      case "down":
        return "Systemprobleme erkannt";
      default:
        return "Status unbekannt";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Systemstatus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            {getStatusIcon(health.overallStatus)}
            <div className="flex-1">
              <p className="font-medium">{getStatusText(health.overallStatus)}</p>
              <p className="text-sm text-muted-foreground">
                {health.checks.filter((c) => c.status === "healthy").length} von{" "}
                {health.checks.length} Services betriebsbereit
              </p>
            </div>
          </div>

          {/* Service Status Summary */}
          <div className="space-y-2">
            {health.checks.slice(0, 3).map((check) => (
              <div
                key={check.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{check.name}</span>
                {getStatusIcon(check.status)}
              </div>
            ))}
          </div>

          {/* Link to full health page */}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/health">
              Detaillierte Ansicht
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

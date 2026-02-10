"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Database,
  Zap,
  Clock,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  details?: string;
}

interface HealthData {
  overallStatus: "healthy" | "degraded" | "down";
  avgResponseTime: number;
  timestamp: string;
  checks: HealthCheck[];
}

export default function AdminHealth() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHealthCheck();
    const interval = setInterval(loadHealthCheck, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthCheck = async () => {
    if (!isRefreshing) setIsLoading(true);
    try {
      const response = await fetch("/api/admin/health");
      const data = await response.json();
      if (data.success) {
        setHealthData(data.health);
      }
    } catch (error) {
      console.error("Failed to load health check:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadHealthCheck();
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getOverallStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return CheckCircle2;
      case "degraded":
        return AlertTriangle;
      case "down":
        return XCircle;
      default:
        return Activity;
    }
  };

  const getServiceIcon = (name: string) => {
    if (name.includes("Database")) return Database;
    if (name.includes("Webhook")) return Zap;
    if (name.includes("Redis")) return Activity;
    return Activity;
  };

  if (isLoading && !healthData) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">System Health Check</h1>
            <p className="text-muted-foreground mt-1">Systemstatus und Service-Verfügbarkeit</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Aktualisieren
          </Button>
        </div>

        {healthData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const StatusIcon = getOverallStatusIcon(healthData.overallStatus);
                    return (
                      <StatusIcon className={getOverallStatusColor(healthData.overallStatus)} />
                    );
                  })()}
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <StatusBadge status={healthData.overallStatus} />
                    <p className="text-muted-foreground mt-2 text-sm">
                      Durchschnittliche Antwortzeit:{" "}
                      <span className="text-foreground font-medium">
                        {healthData.avgResponseTime}ms
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {formatDateTime(healthData.timestamp)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {healthData.checks.map((check) => {
                const ServiceIcon = getServiceIcon(check.name);
                return (
                  <Card
                    key={check.name}
                    className={check.status === "down" ? "border-destructive" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <ServiceIcon
                            className={
                              check.status === "healthy"
                                ? "text-green-600"
                                : check.status === "degraded"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          />
                          {check.name}
                        </CardTitle>
                        <StatusBadge status={check.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Antwortzeit</span>
                          <span className="font-medium">{check.responseTime}ms</span>
                        </div>
                        {check.details && (
                          <div className="bg-secondary/50 rounded-md p-2 text-xs">
                            <span className="text-muted-foreground">Details:</span>{" "}
                            <span className="text-muted-foreground/70">{check.details}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Legende</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm">
                      <span className="font-medium">Gesund:</span> Service funktioniert normal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm">
                      <span className="font-medium">Eingeschränkt:</span> Service eingeschränkt
                      verfügbar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm">
                      <span className="font-medium">Offline:</span> Service nicht verfügbar
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

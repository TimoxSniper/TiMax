"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const ALERT_ICONS = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const ALERT_COLORS = {
  error: "text-red-600 border-red-200 bg-red-50",
  warning: "text-yellow-600 border-yellow-200 bg-yellow-50",
  info: "text-blue-600 border-blue-200 bg-blue-50",
  success: "text-green-600 border-green-200 bg-green-50",
};

export function AlertCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch("/api/admin/alerts");
      const result = await response.json();

      if (result.success) {
        setAlerts(result.alerts);
      }
    } catch (error) {
      console.error("Failed to load alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      // Get CSRF token
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      await fetch(`/api/admin/alerts/${alertId}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      setAlerts(alerts.filter((a) => a.id !== alertId));
    } catch (error) {
      console.error("Failed to dismiss alert:", error);
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  if (isLoading) {
    return (
      <Card className="shadow-editorial-md border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-editorial-md border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 font-serif text-2xl font-semibold">
            <Bell className="h-6 w-6 text-primary" />
            Benachrichtigungen
          </CardTitle>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white">
              {unreadCount} neu
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Keine Benachrichtigungen
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Alle Systeme laufen einwandfrei
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert) => {
              const Icon = ALERT_ICONS[alert.type];
              const colorClass = ALERT_COLORS[alert.type];

              return (
                <div
                  key={alert.id}
                  className={`group relative p-4 transition-colors hover:bg-accent/5 ${
                    !alert.read ? "bg-accent/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 rounded-lg border p-2 ${colorClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            {alert.title}
                          </h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {formatDateTime(alert.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

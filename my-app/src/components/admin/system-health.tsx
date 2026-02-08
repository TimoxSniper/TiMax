"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface SystemHealthProps {
  stats: {
    totalUsers: number;
    totalChats: number;
    totalMessages: number;
    totalUploads: number;
  } | null;
  isLoading: boolean;
}

export function SystemHealth({ stats, isLoading }: SystemHealthProps) {
  // Mock system metrics - in production, fetch from monitoring service
  const systemMetrics = {
    apiStatus: "operational",
    apiUptime: 99.98,
    apiResponseTime: 124,
    databaseStatus: "operational",
    databaseConnections: 45,
    databaseMaxConnections: 100,
    cpuUsage: 32,
    memoryUsage: 68,
    storageUsage: 42,
    storageTotal: 1000,
    storageUsed: 420,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "degraded":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
      case "down":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle2;
      case "degraded":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-rose-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-editorial-md">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(systemMetrics.apiStatus);

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card className="border-2 border-emerald-200/50 shadow-editorial-md dark:border-emerald-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">System-Status</CardTitle>
              <CardDescription>Echtzeit-Überwachung aller Systemkomponenten</CardDescription>
            </div>
            <Badge
              className={`${getStatusColor(systemMetrics.apiStatus)} gap-1.5 text-sm font-semibold`}
            >
              <StatusIcon className="h-4 w-4" />
              Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border-2 border-emerald-200/50 bg-emerald-50/50 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold">Uptime</span>
              </div>
              <div className="font-serif text-3xl font-bold">{systemMetrics.apiUptime}%</div>
              <p className="text-muted-foreground mt-1 text-xs">Letzte 30 Tage</p>
            </div>

            <div className="rounded-lg border-2 border-blue-200/50 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold">Response Time</span>
              </div>
              <div className="font-serif text-3xl font-bold">{systemMetrics.apiResponseTime}ms</div>
              <p className="text-muted-foreground mt-1 text-xs">Durchschnitt</p>
            </div>

            <div className="rounded-lg border-2 border-purple-200/50 bg-purple-50/50 p-4 dark:border-purple-800/50 dark:bg-purple-950/20">
              <div className="mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold">DB Connections</span>
              </div>
              <div className="font-serif text-3xl font-bold">
                {systemMetrics.databaseConnections}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                von {systemMetrics.databaseMaxConnections}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-editorial-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Cpu className="text-accent h-5 w-5" />
              CPU & Memory
            </CardTitle>
            <CardDescription>Prozessor- und Speicherauslastung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">CPU Auslastung</span>
                <span className="text-muted-foreground">{systemMetrics.cpuUsage}%</span>
              </div>
              <Progress
                value={systemMetrics.cpuUsage}
                className="h-3"
                indicatorClassName={getUsageColor(systemMetrics.cpuUsage)}
              />
              <p className="text-muted-foreground text-xs">
                {systemMetrics.cpuUsage < 50
                  ? "Normale Auslastung"
                  : systemMetrics.cpuUsage < 80
                    ? "Erhöhte Auslastung"
                    : "Hohe Auslastung"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Memory Auslastung</span>
                <span className="text-muted-foreground">{systemMetrics.memoryUsage}%</span>
              </div>
              <Progress
                value={systemMetrics.memoryUsage}
                className="h-3"
                indicatorClassName={getUsageColor(systemMetrics.memoryUsage)}
              />
              <p className="text-muted-foreground text-xs">
                {systemMetrics.memoryUsage < 50
                  ? "Normale Auslastung"
                  : systemMetrics.memoryUsage < 80
                    ? "Erhöhte Auslastung"
                    : "Hohe Auslastung"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-editorial-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <HardDrive className="text-accent h-5 w-5" />
              Storage
            </CardTitle>
            <CardDescription>Speicherplatz und Datenbank</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Speicherplatz</span>
                <span className="text-muted-foreground">
                  {systemMetrics.storageUsed} GB / {systemMetrics.storageTotal} GB
                </span>
              </div>
              <Progress
                value={systemMetrics.storageUsage}
                className="h-3"
                indicatorClassName={getUsageColor(systemMetrics.storageUsage)}
              />
              <p className="text-muted-foreground text-xs">
                {systemMetrics.storageTotal - systemMetrics.storageUsed} GB verfügbar
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Datenbank-Status</span>
                <Badge
                  className={`${getStatusColor(systemMetrics.databaseStatus)} text-xs`}
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-muted-foreground text-xs font-medium">Total Items</div>
                  <div className="mt-1 font-serif text-xl font-bold">
                    {(stats?.totalChats || 0) + (stats?.totalUploads || 0)}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-muted-foreground text-xs font-medium">Total Users</div>
                  <div className="mt-1 font-serif text-xl font-bold">{stats?.totalUsers || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="shadow-editorial-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <Server className="text-accent h-5 w-5" />
            Dienste-Status
          </CardTitle>
          <CardDescription>Übersicht aller laufenden Dienste</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "API Server", status: "operational" },
              { name: "Database", status: "operational" },
              { name: "File Storage", status: "operational" },
              { name: "Email Service", status: "operational" },
            ].map((service) => {
              const ServiceIcon = getStatusIcon(service.status);
              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-lg border-2 p-3"
                >
                  <span className="text-sm font-semibold">{service.name}</span>
                  <Badge className={`${getStatusColor(service.status)} gap-1 text-xs`}>
                    <ServiceIcon className="h-3 w-3" />
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

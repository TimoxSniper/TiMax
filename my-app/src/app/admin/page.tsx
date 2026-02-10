"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { StatCard } from "@/components/admin/stat-card";
import { useAdmin } from "@/contexts/admin-context";
import { Users, MessageSquare, Upload, Database, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export default function AdminDashboard() {
  const { stats, isStatsLoading, fetchStats } = useAdmin();
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(), 30000);
    setRefreshInterval(interval);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchStats]);

  const handleRefresh = () => {
    fetchStats();
    if (refreshInterval) {
      clearInterval(refreshInterval);
      const newInterval = setInterval(() => fetchStats(), 30000);
      setRefreshInterval(newInterval);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Übersicht aller wichtigen Metriken und Statistiken
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isStatsLoading}>
            {isStatsLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Clock className="mr-2 h-4 w-4" />
            )}
            Aktualisieren
          </Button>
        </div>

        {isStatsLoading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Gesamte Benutzer"
                value={stats?.totalUsers || 0}
                icon={Users}
                iconColor="text-blue-600"
              />
              <StatCard
                title="Aktive Benutzer (7 Tage)"
                value={stats?.activeUsers || 0}
                icon={CheckCircle2}
                iconColor="text-green-600"
              />
              <StatCard
                title="Gesamte Chats"
                value={stats?.totalChats || 0}
                icon={MessageSquare}
                iconColor="text-purple-600"
              />
              <StatCard
                title="Gesamte Uploads"
                value={stats?.totalUploads || 0}
                icon={Upload}
                iconColor="text-orange-600"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ausstehend</span>
                      <Badge variant="secondary">{stats?.uploadsByStatus?.pending || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">In Bearbeitung</span>
                      <Badge variant="secondary">{stats?.uploadsByStatus?.processing || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Abgeschlossen</span>
                      <Badge variant="default">{stats?.uploadsByStatus?.completed || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fehlgeschlagen</span>
                      <Badge variant="destructive">{stats?.uploadsByStatus?.failed || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Abgebrochen</span>
                      <Badge variant="outline">{stats?.uploadsByStatus?.cancelled || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Speichernutzung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-primary font-serif text-4xl font-bold">
                        {formatBytes(stats?.totalStorageBytes || 0)}
                      </div>
                      <p className="text-muted-foreground mt-2">Gesamter Speicherplatz</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Nach Dateityp:</p>
                      {Object.entries(stats?.uploadsByType || {}).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{type}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Benutzer verwalten
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/chats">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chats moderieren
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/uploads">
                      <Upload className="mr-2 h-4 w-4" />
                      Uploads prüfen
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/admin/health">
                      <Database className="mr-2 h-4 w-4" />
                      System Status
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

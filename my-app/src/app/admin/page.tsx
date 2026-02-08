"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsCards } from "@/components/admin/stats-cards";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { QuickActions } from "@/components/admin/quick-actions";
import { RecentActivity } from "@/components/admin/recent-activity";
import { SystemHealth } from "@/components/admin/system-health";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { AdminProvider, useAdmin } from "@/contexts/admin-context";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DashboardContent() {
  const {
    stats,
    isStatsLoading,
    fetchStats,
    filteredChats,
    isChatsLoading,
    fetchChats,
    deleteChat,
    filteredUploads,
    isUploadsLoading,
    fetchUploads,
    deleteUpload,
    filteredUsers,
    fetchUsers,
  } = useAdmin();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchStats(), fetchChats(1), fetchUploads(1), fetchUsers(1)]);
      showToast("Dashboard erfolgreich aktualisiert", "success");
    } catch (error) {
      logger.error("Fehler beim Aktualisieren:", error);
      showToast("Fehler beim Aktualisieren des Dashboards", "error");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchStats, fetchChats, fetchUploads, fetchUsers, showToast]);

  useEffect(() => {
    fetchStats();
    fetchChats(1);
    fetchUploads(1);
    fetchUsers(1);
  }, [fetchStats, fetchChats, fetchUploads, fetchUsers]);

  // Calculate growth metrics
  const calculateGrowth = () => {
    if (!stats) return { users: 0, chats: 0, uploads: 0 };
    // Mock growth calculations - in production, compare with previous period
    return {
      users: 12.5,
      chats: 8.3,
      uploads: 15.7,
    };
  };

  const growth = calculateGrowth();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section with Editorial Modernism styling */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
              Dashboard
            </h1>
            <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl text-base lg:text-lg">
            Echtzeit-Übersicht über alle Aktivitäten, Analysen und Systemmetriken auf TiMax
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-accent h-2 w-2 rounded-full" />
              <span className="text-muted-foreground">
                Letzte Aktualisierung: {new Date().toLocaleTimeString("de-DE")}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="default"
          onClick={handleRefresh}
          disabled={isRefreshing || isStatsLoading || isChatsLoading || isUploadsLoading}
          className="h-12 gap-2 px-6 text-base font-medium shadow-editorial-md hover:shadow-editorial-lg"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Aktualisieren</span>
        </Button>
      </div>

      {/* Stats Cards - Enhanced with growth indicators */}
      <StatsCards stats={stats} isLoading={isStatsLoading} growth={growth} />

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-12 w-full justify-start gap-2 rounded-lg bg-muted p-1.5 lg:w-auto">
          <TabsTrigger
            value="overview"
            className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:shadow-editorial-sm"
          >
            Übersicht
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:shadow-editorial-sm"
          >
            Analysen
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:shadow-editorial-sm"
          >
            Aktivitäten
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="rounded-md px-6 py-2.5 text-sm font-semibold transition-all data-[state=active]:shadow-editorial-sm"
          >
            System
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity - 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivity
                chats={filteredChats}
                uploads={filteredUploads}
                isLoading={isChatsLoading || isUploadsLoading}
              />
            </div>

            {/* Activity Timeline - 1 column */}
            <div className="lg:col-span-1">
              <ActivityTimeline
                chats={filteredChats}
                uploads={filteredUploads}
                isLoading={isChatsLoading || isUploadsLoading}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="shadow-editorial-md transition-shadow hover:shadow-editorial-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <TrendingUp className="text-accent h-5 w-5" />
                  Engagement Rate
                </CardTitle>
                <CardDescription>Durchschnittliche Nutzeraktivität</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold">78.5%</span>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      +5.2%
                    </Badge>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div className="bg-accent h-full rounded-full" style={{ width: "78.5%" }} />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {stats && stats.totalUsers > 0
                      ? Math.round((stats.totalChats / stats.totalUsers) * 100)
                      : 0}
                    % der Nutzer sind aktiv
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-editorial-md transition-shadow hover:shadow-editorial-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  Durchschn. Nachrichten
                </CardTitle>
                <CardDescription>Pro Chat-Sitzung</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold">
                      {stats && stats.totalChats > 0
                        ? (stats.totalMessages / stats.totalChats).toFixed(1)
                        : "0"}
                    </span>
                    <span className="text-muted-foreground text-sm">Nachrichten</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Gesamt: {stats?.totalMessages.toLocaleString("de-DE") || 0} Nachrichten
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-editorial-md transition-shadow hover:shadow-editorial-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  Upload Success Rate
                </CardTitle>
                <CardDescription>Erfolgreich abgeschlossen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold">
                      {stats && stats.totalUploads > 0
                        ? Math.round(
                            ((stats.uploadsByStatus?.completed || 0) / stats.totalUploads) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-accent h-full rounded-full"
                      style={{
                        width: `${stats && stats.totalUploads > 0 ? Math.round(((stats.uploadsByStatus?.completed || 0) / stats.totalUploads) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {stats?.uploadsByStatus?.completed || 0} von {stats?.totalUploads || 0} Uploads
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <AnalyticsChart stats={stats} isLoading={isStatsLoading} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity
              chats={filteredChats}
              uploads={filteredUploads}
              isLoading={isChatsLoading || isUploadsLoading}
              showAll
            />
            <ActivityTimeline
              chats={filteredChats}
              uploads={filteredUploads}
              isLoading={isChatsLoading || isUploadsLoading}
              extended
            />
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <SystemHealth stats={stats} isLoading={isStatsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();

  return (
    <AdminProvider onToast={showToast}>
      <DashboardContent />
    </AdminProvider>
  );
}

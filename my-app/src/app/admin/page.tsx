"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsCards } from "@/components/admin/stats-cards";
import { ChatsTable } from "@/components/admin/chats-table";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { AdminProvider, useAdmin } from "@/contexts/admin-context";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity, MessageSquare, FileAudio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  } = useAdmin();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchStats(), fetchChats(1), fetchUploads(1)]);
      showToast("Dashboard aktualisiert", "success");
    } catch (error) {
      logger.error("Fehler beim Aktualisieren:", error);
      showToast("Fehler beim Aktualisieren", "error");
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchStats, fetchChats, fetchUploads, showToast]);

  useEffect(() => {
    fetchStats();
    fetchChats(1);
    fetchUploads(1);
  }, [fetchStats, fetchChats, fetchUploads]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Übersicht über alle Aktivitäten auf TiMax</p>
        </div>
        <Button
          variant="default"
          onClick={handleRefresh}
          disabled={isRefreshing || isStatsLoading || isChatsLoading || isUploadsLoading}
          className="h-12 gap-2 px-6 text-base font-medium"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Aktualisieren</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Dashboard Metrics Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Activity */}
        <Card className="border-accent/20 border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Activity className="text-accent h-6 w-6" />
              Plattformaktivität
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <span className="text-muted-foreground font-medium">Gesamtaktivität</span>
                <span className="font-serif text-xl font-bold">
                  {stats ? stats.totalChats + stats.totalUploads : 0}
                </span>
              </div>
              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <span className="text-muted-foreground font-medium">Durchschnitt pro Benutzer</span>
                <span className="font-serif text-xl font-bold">
                  {stats && stats.totalUsers > 0
                    ? Math.round((stats.totalChats + stats.totalUploads) / stats.totalUsers)
                    : 0}
                </span>
              </div>
              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <span className="text-muted-foreground font-medium">Nachrichten pro Chat</span>
                <span className="font-serif text-xl font-bold">
                  {stats && stats.totalChats > 0
                    ? Math.round(stats.totalMessages / stats.totalChats)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card className="border-2 border-blue-500/20 shadow-lg lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              Letzte Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isChatsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-muted/30 h-12 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                filteredChats.slice(0, 3).map((chat) => (
                  <div
                    key={chat.id}
                    className="bg-muted/30 hover:bg-muted/50 rounded-lg p-3 transition-colors"
                  >
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(chat.created_at).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card className="border-2 border-green-500/20 shadow-lg lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <FileAudio className="h-6 w-6 text-green-500" />
              Letzte Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isUploadsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-muted/30 h-12 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                filteredUploads.slice(0, 3).map((upload) => (
                  <div
                    key={upload.id}
                    className="bg-muted/30 hover:bg-muted/50 rounded-lg p-3 transition-colors"
                  >
                    <div className="truncate font-medium">{upload.file_name}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(upload.created_at).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Activity Tables */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Full Chats Table */}
        <Card className="border-2 border-blue-500/10 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Chat Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChatsTable
              chats={filteredChats.slice(0, 5)}
              isLoading={isChatsLoading}
              onDelete={deleteChat}
            />
          </CardContent>
        </Card>

        {/* Full Uploads Table */}
        <Card className="border-2 border-green-500/10 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <FileAudio className="h-5 w-5 text-green-500" />
              Upload Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadsTable
              uploads={filteredUploads.slice(0, 5)}
              isLoading={isUploadsLoading}
              onDelete={deleteUpload}
            />
          </CardContent>
        </Card>
      </div>
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

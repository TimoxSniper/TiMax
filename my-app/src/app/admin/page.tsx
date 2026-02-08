"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsCards } from "@/components/admin/stats-cards";
import { ChatsTable } from "@/components/admin/chats-table";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { AdminProvider, useAdmin } from "@/contexts/admin-context";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Übersicht über alle Aktivitäten auf TiMax
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || isStatsLoading || isChatsLoading || isUploadsLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Aktualisieren</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Recent Activity */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Recent Chats */}
        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold md:mb-4 md:text-xl">Letzte Chats</h2>
          <ChatsTable
            chats={filteredChats.slice(0, 5)}
            isLoading={isChatsLoading}
            onDelete={deleteChat}
          />
        </div>

        {/* Recent Uploads */}
        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold md:mb-4 md:text-xl">
            Letzte Uploads
          </h2>
          <UploadsTable
            uploads={filteredUploads.slice(0, 5)}
            isLoading={isUploadsLoading}
            onDelete={deleteUpload}
          />
        </div>
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

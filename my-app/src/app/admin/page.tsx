"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/admin/stats-cards";
import { ChatsTable } from "@/components/admin/chats-table";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";

interface Stats {
  totalUsers: number;
  totalChats: number;
  totalMessages: number;
  totalUploads: number;
  uploadsByStatus: Record<string, number>;
  uploadsByType: Record<string, number>;
}

interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [recentUploads, setRecentUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, chatsRes, uploadsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/chats?limit=5"),
        fetch("/api/admin/uploads?limit=5"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setRecentChats(chatsData.chats || []);
      }

      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        setRecentUploads(uploadsData.uploads || []);
      }
    } catch (error) {
      logger.error("Fehler beim Laden der Dashboard-Daten:", error);
      showToast("Dashboard-Daten konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteChat = async (chatId: string) => {
    const res = await fetch(`/api/admin/chats/${chatId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Chat wurde gelöscht", "success");
      fetchData();
    } else {
      showToast("Chat konnte nicht gelöscht werden", "error");
    }
  };

  const handleDeleteUpload = async (uploadId: string) => {
    const res = await fetch(`/api/admin/uploads/${uploadId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Upload wurde gelöscht", "success");
      fetchData();
    } else {
      showToast("Upload konnte nicht gelöscht werden", "error");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Übersicht über alle Aktivitäten auf TiMax
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Recent Activity */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Recent Chats */}
        <div>
          <h2 className="font-serif text-lg md:text-xl font-semibold mb-3 md:mb-4">Letzte Chats</h2>
          <ChatsTable
            chats={recentChats}
            isLoading={isLoading}
            onDelete={handleDeleteChat}
          />
        </div>

        {/* Recent Uploads */}
        <div>
          <h2 className="font-serif text-lg md:text-xl font-semibold mb-3 md:mb-4">Letzte Uploads</h2>
          <UploadsTable
            uploads={recentUploads}
            isLoading={isLoading}
            onDelete={handleDeleteUpload}
          />
        </div>
      </div>
    </div>
  );
}

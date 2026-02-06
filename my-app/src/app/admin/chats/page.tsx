"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatsTable } from "@/components/admin/chats-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminChatsPage() {
  const searchParams = useSearchParams();
  const userIdFilter = searchParams.get("userId");
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const fetchChats = async (page: number) => {
    setIsLoading(true);
    try {
      let url = `/api/admin/chats?page=${page}&limit=20`;
      if (userIdFilter) {
        url += `&userId=${encodeURIComponent(userIdFilter)}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
        setPagination(data.pagination);
      } else {
        throw new Error("Fehler beim Laden");
      }
    } catch (error) {
      logger.error("Fehler beim Laden der Chats:", error);
      showToast("Chats konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchChats(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchChats(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (chatId: string) => {
    const res = await fetch(`/api/admin/chats/${chatId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Chat wurde gelöscht", "success");
      fetchChats(currentPage);
    } else {
      showToast("Chat konnte nicht gelöscht werden", "error");
    }
  };

  const clearFilter = () => {
    window.history.pushState({}, "", "/admin/chats");
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold">Chats</h1>
        <p className="text-muted-foreground mt-1">
          Alle Chat-Verläufe der Benutzer
        </p>
      </div>

      {/* Filter Badge */}
      {userIdFilter && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
          <span className="text-sm">
            Gefiltert nach User: <code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">{userIdFilter}</code>
          </span>
          <Button variant="ghost" size="icon-xs" onClick={clearFilter}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Chats Table */}
      <ChatsTable
        chats={chats}
        isLoading={isLoading}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}

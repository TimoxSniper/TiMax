"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatsTable } from "@/components/admin/chats-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const router = useRouter();
  const userIdFilter = searchParams.get("userId");
  const timeFilter = searchParams.get("timeFilter");

  const [chats, setChats] = useState<Chat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const fetchChats = async (page: number) => {
    setIsLoading(true);
    try {
      let url = `/api/admin/chats?page=${page}&limit=20`;
      if (userIdFilter) {
        url += `&userId=${encodeURIComponent(userIdFilter)}`;
      }
      if (timeFilter) {
        url += `&timeFilter=${encodeURIComponent(timeFilter)}`;
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
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setIsInitialLoad(true);
    fetchChats(1);
  }, [userIdFilter, timeFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchChats(currentPage);
    }
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

  const clearUserFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("userId");
    router.push(`/admin/chats${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const setTimeFilterValue = (filter: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter) {
      params.set("timeFilter", filter);
    } else {
      params.delete("timeFilter");
    }
    router.push(`/admin/chats${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "today": return "Heute";
      case "week": return "Diese Woche";
      case "month": return "Dieser Monat";
      default: return "Alle Zeit";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Chats</h1>
          <p className="text-muted-foreground mt-1">
            Alle Chat-Verläufe der Benutzer
          </p>
        </div>

        {/* Zeit-Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {getTimeFilterLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeFilterValue(null)}>
              Alle Zeit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("today")}>
              Heute
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("week")}>
              Diese Woche
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("month")}>
              Dieser Monat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Badges */}
      <div className="flex gap-2">
        {userIdFilter && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm">
            <span>
              User: <code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">{userIdFilter}</code>
            </span>
            <Button variant="ghost" size="icon-xs" onClick={clearUserFilter}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Chats Table */}
      <ChatsTable
        chats={chats}
        isLoading={isInitialLoad}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}

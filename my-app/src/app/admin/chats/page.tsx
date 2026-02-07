"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatsTable } from "@/components/admin/chats-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar, Search, RefreshCw, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON } from "@/lib/admin/export";

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
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  const fetchChats = useCallback(
    async (page: number) => {
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
          setFilteredChats(data.chats || []);
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
    },
    [userIdFilter, timeFilter, showToast]
  );

  useEffect(() => {
    setCurrentPage(1);
    setIsInitialLoad(true);
    fetchChats(1);
  }, [fetchChats]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = chats.filter((chat) => {
      const title = chat.title.toLowerCase();
      const userId = chat.user_id.toLowerCase();

      return title.includes(query) || userId.includes(query);
    });

    setFilteredChats(filtered);
  }, [searchQuery, chats]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchChats(currentPage);
    }
  }, [currentPage, fetchChats]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (chatId: string) => {
    const csrfResponse = await fetch("/api/csrf");
    const { csrfToken } = await csrfResponse.json();
    const res = await fetch(`/api/admin/chats/${chatId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });
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
      case "today":
        return "Heute";
      case "week":
        return "Diese Woche";
      case "month":
        return "Dieser Monat";
      default:
        return "Alle Zeit";
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredChats, `chats-${new Date().toISOString().split("T")[0]}`, [
      { key: "id", label: "Chat ID" },
      { key: "title", label: "Titel" },
      { key: "user_id", label: "User ID" },
      { key: "messageCount", label: "Nachrichten" },
      { key: "created_at", label: "Erstellt" },
      { key: "updated_at", label: "Aktualisiert" },
    ]);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredChats, `chats-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold md:text-3xl">Chats</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Alle Chat-Verläufe der Benutzer
          </p>
        </div>

        {/* Zeit-Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full gap-2 md:w-auto">
              <Calendar className="h-4 w-4" />
              <span className="md:inline">{getTimeFilterLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeFilterValue(null)}>Alle Zeit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("today")}>Heute</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("week")}>
              Diese Woche
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilterValue("month")}>
              Dieser Monat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search and Filter Badges */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Chats suchen (Titel, User ID)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Chats suchen"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => fetchChats(currentPage)}
            disabled={isLoading}
            className="gap-2"
            aria-label="Daten aktualisieren"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Aktualisieren</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" aria-label="Daten exportieren">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>Als CSV exportieren</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>Als JSON exportieren</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {userIdFilter && (
          <div className="bg-muted flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-sm">
            <span>
              User:{" "}
              <code className="bg-background rounded px-1.5 py-0.5 font-mono text-xs">
                {userIdFilter}
              </code>
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={clearUserFilter}
              aria-label="Filter entfernen"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Chats Table */}
      <ChatsTable
        chats={filteredChats}
        isLoading={isInitialLoad}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}

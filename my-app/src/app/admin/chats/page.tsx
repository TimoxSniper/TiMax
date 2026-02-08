"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatsTable } from "@/components/admin/chats-table";
import { useToast } from "@/components/ui/toast";
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
import { AdminProvider, useAdmin } from "@/contexts/admin-context";

function ChatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userIdFilter = searchParams.get("userId");
  const timeFilter = searchParams.get("timeFilter");

  const {
    filteredChats,
    chatsPagination,
    isChatsLoading,
    isChatsInitialLoad,
    chatsCurrentPage,
    chatsSearchQuery,
    fetchChats,
    setChatsCurrentPage,
    setChatsSearchQuery,
    deleteChat,
  } = useAdmin();

  useEffect(() => {
    setChatsCurrentPage(1);
    fetchChats(1, userIdFilter || undefined, timeFilter || undefined);
  }, [userIdFilter, timeFilter]);

  useEffect(() => {
    if (chatsCurrentPage > 1) {
      fetchChats(chatsCurrentPage, userIdFilter || undefined, timeFilter || undefined);
    }
  }, [chatsCurrentPage]);

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
              value={chatsSearchQuery}
              onChange={(e) => setChatsSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Chats suchen"
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              fetchChats(chatsCurrentPage, userIdFilter || undefined, timeFilter || undefined)
            }
            disabled={isChatsLoading}
            className="gap-2"
            aria-label="Daten aktualisieren"
          >
            <RefreshCw className={`h-4 w-4 ${isChatsLoading ? "animate-spin" : ""}`} />
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
        isLoading={isChatsInitialLoad}
        pagination={chatsPagination || undefined}
        onPageChange={setChatsCurrentPage}
        onDelete={deleteChat}
      />
    </div>
  );
}

export default function AdminChatsPage() {
  const { showToast } = useToast();

  return (
    <AdminProvider onToast={showToast}>
      <ChatsContent />
    </AdminProvider>
  );
}

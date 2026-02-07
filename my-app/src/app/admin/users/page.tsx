"use client";

import { useEffect, useState, useCallback } from "react";
import { UsersTable } from "@/components/admin/users-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON } from "@/lib/admin/export";

interface User {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  const fetchUsers = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users?page=${page}&limit=25`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
          setFilteredUsers(data.users || []);
          setPagination(data.pagination);
        } else {
          throw new Error("Fehler beim Laden");
        }
      } catch (error) {
        logger.error("Fehler beim Laden der Benutzer:", error);
        showToast("Benutzer konnten nicht geladen werden", "error");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const userId = user.userId.toLowerCase();

      return fullName.includes(query) || email.includes(query) || userId.includes(query);
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredUsers, `users-${new Date().toISOString().split("T")[0]}`, [
      { key: "userId", label: "User ID" },
      { key: "firstName", label: "Vorname" },
      { key: "lastName", label: "Nachname" },
      { key: "email", label: "Email" },
      { key: "chatCount", label: "Chats" },
      { key: "uploadCount", label: "Uploads" },
      { key: "lastActivity", label: "Letzte Aktivität" },
    ]);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredUsers, `users-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold md:text-3xl">Benutzer</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Übersicht aller registrierten Benutzer und ihre Aktivitäten
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Benutzer suchen (Name, Email, ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Benutzer suchen"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => fetchUsers(currentPage)}
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

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        isLoading={isInitialLoad}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

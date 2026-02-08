"use client";

import { useEffect } from "react";
import { UsersTable } from "@/components/admin/users-table";
import { useToast } from "@/components/ui/toast";
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
import { AdminProvider, useAdmin } from "@/contexts/admin-context";

function UsersContent() {
  const {
    filteredUsers,
    usersPagination,
    isUsersLoading,
    isUsersInitialLoad,
    usersCurrentPage,
    usersSearchQuery,
    fetchUsers,
    setUsersCurrentPage,
    setUsersSearchQuery,
  } = useAdmin();

  useEffect(() => {
    fetchUsers(usersCurrentPage);
  }, [usersCurrentPage, fetchUsers]);

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
            value={usersSearchQuery}
            onChange={(e) => setUsersSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Benutzer suchen"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => fetchUsers(usersCurrentPage)}
          disabled={isUsersLoading}
          className="gap-2"
          aria-label="Daten aktualisieren"
        >
          <RefreshCw className={`h-4 w-4 ${isUsersLoading ? "animate-spin" : ""}`} />
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
        isLoading={isUsersInitialLoad}
        pagination={usersPagination || undefined}
        onPageChange={setUsersCurrentPage}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  const { showToast } = useToast();

  return (
    <AdminProvider onToast={showToast}>
      <UsersContent />
    </AdminProvider>
  );
}

/**
 * Admin Users Page
 *
 * User management with tabs: All, Active, Banned
 */

"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/admin/shared/data-table";
import { SearchFilterBar } from "@/components/admin/shared/search-filter-bar";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatShortDate, formatRelativeTime, getInitials } from "@/lib/admin/utils";
import { Ban, CheckCircle } from "lucide-react";
import type { UserWithStats, DataTableColumn } from "@/types/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "banned">("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const { toast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
        filter: activeTab,
        search,
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const { data } = await res.json();

      setUsers(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeTab, search]);

  // Handle ban user
  const handleBan = async () => {
    if (!selectedUser) return;

    setIsBanning(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Banned by admin",
          banType: "permanent",
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "User banned successfully",
        });
        fetchUsers();
      } else {
        throw new Error("Failed to ban user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
      setShowBanDialog(false);
      setSelectedUser(null);
    }
  };

  // Handle unban user
  const handleUnban = async () => {
    if (!selectedUser) return;

    setIsBanning(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/unban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Unbanned by admin",
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "User unbanned successfully",
        });
        fetchUsers();
      } else {
        throw new Error("Failed to unban user");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
      setShowUnbanDialog(false);
      setSelectedUser(null);
    }
  };

  // Table columns
  const columns: DataTableColumn<UserWithStats>[] = [
    {
      key: "fullName",
      label: "User",
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-[6px]">
            <AvatarImage src={user.imageUrl} alt={user.fullName} />
            <AvatarFallback className="rounded-[6px] text-xs bg-accent/10 text-accent">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (_, user) => formatShortDate(user.createdAt),
    },
    {
      key: "lastActive",
      label: "Last Active",
      sortable: true,
      render: (_, user) =>
        user.lastActive ? formatRelativeTime(user.lastActive) : "Never",
    },
    {
      key: "totalUploads",
      label: "Uploads",
      sortable: true,
      align: "center",
    },
    {
      key: "totalChats",
      label: "Chats",
      sortable: true,
      align: "center",
    },
    {
      key: "isBanned",
      label: "Status",
      render: (_, user) => (
        <StatusBadge
          status={user.isBanned ? "banned" : "active"}
          label={user.isBanned ? "Banned" : "Active"}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, user) => (
        <div className="flex items-center gap-2 justify-end">
          {user.isBanned ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                setShowUnbanDialog(true);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Unban
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="rounded-[4px]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                setShowBanDialog(true);
              }}
            >
              <Ban className="h-4 w-4 mr-1" />
              Ban
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground font-sans">
          Verwalte Benutzer, Berechtigungen und Sperren
        </p>
      </div>

      {/* Search */}
      <SearchFilterBar
        onSearchChange={setSearch}
        placeholder="Suche nach Name oder E-Mail..."
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="rounded-[6px]">
          <TabsTrigger value="all" className="rounded-[4px]">
            All Users
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-[4px]">
            Active (7d)
          </TabsTrigger>
          <TabsTrigger value="banned" className="rounded-[4px]">
            Banned
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <DataTable
            data={users}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="Keine Benutzer gefunden"
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ban Dialog */}
      <ConfirmationDialog
        open={showBanDialog}
        onOpenChange={setShowBanDialog}
        onConfirm={handleBan}
        title="Ban User"
        description={`Are you sure you want to ban ${selectedUser?.fullName}? This will prevent them from accessing the platform.`}
        confirmLabel="Ban User"
        variant="destructive"
        isLoading={isBanning}
      />

      {/* Unban Dialog */}
      <ConfirmationDialog
        open={showUnbanDialog}
        onOpenChange={setShowUnbanDialog}
        onConfirm={handleUnban}
        title="Unban User"
        description={`Are you sure you want to unban ${selectedUser?.fullName}? They will regain access to the platform.`}
        confirmLabel="Unban User"
        isLoading={isBanning}
      />
    </div>
  );
}

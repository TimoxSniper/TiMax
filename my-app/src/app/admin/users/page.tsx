"use client";

import { useEffect, useState } from "react";
import { UsersTable } from "@/components/admin/users-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";

interface User {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
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
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold">Benutzer</h1>
        <p className="text-muted-foreground mt-1">
          Übersicht aller registrierten Benutzer und ihre Aktivitäten
        </p>
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        isLoading={isInitialLoad}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

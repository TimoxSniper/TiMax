"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUploadsPage() {
  const searchParams = useSearchParams();
  const userIdFilter = searchParams.get("userId");
  
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { showToast } = useToast();

  const fetchUploads = async (page: number, status: string) => {
    setIsLoading(true);
    try {
      let url = `/api/admin/uploads?page=${page}&limit=20`;
      if (userIdFilter) {
        url += `&userId=${encodeURIComponent(userIdFilter)}`;
      }
      if (status) {
        url += `&status=${status}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUploads(data.uploads || []);
        setPagination(data.pagination);
      } else {
        throw new Error("Fehler beim Laden");
      }
    } catch (error) {
      logger.error("Fehler beim Laden der Uploads:", error);
      showToast("Uploads konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchUploads(1, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchUploads(currentPage, statusFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (uploadId: string) => {
    const res = await fetch(`/api/admin/uploads/${uploadId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Upload wurde gelöscht", "success");
      fetchUploads(currentPage, statusFilter);
    } else {
      showToast("Upload konnte nicht gelöscht werden", "error");
    }
  };

  const clearFilter = () => {
    window.history.pushState({}, "", "/admin/uploads");
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold">Uploads</h1>
        <p className="text-muted-foreground mt-1">
          Alle hochgeladenen Audio- und Video-Dateien
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

      {/* Uploads Table */}
      <UploadsTable
        uploads={uploads}
        isLoading={isLoading}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
}

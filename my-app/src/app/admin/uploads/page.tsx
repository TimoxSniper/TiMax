"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, RefreshCw, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON } from "@/lib/admin/export";

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
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredUploads(data.uploads || []);
        setPagination(data.pagination);
      } else {
        throw new Error("Fehler beim Laden");
      }
    } catch (error) {
      logger.error("Fehler beim Laden der Uploads:", error);
      showToast("Uploads konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setIsInitialLoad(true);
    fetchUploads(1, statusFilter);
  }, [userIdFilter, statusFilter]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUploads(uploads);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = uploads.filter((upload) => {
      const fileName = upload.file_name.toLowerCase();
      const userId = upload.user_id.toLowerCase();
      const fileType = (upload.file_type || "").toLowerCase();

      return fileName.includes(query) || userId.includes(query) || fileType.includes(query);
    });

    setFilteredUploads(filtered);
  }, [searchQuery, uploads]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchUploads(currentPage, statusFilter);
    }
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

  const handleExportCSV = () => {
    exportToCSV(
      filteredUploads,
      `uploads-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "id", label: "Upload ID" },
        { key: "file_name", label: "Dateiname" },
        { key: "user_id", label: "User ID" },
        { key: "file_size", label: "Größe (Bytes)" },
        { key: "file_type", label: "Typ" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Erstellt" },
      ]
    );
  };

  const handleExportJSON = () => {
    exportToJSON(filteredUploads, `uploads-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Uploads</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Alle hochgeladenen Audio- und Video-Dateien
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Uploads suchen (Dateiname, Typ, User ID)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Uploads suchen"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => fetchUploads(currentPage, statusFilter)}
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
              <DropdownMenuItem onClick={handleExportCSV}>
                Als CSV exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                Als JSON exportieren
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {userIdFilter && (
          <div className="flex items-center gap-2 p-2 md:p-3 bg-muted rounded-md w-fit">
            <span className="text-xs md:text-sm">
              User: <code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded break-all">{userIdFilter}</code>
            </span>
            <Button variant="ghost" size="icon-xs" onClick={clearFilter} aria-label="Filter entfernen">
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Uploads Table */}
      <UploadsTable
        uploads={filteredUploads}
        isLoading={isInitialLoad}
        pagination={pagination || undefined}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
}

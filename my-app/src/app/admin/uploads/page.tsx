"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UploadsTable } from "@/components/admin/uploads-table";
import { useToast } from "@/components/ui/toast";
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
import { AdminProvider, useAdmin } from "@/contexts/admin-context";

function UploadsContent() {
  const searchParams = useSearchParams();
  const userIdFilter = searchParams.get("userId");

  const {
    filteredUploads,
    uploadsPagination,
    isUploadsLoading,
    isUploadsInitialLoad,
    uploadsCurrentPage,
    uploadsStatusFilter,
    uploadsSearchQuery,
    fetchUploads,
    setUploadsCurrentPage,
    setUploadsStatusFilter,
    setUploadsSearchQuery,
    deleteUpload,
  } = useAdmin();

  useEffect(() => {
    setUploadsCurrentPage(1);
    fetchUploads(1, uploadsStatusFilter, userIdFilter || undefined);
  }, [uploadsStatusFilter]);

  useEffect(() => {
    if (uploadsCurrentPage > 1) {
      fetchUploads(uploadsCurrentPage, uploadsStatusFilter, userIdFilter || undefined);
    }
  }, [uploadsCurrentPage]);

  const handleStatusFilterChange = (status: string) => {
    setUploadsStatusFilter(status);
    setUploadsCurrentPage(1);
  };

  const clearFilter = () => {
    window.history.pushState({}, "", "/admin/uploads");
    window.location.reload();
  };

  const handleExportCSV = () => {
    exportToCSV(filteredUploads, `uploads-${new Date().toISOString().split("T")[0]}`, [
      { key: "id", label: "Upload ID" },
      { key: "file_name", label: "Dateiname" },
      { key: "user_id", label: "User ID" },
      { key: "file_size", label: "Größe (Bytes)" },
      { key: "file_type", label: "Typ" },
      { key: "status", label: "Status" },
      { key: "created_at", label: "Erstellt" },
    ]);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredUploads, `uploads-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold md:text-3xl">Uploads</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Alle hochgeladenen Audio- und Video-Dateien
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Uploads suchen (Dateiname, Typ, User ID)..."
              value={uploadsSearchQuery}
              onChange={(e) => setUploadsSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Uploads suchen"
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              fetchUploads(uploadsCurrentPage, uploadsStatusFilter, userIdFilter || undefined)
            }
            disabled={isUploadsLoading}
            className="gap-2"
            aria-label="Daten aktualisieren"
          >
            <RefreshCw className={`h-4 w-4 ${isUploadsLoading ? "animate-spin" : ""}`} />
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
          <div className="bg-muted flex w-fit items-center gap-2 rounded-md p-2 md:p-3">
            <span className="text-xs md:text-sm">
              User:{" "}
              <code className="bg-background rounded px-1.5 py-0.5 font-mono text-xs break-all">
                {userIdFilter}
              </code>
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={clearFilter}
              aria-label="Filter entfernen"
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Uploads Table */}
      <UploadsTable
        uploads={filteredUploads}
        isLoading={isUploadsInitialLoad}
        pagination={uploadsPagination || undefined}
        onPageChange={setUploadsCurrentPage}
        onDelete={deleteUpload}
        statusFilter={uploadsStatusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
    </div>
  );
}

export default function AdminUploadsPage() {
  const { showToast } = useToast();

  return (
    <AdminProvider onToast={showToast}>
      <UploadsContent />
    </AdminProvider>
  );
}

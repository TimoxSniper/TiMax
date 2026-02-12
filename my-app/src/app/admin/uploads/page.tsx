"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  HardDrive,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatBytes, formatDateTime } from "@/lib/date-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UPLOAD_STATUS_FILTERS = [
  { value: "", label: "Alle Status" },
  { value: "pending", label: "Ausstehend" },
  { value: "processing", label: "In Bearbeitung" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "failed", label: "Fehlgeschlagen" },
  { value: "cancelled", label: "Abgebrochen" },
];

export default function AdminUploads() {
  const {
    uploads,
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isUploadsInitialLoad) {
      fetchUploads(1, uploadsStatusFilter || undefined);
    }
  }, [fetchUploads, isUploadsInitialLoad, uploadsStatusFilter]);

  const handleSearch = (value: string) => {
    setUploadsSearchQuery(value);
  };

  const handleStatusFilter = (value: string) => {
    setUploadsStatusFilter(value);
    setUploadsCurrentPage(1);
    fetchUploads(1, value || undefined);
  };

  const handlePageChange = (page: number) => {
    setUploadsCurrentPage(page);
    fetchUploads(page, uploadsStatusFilter || undefined);
  };

  const handleDeleteClick = (uploadId: string) => {
    setUploadToDelete(uploadId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (uploadToDelete) {
      deleteUpload(uploadToDelete);
      setDeleteDialogOpen(false);
      setUploadToDelete(null);
    }
  };

  const storageStats = uploads.reduce(
    (acc, upload) => {
      if (upload.file_size && upload.status === "completed") {
        acc.totalBytes += upload.file_size;
        acc.completedCount++;
      }
      return acc;
    },
    { totalBytes: 0, completedCount: 0 }
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Upload Management</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Datei-Uploads und deren Status</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Gesamt</p>
                  <p className="font-serif text-2xl font-bold">{uploadsPagination?.total || 0}</p>
                </div>
                <FileText className="text-primary h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Abgeschlossen</p>
                  <p className="font-serif text-2xl font-bold">{storageStats.completedCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Speichernutzung</p>
                  <p className="font-serif text-2xl font-bold">
                    {formatBytes(storageStats.totalBytes)}
                  </p>
                </div>
                <HardDrive className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Nach Dateiname, User ID oder Typ suchen..."
                  value={uploadsSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <Select value={uploadsStatusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status filtern" />
                  </SelectTrigger>
                  <SelectContent>
                    {UPLOAD_STATUS_FILTERS.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isUploadsLoading && isUploadsInitialLoad ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : filteredUploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  {uploadsSearchQuery || uploadsStatusFilter
                    ? "Keine Uploads gefunden"
                    : "Keine Uploads vorhanden"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datei</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Größe</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Erstellt am</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                              <span className="max-w-[200px] truncate font-medium">
                                {upload.file_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground text-xs">
                              {upload.user_id.slice(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell>
                            {upload.file_size ? formatBytes(upload.file_size) : "-"}
                          </TableCell>
                          <TableCell>
                            <span className="bg-secondary rounded-md px-2 py-1 text-xs">
                              {upload.file_type?.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={upload.status as "completed" | "processing" | "failed" | "pending" | "cancelled"} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="text-muted-foreground h-4 w-4" />
                              {formatDateTime(upload.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(upload.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {uploadsPagination && uploadsPagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Seite {uploadsPagination.page} von {uploadsPagination.totalPages} (
                      {uploadsPagination.total} Uploads)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(uploadsCurrentPage - 1)}
                        disabled={uploadsCurrentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Zurück
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(uploadsCurrentPage + 1)}
                        disabled={uploadsCurrentPage >= (uploadsPagination.totalPages || 0)}
                      >
                        Weiter
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-destructive h-5 w-5" />
              Upload löschen?
            </DialogTitle>
            <DialogDescription>
              Dies wird den Upload dauerhaft aus der Datenbank entfernen. Diese Aktion kann nicht
              rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

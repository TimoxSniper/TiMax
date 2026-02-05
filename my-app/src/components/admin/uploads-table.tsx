"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Trash2, FileAudio, FileVideo, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface UploadsTableProps {
  uploads: Upload[];
  isLoading: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  onDelete?: (uploadId: string) => Promise<void>;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels: Record<string, string> = {
  pending: "Wartend",
  processing: "Verarbeitung",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
  cancelled: "Abgebrochen",
};

export function UploadsTable({
  uploads,
  isLoading,
  pagination,
  onPageChange,
  onDelete,
  statusFilter,
  onStatusFilterChange,
}: UploadsTableProps) {
  const [deleteUpload, setDeleteUpload] = useState<Upload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const truncateUserId = (userId: string) => {
    if (userId.length <= 16) return userId;
    return `${userId.slice(0, 8)}...${userId.slice(-6)}`;
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return File;
    if (fileType.startsWith("audio/")) return FileAudio;
    if (fileType.startsWith("video/")) return FileVideo;
    return File;
  };

  const handleDelete = async () => {
    if (!deleteUpload || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteUpload.id);
      setDeleteUpload(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader>
          <CardTitle>Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-md">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Uploads</CardTitle>
            {/* Status Filter */}
            {onStatusFilterChange && (
              <div className="flex gap-1">
                <Button
                  variant={!statusFilter ? "default" : "outline"}
                  size="xs"
                  onClick={() => onStatusFilterChange("")}
                >
                  Alle
                </Button>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={statusFilter === key ? "default" : "outline"}
                    size="xs"
                    onClick={() => onStatusFilterChange(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {pagination && (
            <span className="text-sm text-muted-foreground">
              {pagination.total} Uploads gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_80px_80px_100px_140px_60px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
            <div>Dateiname</div>
            <div>User ID</div>
            <div className="text-right">Größe</div>
            <div>Typ</div>
            <div className="text-center">Status</div>
            <div>Erstellt</div>
            <div className="text-center">Aktion</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {uploads.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Keine Uploads gefunden
              </div>
            ) : (
              uploads.map((upload) => {
                const FileIcon = getFileIcon(upload.file_type);
                return (
                  <div
                    key={upload.id}
                    className="grid grid-cols-[1fr_120px_80px_80px_100px_140px_60px] gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate font-medium" title={upload.file_name}>
                        {upload.file_name}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground" title={upload.user_id}>
                      {truncateUserId(upload.user_id)}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {formatFileSize(upload.file_size)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" title={upload.file_type || "-"}>
                      {upload.file_type?.split("/")[1] || "-"}
                    </div>
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={statusColors[upload.status] || statusColors.pending}
                      >
                        {statusLabels[upload.status] || upload.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(upload.created_at)}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteUpload(upload)}
                        title="Löschen"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <span className="text-sm text-muted-foreground">
                Seite {pagination.page} von {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Zurück
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Weiter
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUpload} onOpenChange={() => setDeleteUpload(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du &quot;{deleteUpload?.file_name}&quot; löschen möchtest?
              Die Datei wird auch aus dem Storage entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUpload(null)} disabled={isDeleting}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Löschen..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

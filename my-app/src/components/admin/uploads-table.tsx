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
import { UserIdDisplay } from "./user-display";
import {
  formatDate,
  formatFileSize,
  uploadStatusColors,
  uploadStatusLabels,
} from "@/lib/admin/utils";

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
      <Card className="border-muted/20 border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-muted/10 flex items-center justify-between rounded-lg border-2 p-4"
              >
                <Skeleton className="h-5 w-60" />
                <div className="flex gap-6">
                  <Skeleton className="h-5 w-32" />
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
      <Card className="border-2 border-orange-500/10 shadow-lg">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <CardTitle className="font-serif text-xl">Uploads</CardTitle>
            {/* Status Filter */}
            {onStatusFilterChange && (
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <Button
                  variant={!statusFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusFilterChange("")}
                  className="h-9 shrink-0 px-4"
                >
                  Alle
                </Button>
                {Object.entries(uploadStatusLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={statusFilter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => onStatusFilterChange(key)}
                    className="h-9 shrink-0 px-4"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {pagination && (
            <span className="text-muted-foreground text-sm font-medium">
              {pagination.total} gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header - Desktop only */}
          <div className="text-muted-foreground hidden grid-cols-[1fr_140px_100px_100px_120px_160px_80px] gap-6 border-b border-orange-500/10 px-6 py-3 text-sm font-semibold md:grid">
            <div>Dateiname</div>
            <div>User ID</div>
            <div className="text-right">Größe</div>
            <div>Typ</div>
            <div className="text-center">Status</div>
            <div>Erstellt</div>
            <div className="text-center">Aktion</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-orange-500/5 md:divide-y md:divide-y-0 md:divide-orange-500/5">
            {uploads.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Keine Uploads gefunden
              </div>
            ) : (
              uploads.map((upload) => {
                const FileIcon = getFileIcon(upload.file_type);
                return (
                  <div key={upload.id} className="group transition-colors hover:bg-orange-500/5">
                    {/* Mobile Card Layout */}
                    <div className="space-y-3 p-4 md:hidden">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <FileIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                          <div className="min-w-0 flex-1">
                            <div
                              className="truncate text-sm font-semibold"
                              title={upload.file_name}
                            >
                              {upload.file_name}
                            </div>
                            <div className="mt-1">
                              <UserIdDisplay userId={upload.user_id} />
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteUpload(upload)}
                          title="Löschen"
                          aria-label={`Upload ${upload.file_name} löschen`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {formatFileSize(upload.file_size)}
                          </span>
                          <Badge
                            variant="outline"
                            className={`${uploadStatusColors[upload.status] || uploadStatusColors.pending} text-xs font-medium`}
                          >
                            {uploadStatusLabels[upload.status] || upload.status}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground">
                          {formatDate(upload.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="hidden grid-cols-[1fr_140px_100px_100px_120px_160px_80px] items-center gap-6 px-6 py-4 md:grid">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileIcon className="h-5 w-5 shrink-0 text-orange-500" />
                        <span className="truncate font-semibold" title={upload.file_name}>
                          {upload.file_name}
                        </span>
                      </div>
                      <UserIdDisplay userId={upload.user_id} />
                      <div className="text-muted-foreground text-right text-sm">
                        {formatFileSize(upload.file_size)}
                      </div>
                      <div
                        className="text-muted-foreground truncate text-xs font-medium"
                        title={upload.file_type || "-"}
                      >
                        {upload.file_type?.split("/")[1] || "-"}
                      </div>
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={
                            uploadStatusColors[upload.status] || uploadStatusColors.pending
                          }
                        >
                          {uploadStatusLabels[upload.status] || upload.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(upload.created_at)}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteUpload(upload)}
                          title="Löschen"
                          aria-label={`Upload ${upload.file_name} löschen`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-3 border-t border-orange-500/10 pt-6 md:flex-row md:items-center md:justify-between">
              <span className="text-muted-foreground text-center text-sm md:text-left">
                Seite {pagination.page} von {pagination.totalPages}
              </span>
              <div className="flex justify-center gap-2 md:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="h-10 flex-1 px-4 font-medium md:flex-none"
                  aria-label="Vorherige Seite"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="md:inline">Zurück</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="h-10 flex-1 px-4 font-medium md:flex-none"
                  aria-label="Nächste Seite"
                >
                  <span className="md:inline">Weiter</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUpload} onOpenChange={() => setDeleteUpload(null)}>
        <DialogContent className="border-2 border-orange-500/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Upload löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du &quot;{deleteUpload?.file_name}&quot; löschen möchtest? Die
              Datei wird auch aus dem Storage entfernt. Diese Aktion kann nicht rückgängig gemacht
              werden.
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

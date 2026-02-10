/**
 * Uploads Table Component
 *
 * Displays uploads with user info, status, and file details
 */

"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { formatFileSize, formatShortDate, getInitials } from "@/lib/admin/utils";
import { Eye, Trash2 } from "lucide-react";
import type { EnrichedUpload, DataTableColumn } from "@/types/admin";

export interface UploadsTableProps {
  uploads: EnrichedUpload[];
  isLoading?: boolean;
  onViewUpload: (upload: EnrichedUpload) => void;
  onDeleteUpload: (upload: EnrichedUpload) => void;
}

export function UploadsTable({
  uploads,
  isLoading,
  onViewUpload,
  onDeleteUpload,
}: UploadsTableProps) {
  const columns: DataTableColumn<EnrichedUpload>[] = [
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (_, upload) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-[6px]">
            <AvatarImage src={upload.user.imageUrl} alt={upload.user.fullName} />
            <AvatarFallback className="rounded-[6px] text-xs bg-accent/10 text-accent">
              {getInitials(upload.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{upload.user.fullName}</p>
            <p className="text-xs text-muted-foreground">{upload.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "file_name",
      label: "File Name",
      sortable: true,
      render: (_, upload) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-sm truncate">{upload.file_name}</p>
          <p className="text-xs text-muted-foreground">{upload.file_type}</p>
        </div>
      ),
    },
    {
      key: "file_size",
      label: "Size",
      sortable: true,
      render: (_, upload) => (
        <span className="font-mono text-sm">{formatFileSize(upload.file_size)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_, upload) => <StatusBadge status={upload.status} />,
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (_, upload) => (
        <span className="text-sm">{formatShortDate(upload.created_at)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, upload) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-[4px]"
            onClick={(e) => {
              e.stopPropagation();
              onViewUpload(upload);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-[4px]"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUpload(upload);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={uploads}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Keine Uploads gefunden"
      onRowClick={onViewUpload}
    />
  );
}

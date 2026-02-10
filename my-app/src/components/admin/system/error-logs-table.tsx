/**
 * Error Logs Table Component
 *
 * Displays admin action logs (audit trail)
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/admin/shared/data-table";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { formatDate, getInitials } from "@/lib/admin/utils";
import type { EnrichedAdminLog, DataTableColumn } from "@/types/admin";

export function ErrorLogsTable() {
  const [logs, setLogs] = useState<EnrichedAdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
      });

      const res = await fetch(`/api/admin/system/logs?${params}`);
      const { data } = await res.json();

      setLogs(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const columns: DataTableColumn<EnrichedAdminLog>[] = [
    {
      key: "admin_user_id",
      label: "Admin",
      render: (_, log) => (
        <div className="flex items-center gap-3">
          {log.adminUser && (
            <>
              <Avatar className="h-8 w-8 rounded-[6px]">
                <AvatarImage src={log.adminUser.imageUrl} alt={log.adminUser.fullName} />
                <AvatarFallback className="rounded-[6px] text-xs bg-accent/10 text-accent">
                  {getInitials(log.adminUser.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{log.adminUser.fullName}</p>
                <p className="text-xs text-muted-foreground">{log.admin_email}</p>
              </div>
            </>
          )}
          {!log.adminUser && (
            <div>
              <p className="font-semibold text-sm">{log.admin_email}</p>
              <p className="text-xs text-muted-foreground font-mono">{log.admin_user_id.substring(0, 8)}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "action_type",
      label: "Action",
      sortable: true,
      render: (_, log) => (
        <span className="inline-flex items-center rounded-[4px] bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
          {log.action_type.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "target_type",
      label: "Target",
      render: (_, log) =>
        log.target_type ? (
          <div>
            <p className="font-medium text-sm capitalize">{log.target_type}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {log.target_id?.substring(0, 8)}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        ),
    },
    {
      key: "created_at",
      label: "Timestamp",
      sortable: true,
      render: (_, log) => (
        <span className="text-sm">{formatDate(log.created_at)}</span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      render: (_, log) => (
        <span className="font-mono text-sm">{log.ip_address || "-"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        data={logs}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Keine Logs gefunden"
      />

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, MessageSquare, FileAudio } from "lucide-react";
import Link from "next/link";

interface User {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}

export function UsersTable({ users, isLoading, pagination, onPageChange }: UsersTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nie";
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateUserId = (userId: string) => {
    if (userId.length <= 20) return userId;
    return `${userId.slice(0, 10)}...${userId.slice(-8)}`;
  };

  if (isLoading) {
    return (
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader>
          <CardTitle>Benutzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border rounded-md">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:translate-y-0 hover:shadow-editorial-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Benutzer</CardTitle>
        {pagination && (
          <span className="text-sm text-muted-foreground">
            {pagination.total} Benutzer gesamt
          </span>
        )}
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_100px_150px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
          <div>User ID</div>
          <div className="text-center">Chats</div>
          <div className="text-center">Uploads</div>
          <div className="text-right">Letzte Aktivität</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Keine Benutzer gefunden
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className="grid grid-cols-[1fr_100px_100px_150px] gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
              >
                <div className="font-mono text-sm" title={user.userId}>
                  {truncateUserId(user.userId)}
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`/admin/chats?userId=${user.userId}`}
                    className="text-accent hover:underline"
                  >
                    {user.chatCount}
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <FileAudio className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`/admin/uploads?userId=${user.userId}`}
                    className="text-accent hover:underline"
                  >
                    {user.uploadCount}
                  </Link>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {formatDate(user.lastActivity)}
                </div>
              </div>
            ))
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
  );
}

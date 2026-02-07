"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, MessageSquare, FileAudio } from "lucide-react";
import Link from "next/link";
import { UserDisplay } from "./user-display";
import { formatDate } from "@/lib/admin/utils";

interface User {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
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
  if (isLoading) {
    return (
      <Card className="hover:shadow-editorial-md hover:translate-y-0">
        <CardHeader>
          <CardTitle>Benutzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-border flex items-center justify-between rounded-md border p-3"
              >
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
    <Card className="hover:shadow-editorial-md hover:translate-y-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base md:text-lg">Benutzer</CardTitle>
        {pagination && (
          <span className="text-muted-foreground text-xs md:text-sm">
            {pagination.total} gesamt
          </span>
        )}
      </CardHeader>
      <CardContent>
        {/* Table Header - Desktop only */}
        <div className="text-muted-foreground border-border hidden grid-cols-[1fr_80px_80px_140px] gap-4 border-b px-4 py-2 text-sm font-medium md:grid">
          <div>Benutzer</div>
          <div className="text-center">Chats</div>
          <div className="text-center">Uploads</div>
          <div className="text-right">Letzte Aktivität</div>
        </div>

        {/* Table Body */}
        <div className="divide-border md:divide-border divide-y md:divide-y md:divide-y-0">
          {users.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Keine Benutzer gefunden
            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user.userId}
                href={`/admin/users/${user.userId}`}
                className="hover:bg-muted/50 block cursor-pointer transition-colors"
              >
                {/* Mobile Card Layout */}
                <div className="space-y-2 p-3 md:hidden">
                  <UserDisplay
                    userId={user.userId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    imageUrl={user.imageUrl}
                    showEmail
                  />
                  <div className="flex items-center justify-between pt-2 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="text-muted-foreground h-3.5 w-3.5" />
                        <span className="text-accent font-medium">{user.chatCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileAudio className="text-muted-foreground h-3.5 w-3.5" />
                        <span className="text-accent font-medium">{user.uploadCount}</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(user.lastActivity)}
                    </div>
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden grid-cols-[1fr_80px_80px_140px] items-center gap-4 px-4 py-3 md:grid">
                  <UserDisplay
                    userId={user.userId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    imageUrl={user.imageUrl}
                    showEmail
                  />
                  <div className="flex items-center justify-center gap-1.5">
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                    <span className="text-accent">{user.chatCount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <FileAudio className="text-muted-foreground h-4 w-4" />
                    <span className="text-accent">{user.uploadCount}</span>
                  </div>
                  <div className="text-muted-foreground text-right text-sm">
                    {formatDate(user.lastActivity)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="border-border mt-4 flex flex-col gap-2 border-t pt-4 md:flex-row md:items-center md:justify-between">
            <span className="text-muted-foreground text-center text-xs md:text-left md:text-sm">
              Seite {pagination.page} von {pagination.totalPages}
            </span>
            <div className="flex justify-center gap-2 md:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="flex-1 md:flex-none"
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
                className="flex-1 md:flex-none"
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
  );
}

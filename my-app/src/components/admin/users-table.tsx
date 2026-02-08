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
      <Card className="border-muted/20 border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Benutzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-muted/10 flex items-center justify-between rounded-lg border-2 p-4"
              >
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-6">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif text-xl">Benutzer</CardTitle>
        {pagination && (
          <span className="text-muted-foreground text-sm font-medium">
            {pagination.total} gesamt
          </span>
        )}
      </CardHeader>
      <CardContent>
        {/* Table Header - Desktop only */}
        <div className="text-muted-foreground hidden grid-cols-[1fr_100px_100px_160px] gap-6 border-b border-blue-500/10 px-6 py-3 text-sm font-semibold md:grid">
          <div>Benutzer</div>
          <div className="text-center">Chats</div>
          <div className="text-center">Uploads</div>
          <div className="text-right">Letzte Aktivität</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-blue-500/5 md:divide-y md:divide-y-0 md:divide-blue-500/5">
          {users.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center text-sm">
              Keine Benutzer gefunden
            </div>
          ) : (
            users.map((user) => (
              <Link
                key={user.userId}
                href={`/admin/users/${user.userId}`}
                className="block cursor-pointer transition-colors hover:bg-blue-500/5"
              >
                {/* Mobile Card Layout */}
                <div className="space-y-3 p-4 md:hidden">
                  <UserDisplay
                    userId={user.userId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    imageUrl={user.imageUrl}
                    showEmail
                  />
                  <div className="flex items-center justify-between pt-3 text-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-blue-600">{user.chatCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileAudio className="h-4 w-4 text-green-500" />
                        <span className="font-semibold text-green-600">{user.uploadCount}</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(user.lastActivity)}
                    </div>
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden grid-cols-[1fr_100px_100px_160px] items-center gap-6 px-6 py-4 md:grid">
                  <UserDisplay
                    userId={user.userId}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                    imageUrl={user.imageUrl}
                    showEmail
                  />
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold text-blue-600">{user.chatCount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FileAudio className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-600">{user.uploadCount}</span>
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
          <div className="mt-6 flex flex-col gap-3 border-t border-blue-500/10 pt-6 md:flex-row md:items-center md:justify-between">
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
  );
}

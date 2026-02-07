"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Trash2, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserIdDisplay } from "./user-display";
import { formatDate } from "@/lib/admin/utils";

interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

interface ChatsTableProps {
  chats: Chat[];
  isLoading: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  onDelete?: (chatId: string) => Promise<void>;
}

export function ChatsTable({
  chats,
  isLoading,
  pagination,
  onPageChange,
  onDelete,
}: ChatsTableProps) {
  const [deleteChat, setDeleteChat] = useState<Chat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteChat || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteChat.id);
      setDeleteChat(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-editorial-md hover:translate-y-0">
        <CardHeader>
          <CardTitle>Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-border flex items-center justify-between rounded-md border p-3"
              >
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
      <Card className="hover:shadow-editorial-md hover:translate-y-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base md:text-lg">Chats</CardTitle>
          {pagination && (
            <span className="text-muted-foreground text-xs md:text-sm">
              {pagination.total} gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header - Desktop only */}
          <div className="text-muted-foreground border-border hidden grid-cols-[1fr_120px_80px_140px_80px] gap-4 border-b px-4 py-2 text-sm font-medium md:grid">
            <div>Titel</div>
            <div>User ID</div>
            <div className="text-center">Nachrichten</div>
            <div>Erstellt</div>
            <div className="text-center">Aktionen</div>
          </div>

          {/* Table Body */}
          <div className="divide-border divide-y">
            {chats.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Keine Chats gefunden
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="group hover:bg-muted/50 transition-colors">
                  {/* Mobile Card Layout */}
                  <div className="space-y-2 p-3 md:hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium" title={chat.title}>
                          {chat.title}
                        </div>
                        <div className="mt-1">
                          <UserIdDisplay userId={chat.user_id} />
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          asChild
                          title="Ansehen"
                          aria-label={`Chat ${chat.title} ansehen`}
                        >
                          <Link href={`/admin/chats/${chat.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeleteChat(chat)}
                          title="Löschen"
                          aria-label={`Chat ${chat.title} löschen`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{chat.messageCount} Nachrichten</span>
                      </div>
                      <span>{formatDate(chat.created_at)}</span>
                    </div>
                  </div>

                  {/* Desktop Grid Layout */}
                  <div className="hidden grid-cols-[1fr_120px_80px_140px_80px] items-center gap-4 px-4 py-3 md:grid">
                    <div className="truncate font-medium" title={chat.title}>
                      {chat.title}
                    </div>
                    <UserIdDisplay userId={chat.user_id} />
                    <div className="flex items-center justify-center gap-1.5">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <span>{chat.messageCount}</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatDate(chat.created_at)}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        asChild
                        title="Ansehen"
                        aria-label={`Chat ${chat.title} ansehen`}
                      >
                        <Link href={`/admin/chats/${chat.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteChat(chat)}
                        title="Löschen"
                        aria-label={`Chat ${chat.title} löschen`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteChat} onOpenChange={() => setDeleteChat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du den Chat &quot;{deleteChat?.title}&quot; löschen möchtest?
              Alle Nachrichten werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht
              werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteChat(null)} disabled={isDeleting}>
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

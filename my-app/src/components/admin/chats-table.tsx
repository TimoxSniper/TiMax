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
      <Card className="border-muted/20 border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Chats</CardTitle>
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
      <Card className="border-2 border-purple-500/10 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-serif text-xl">Chats</CardTitle>
          {pagination && (
            <span className="text-muted-foreground text-sm font-medium">
              {pagination.total} gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header - Desktop only */}
          <div className="text-muted-foreground hidden grid-cols-[1fr_140px_100px_160px_100px] gap-6 border-b border-purple-500/10 px-6 py-3 text-sm font-semibold md:grid">
            <div>Titel</div>
            <div>User ID</div>
            <div className="text-center">Nachrichten</div>
            <div>Erstellt</div>
            <div className="text-center">Aktionen</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-purple-500/5 md:divide-y md:divide-y-0 md:divide-purple-500/5">
            {chats.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">
                Keine Chats gefunden
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="group transition-colors hover:bg-purple-500/5">
                  {/* Mobile Card Layout */}
                  <div className="space-y-3 p-4 md:hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold" title={chat.title}>
                          {chat.title}
                        </div>
                        <div className="mt-1">
                          <UserIdDisplay userId={chat.user_id} />
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          title="Ansehen"
                          aria-label={`Chat ${chat.title} ansehen`}
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/admin/chats/${chat.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteChat(chat)}
                          title="Löschen"
                          aria-label={`Chat ${chat.title} löschen`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <span>{chat.messageCount} Nachrichten</span>
                      </div>
                      <span>{formatDate(chat.created_at)}</span>
                    </div>
                  </div>

                  {/* Desktop Grid Layout */}
                  <div className="hidden grid-cols-[1fr_140px_100px_160px_100px] items-center gap-6 px-6 py-4 md:grid">
                    <div className="truncate font-semibold" title={chat.title}>
                      {chat.title}
                    </div>
                    <UserIdDisplay userId={chat.user_id} />
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold text-purple-600">{chat.messageCount}</span>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatDate(chat.created_at)}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        title="Ansehen"
                        aria-label={`Chat ${chat.title} ansehen`}
                        className="h-9 px-3"
                      >
                        <Link href={`/admin/chats/${chat.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteChat(chat)}
                        title="Löschen"
                        aria-label={`Chat ${chat.title} löschen`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
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
            <div className="mt-6 flex flex-col gap-3 border-t border-purple-500/10 pt-6 md:flex-row md:items-center md:justify-between">
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
      <Dialog open={!!deleteChat} onOpenChange={() => setDeleteChat(null)}>
        <DialogContent className="border-2 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Chat löschen</DialogTitle>
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

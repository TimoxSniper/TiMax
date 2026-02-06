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

export function ChatsTable({ chats, isLoading, pagination, onPageChange, onDelete }: ChatsTableProps) {
  const [deleteChat, setDeleteChat] = useState<Chat | null>(null);
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
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader>
          <CardTitle>Chats</CardTitle>
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
          <CardTitle className="text-base md:text-lg">Chats</CardTitle>
          {pagination && (
            <span className="text-xs md:text-sm text-muted-foreground">
              {pagination.total} gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header - Desktop only */}
          <div className="hidden md:grid grid-cols-[1fr_120px_80px_140px_80px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
            <div>Titel</div>
            <div>User ID</div>
            <div className="text-center">Nachrichten</div>
            <div>Erstellt</div>
            <div className="text-center">Aktionen</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {chats.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Keine Chats gefunden
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="group hover:bg-muted/50 transition-colors">
                  {/* Mobile Card Layout */}
                  <div className="md:hidden p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm" title={chat.title}>
                          {chat.title}
                        </div>
                        <div className="mt-1">
                          <UserIdDisplay userId={chat.user_id} />
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          asChild
                          title="Ansehen"
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{chat.messageCount} Nachrichten</span>
                      </div>
                      <span>{formatDate(chat.created_at)}</span>
                    </div>
                  </div>

                  {/* Desktop Grid Layout */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_80px_140px_80px] gap-4 px-4 py-3 items-center">
                    <div className="font-medium truncate" title={chat.title}>
                      {chat.title}
                    </div>
                    <UserIdDisplay userId={chat.user_id} />
                    <div className="flex items-center justify-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{chat.messageCount}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(chat.created_at)}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        asChild
                        title="Ansehen"
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
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pt-4 border-t border-border mt-4">
              <span className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
                Seite {pagination.page} von {pagination.totalPages}
              </span>
              <div className="flex gap-2 justify-center md:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex-1 md:flex-none"
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
              Alle Nachrichten werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
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

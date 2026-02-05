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

  const truncateUserId = (userId: string) => {
    if (userId.length <= 16) return userId;
    return `${userId.slice(0, 8)}...${userId.slice(-6)}`;
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
          <CardTitle>Chats</CardTitle>
          {pagination && (
            <span className="text-sm text-muted-foreground">
              {pagination.total} Chats gesamt
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_80px_140px_80px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
            <div>Titel</div>
            <div>User ID</div>
            <div className="text-center">Nachrichten</div>
            <div>Erstellt</div>
            <div className="text-center">Aktionen</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {chats.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Keine Chats gefunden
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="grid grid-cols-[1fr_120px_80px_140px_80px] gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium truncate" title={chat.title}>
                    {chat.title}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground" title={chat.user_id}>
                    {truncateUserId(chat.user_id)}
                  </div>
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

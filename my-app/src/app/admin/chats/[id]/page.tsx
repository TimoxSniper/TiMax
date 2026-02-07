"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import { ArrowLeft, User, Bot, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/admin/utils";

interface Chat {
  id: string;
  user_id: string;
  title: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export default function AdminChatDetailPage() {
  const params = useParams();
  const chatId = params.id as string;
  const router = useRouter();
  const { showToast } = useToast();
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/chats/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          setChat(data.chat);
          setMessages(data.messages || []);
        } else if (res.status === 404) {
          showToast("Chat existiert nicht", "error");
          router.push("/admin/chats");
        }
      } catch (error) {
        logger.error("Fehler beim Laden des Chats:", error);
        showToast("Chat konnte nicht geladen werden", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId, router, showToast]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();
      const res = await fetch(`/api/admin/chats/${chatId}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken }
      });
      if (res.ok) {
        showToast("Chat wurde gelöscht", "success");
        router.push("/admin/chats");
      } else {
        throw new Error("Löschen fehlgeschlagen");
      }
    } catch {
      showToast("Chat konnte nicht gelöscht werden", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chat) {
    return null;
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/admin/chats")}
              className="shrink-0 h-9 w-9 md:h-10 md:w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold break-words">{chat.title}</h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="flex items-center gap-1">
                  User: <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded break-all">{chat.user_id}</code>
                </span>
                <span className="hidden sm:inline">·</span>
                <span>Erstellt: {formatDate(chat.created_at)}</span>
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 w-full sm:w-auto shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span>Löschen</span>
          </Button>
        </div>

        {/* Messages */}
        <Card className="hover:translate-y-0 hover:shadow-editorial-md">
          <CardHeader>
            <CardTitle>{messages.length} Nachrichten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Keine Nachrichten in diesem Chat
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 p-4 rounded-lg",
                      message.role === "user"
                        ? "bg-accent/10"
                        : message.role === "assistant"
                        ? "bg-muted"
                        : "bg-yellow-50 border border-yellow-200"
                    )}
                  >
                    <div className="shrink-0">
                      {message.role === "user" ? (
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      ) : message.role === "assistant" ? (
                        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                          SYS
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.role === "user"
                            ? "Benutzer"
                            : message.role === "assistant"
                            ? "Assistent"
                            : "System"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du diesen Chat und alle {messages.length} Nachrichten löschen möchtest?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
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

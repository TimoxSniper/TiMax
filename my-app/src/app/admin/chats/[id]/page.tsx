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
        headers: { "x-csrf-token": csrfToken },
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
          <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/admin/chats")}
              className="h-9 w-9 shrink-0 md:h-10 md:w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl font-bold break-words sm:text-2xl md:text-3xl">
                {chat.title}
              </h1>
              <p className="text-muted-foreground mt-1 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
                <span className="flex items-center gap-1">
                  User:{" "}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs break-all">
                    {chat.user_id}
                  </code>
                </span>
                <span className="hidden sm:inline">·</span>
                <span>Erstellt: {formatDate(chat.created_at)}</span>
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="w-full shrink-0 gap-2 sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span>Löschen</span>
          </Button>
        </div>

        {/* Messages */}
        <Card className="hover:shadow-editorial-md hover:translate-y-0">
          <CardHeader>
            <CardTitle>{messages.length} Nachrichten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  Keine Nachrichten in diesem Chat
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 rounded-lg p-4",
                      message.role === "user"
                        ? "bg-accent/10"
                        : message.role === "assistant"
                          ? "bg-muted"
                          : "border border-yellow-200 bg-yellow-50"
                    )}
                  >
                    <div className="shrink-0">
                      {message.role === "user" ? (
                        <div className="bg-accent text-accent-foreground flex h-8 w-8 items-center justify-center rounded-full">
                          <User className="h-4 w-4" />
                        </div>
                      ) : message.role === "assistant" ? (
                        <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full">
                          <Bot className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                          SYS
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {message.role === "user"
                            ? "Benutzer"
                            : message.role === "assistant"
                              ? "Assistent"
                              : "System"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <div className="text-sm break-words whitespace-pre-wrap">
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
              Bist du sicher, dass du diesen Chat und alle {messages.length} Nachrichten löschen
              möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
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

"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Clock,
  Mail,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminChatDetail {
  id: string;
  user_id: string;
  title: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  user: {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageUrl: string | null;
  } | null;
}

interface ChatMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function AdminChatDetail() {
  const params = useParams();
  const chatId = params.id as string;

  const [chat, setChat] = useState<AdminChatDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadChatDetail();
  }, [chatId]);

  const loadChatDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/chats/${chatId}`);
      const data = await response.json();

      if (data.success) {
        setChat(data.chat);
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      const csrfResult = await fetch("/api/csrf");
      if (!csrfResult.ok) throw new Error("CSRF Error");
      const { csrfToken } = await csrfResult.json();

      const response = await fetch(`/api/admin/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (response.ok) {
        window.location.href = "/admin/chats";
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!chat) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">Chat nicht gefunden</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/admin/chats">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Liste
              </Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/chats">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Liste
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 font-serif text-2xl">{chat.title}</CardTitle>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {messages.length} Nachrichten
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDateTime(chat.updated_at)}
                      </span>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Chat löschen
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nachrichten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">
                      Keine Nachrichten vorhanden
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`max-w-[80%] rounded-lg border p-4 ${
                            message.role === "user" ? "bg-card" : "bg-secondary/50"
                          }`}
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-xs font-medium uppercase">
                              {message.role === "user" ? "Benutzer" : "Assistant"}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatDateTime(message.created_at)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Chat ID</p>
                  <p className="font-mono text-sm">{chat.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Session ID</p>
                  <p className="font-mono text-sm">{chat.session_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-sm">Erstellt am</p>
                    <p className="text-sm">{formatDateTime(chat.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {chat.user && (
              <Card>
                <CardHeader>
                  <CardTitle>Benutzer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground bg-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                      {chat.user.imageUrl ? (
                        <img
                          src={chat.user.imageUrl}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {chat.user.firstName} {chat.user.lastName}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        ID: {chat.user.userId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  {chat.user.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span>{chat.user.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-destructive h-5 w-5" />
              Chat löschen?
            </DialogTitle>
            <DialogDescription>
              Dies wird den Chat und alle {messages.length} Nachrichten dauerhaft löschen. Diese
              Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteChat}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

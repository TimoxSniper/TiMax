"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Clock, Edit2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: { id: string; role: string; content: string }[];
}

interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  _onRefresh: () => void;
}

export function ChatSidebar({ currentChatId, onSelectChat, onCreateNewChat, _onRefresh }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadChats = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`/api/chats?page=${pageNum}&limit=20`);
      const data = await response.json();
      if (data.success) {
        if (append) {
          setChats((prev) => [...prev, ...data.chats]);
        } else {
          setChats(data.chats);
        }
        setHasMore(data.pagination?.hasMore || false);
        setPage(pageNum);
      }
    } catch (error) {
      logger.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreChats = () => {
    loadChats(page + 1, true);
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Refresh wenn ein neuer Chat erstellt wurde (currentChatId ändert sich)
  useEffect(() => {
    if (currentChatId) {
      loadChats();
    }
  }, [currentChatId]);

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!confirm("Diesen Chat wirklich löschen?")) return;

    setDeletingId(chatId);
    try {
      // CSRF-Token holen
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });

      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChatId === chatId) {
          onCreateNewChat();
        }
      }
    } catch (error) {
      logger.error("Failed to delete chat:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title || "Neuer Chat");
  };

  const handleCancelEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  };

  const handleSaveEdit = async (e: React.MouseEvent | React.KeyboardEvent, chatId: string) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      if (response.ok) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: editTitle } : chat
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      logger.error("Failed to rename chat:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Heute";
    } else if (diffDays === 1) {
      return "Gestern";
    } else if (diffDays < 7) {
      return `vor ${diffDays} Tagen`;
    } else {
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
  };

  return (
    <Card className="flex flex-col h-full border-r rounded-none">
      <CardContent className="p-4 border-b">
        <button
          onClick={onCreateNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Neuer Chat</span>
        </button>
      </CardContent>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            Chats werden geladen...
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            Noch keine Chats
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
                "hover:bg-muted",
                currentChatId === chat.id && "bg-muted"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {editingId === chat.id ? (
                    <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-background border rounded px-1.5 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(e as React.KeyboardEvent, chat.id);
                          if (e.key === "Escape") handleCancelEdit(e as React.KeyboardEvent);
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveEdit(e, chat.id)}
                        className="p-1 hover:bg-primary/10 text-primary rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium truncate text-foreground flex-1">
                        {chat.title || "Neuer Chat"}
                      </h3>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleStartEdit(e, chat)}
                          className="p-1 hover:bg-muted-foreground/10 hover:text-foreground rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          disabled={deletingId === chat.id}
                          className={cn(
                            "p-1 hover:bg-destructive/10 hover:text-destructive rounded",
                            "disabled:opacity-50"
                          )}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {editingId !== chat.id && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(chat.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {hasMore && (
          <div className="px-3 py-2">
            <button
              onClick={loadMoreChats}
              disabled={loadingMore}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {loadingMore ? "Wird geladen..." : "Mehr laden"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
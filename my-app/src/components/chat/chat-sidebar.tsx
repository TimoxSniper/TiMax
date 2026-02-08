"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Plus, Trash2, Clock, Edit2, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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

export function ChatSidebar({
  currentChatId,
  onSelectChat,
  onCreateNewChat,
  _onRefresh,
}: ChatSidebarProps) {
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
    if (!loadingMore && hasMore) {
      loadChats(page + 1, true);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Set up intersection observer to automatically load more chats when user scrolls near the bottom
  const sentinelRef = useIntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreChats();
      }
    },
    {
      rootMargin: '100px', // Load when 100px from the bottom
    }
  );

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
          prev.map((chat) => (chat.id === chatId ? { ...chat, title: editTitle } : chat))
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
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  return (
    <Card className="flex h-full flex-col rounded-none border-r">
      <CardContent className="border-b p-4">
        <button
          onClick={onCreateNewChat}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors"
          aria-label="Neuen Chat erstellen"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Neuer Chat</span>
        </button>
      </CardContent>

      <CardContent className="flex-1 space-y-2 overflow-y-auto p-4" aria-label="Chat-Verlauf">
        {loading ? (
          <div className="text-muted-foreground py-4 text-center text-sm" role="status" aria-live="polite">
            Chats werden geladen...
          </div>
        ) : chats.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm">Noch keine Chats</div>
        ) : (
          <ul role="list" className="space-y-2">
            {chats.map((chat) => (
              <li key={chat.id}>
                <div
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-all",
                    "hover:bg-muted",
                    currentChatId === chat.id && "bg-muted"
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectChat(chat.id);
                    }
                  }}
                  aria-label={`Chat öffnen: ${chat.title || "Unbenannter Chat"}`}
                >
                  <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" aria-hidden="true">
                    <MessageSquare className="text-primary h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      {editingId === chat.id ? (
                        <div
                          className="flex w-full items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-background focus:ring-primary flex-1 rounded border px-1.5 py-0.5 text-sm focus:ring-1 focus:outline-none"
                            aria-label="Chat-Titel bearbeiten"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(e as React.KeyboardEvent, chat.id);
                              if (e.key === "Escape") handleCancelEdit(e as React.KeyboardEvent);
                            }}
                          />
                          <button
                            onClick={(e) => handleSaveEdit(e, chat.id)}
                            className="hover:bg-primary/10 text-primary rounded p-1"
                            aria-label="Titel speichern"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="hover:bg-destructive/10 text-destructive rounded p-1"
                            aria-label="Bearbeitung abbrechen"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-foreground flex-1 truncate text-sm font-medium">
                            {chat.title || "Neuer Chat"}
                          </h3>
                          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={(e) => handleStartEdit(e, chat)}
                              className="hover:bg-muted-foreground/10 hover:text-foreground rounded p-1"
                              aria-label={`Chat-Titel "${chat.title || "Neuer Chat"}" bearbeiten`}
                            >
                              <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              disabled={deletingId === chat.id}
                              className={cn(
                                "hover:bg-destructive/10 hover:text-destructive rounded p-1",
                                "disabled:opacity-50"
                              )}
                              aria-label={`Chat "${chat.title || "Neuer Chat"}" löschen`}
                              aria-disabled={deletingId === chat.id}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    {editingId !== chat.id && (
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span>{formatDate(chat.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {hasMore && (
          <div className="px-3 py-2">
            <button
              onClick={loadMoreChats}
              disabled={loadingMore}
              className="text-muted-foreground hover:text-foreground w-full py-2 text-sm transition-colors disabled:opacity-50"
              aria-label={loadingMore ? "Weitere Chats werden geladen" : "Weitere Chats laden"}
              aria-disabled={loadingMore}
            >
              {loadingMore ? "Wird geladen..." : "Mehr laden"}
            </button>
          </div>
        )}

        {/* Sentinel element for Intersection Observer */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </CardContent>
    </Card>
  );
}

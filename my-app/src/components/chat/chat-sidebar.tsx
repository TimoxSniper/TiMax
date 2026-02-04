"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  onRefresh: () => void;
}

export function ChatSidebar({ currentChatId, onSelectChat, onCreateNewChat, onRefresh }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadChats = async () => {
    try {
      const response = await fetch("/api/chats");
      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!confirm("Diesen Chat wirklich löschen?")) return;
    
    setDeletingId(chatId);
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChatId === chatId) {
          onCreateNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeletingId(null);
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
                  <h3 className="text-sm font-medium truncate text-foreground">
                    {chat.title || "Neuer Chat"}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    disabled={deletingId === chat.id}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                      "p-1 hover:bg-destructive/10 hover:text-destructive rounded",
                      "disabled:opacity-50"
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(chat.updated_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
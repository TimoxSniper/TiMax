/**
 * Chats Table Component
 *
 * Displays chats with user info and message counts
 */

"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/shared/data-table";
import { formatShortDate, formatRelativeTime, getInitials, truncateText } from "@/lib/admin/utils";
import { Eye, Trash2 } from "lucide-react";
import type { EnrichedChat, DataTableColumn } from "@/types/admin";

export interface ChatsTableProps {
  chats: EnrichedChat[];
  isLoading?: boolean;
  onViewChat: (chat: EnrichedChat) => void;
  onDeleteChat: (chat: EnrichedChat) => void;
}

export function ChatsTable({ chats, isLoading, onViewChat, onDeleteChat }: ChatsTableProps) {
  const columns: DataTableColumn<EnrichedChat>[] = [
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (_, chat) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-[6px]">
            <AvatarImage src={chat.user.imageUrl} alt={chat.user.fullName} />
            <AvatarFallback className="rounded-[6px] text-xs bg-accent/10 text-accent">
              {getInitials(chat.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{chat.user.fullName}</p>
            <p className="text-xs text-muted-foreground">{chat.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (_, chat) => (
        <div className="max-w-[300px]">
          <p className="font-medium text-sm">
            {chat.title ? truncateText(chat.title, 50) : <span className="text-muted-foreground italic">Untitled Chat</span>}
          </p>
        </div>
      ),
    },
    {
      key: "messageCount",
      label: "Messages",
      sortable: true,
      align: "center",
      render: (_, chat) => (
        <span className="font-mono text-sm font-semibold">{chat.messageCount}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (_, chat) => (
        <span className="text-sm">{formatShortDate(chat.created_at)}</span>
      ),
    },
    {
      key: "lastMessageAt",
      label: "Last Activity",
      sortable: true,
      render: (_, chat) => (
        <span className="text-sm">
          {chat.lastMessageAt ? formatRelativeTime(chat.lastMessageAt) : "No messages"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, chat) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-[4px]"
            onClick={(e) => {
              e.stopPropagation();
              onViewChat(chat);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-[4px]"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChat(chat);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={chats}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="Keine Chats gefunden"
      onRowClick={onViewChat}
    />
  );
}

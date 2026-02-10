/**
 * Admin Chat Detail Page
 *
 * View full chat conversation with all messages
 */

import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate, getInitials } from "@/lib/admin/utils";
import type { ChatWithDetails } from "@/types/admin";

async function getChatDetails(chatId: string): Promise<ChatWithDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/chats/${chatId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch chat details:", error);
    return null;
  }
}

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = await getChatDetails(id);

  if (!chat) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/chats">
          <Button variant="outline" size="sm" className="rounded-[4px]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chats
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold">
            {chat.title || "Untitled Chat"}
          </h1>
        </div>
      </div>

      {/* Chat Info */}
      <Card className="p-6 shadow-editorial-md">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16 rounded-[8px]">
            <AvatarImage src={chat.user.imageUrl} alt={chat.user.fullName} />
            <AvatarFallback className="rounded-[8px] bg-accent/10 text-accent text-lg">
              {getInitials(chat.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold mb-2">{chat.user.fullName}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Email</p>
                <p className="font-semibold">{chat.user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Messages</p>
                <p className="font-semibold font-mono">{chat.messageCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Created</p>
                <p className="font-semibold">{formatDate(chat.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Last Activity</p>
                <p className="font-semibold">
                  {chat.lastMessageAt ? formatDate(chat.lastMessageAt) : "No messages"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4">Conversation</h2>
        <div className="space-y-4">
          {chat.messages.length === 0 ? (
            <Card className="p-12 text-center shadow-editorial-md">
              <p className="text-muted-foreground font-sans">No messages in this chat</p>
            </Card>
          ) : (
            chat.messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 shadow-editorial-sm ${
                  message.role === "assistant"
                    ? "bg-accent/5 border-accent/20"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant={message.role === "user" ? "default" : "secondary"}
                    className="rounded-[4px] mt-1"
                  >
                    {message.role}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

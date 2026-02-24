"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface ChatHeaderProps {
  _sessionId: string;
  messageCount: number;
}

export function ChatHeader({ messageCount }: ChatHeaderProps) {
  return (
    <CardHeader className="border-border bg-card/95 border-b px-6 py-4 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="bg-primary/10 shadow-editorial-sm hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300">
            <Bot className="text-primary h-6 w-6" />
          </div>
          <div className="bg-primary border-card absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2" />
        </div>

        <div className="flex-1">
          <CardTitle className="text-foreground font-serif text-2xl font-semibold">
            TiMax
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-sm">
            {messageCount > 0
              ? `${messageCount} Nachrichten in dieser Session`
              : "Neue Chat-Session"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

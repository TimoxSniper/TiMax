"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ChatHeaderProps {
  _sessionId: string;
  messageCount: number;
}

export function ChatHeader({ _sessionId, messageCount }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b pl-16 lg:pl-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--accent-rgb)_/_0.1)]">
          <Sparkles className="text-accent h-5 w-5" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">TiMax</CardTitle>
          <CardDescription className="text-xs">
            {messageCount > 0
              ? `${messageCount} Nachrichten in dieser Session`
              : "Neue Chat-Session"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

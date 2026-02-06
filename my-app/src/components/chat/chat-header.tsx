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
        <div className="w-10 h-10 rounded-full bg-[rgb(var(--accent-rgb)_/_0.1)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent" />
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

"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ChatHeaderProps {
  sessionId: string;
  messageCount: number;
}

export function ChatHeader({ sessionId, messageCount }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">REX Content Assistant</CardTitle>
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

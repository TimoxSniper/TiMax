"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Clock, MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  _sessionId: string;
  messageCount: number;
}

export function ChatHeader({ _sessionId, messageCount }: ChatHeaderProps) {
  // Format session ID for display (first 8 characters)
  const formattedSessionId = _sessionId.slice(0, 8);

  // Get current time for session info
  const currentTime = new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <CardHeader className="border-border bg-card/95 border-b px-6 py-5 lg:px-8">
      <div className="flex flex-col gap-4">
        {/* Main header section with title and icon */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-primary/10 shadow-editorial-sm hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300">
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            {/* Bronze accent dot */}
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

        {/* Session information section */}
        <div className="bg-secondary/50 border-border/50 flex flex-wrap items-center gap-4 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">Sitzungsstart: {currentTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Sitzungs-ID: <span className="text-foreground font-mono">{formattedSessionId}</span>
            </span>
          </div>

          {/* Bronze accent line */}
          <div className="bg-primary/20 h-px flex-1" />
        </div>

        {/* Mobile optimized session info (condensed) */}
        <div className="bg-secondary/50 border-border/50 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2 lg:hidden">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground text-xs">{currentTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-foreground font-mono text-xs">{formattedSessionId}</span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}

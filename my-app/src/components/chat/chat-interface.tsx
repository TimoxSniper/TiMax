"use client";

import { useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { CHAT_UI_TEXTS } from "@/lib/constants";
import { useChat, Message } from "@/hooks/useChat";

export type { Message };

interface ChatInterfaceProps {
  initialSessionId?: string;
}

export function ChatInterface({ initialSessionId }: ChatInterfaceProps) {
  const { messages, sessionId, isLoading, error, handleSendMessage } = useChat({
    initialSessionId,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-Scroll zu letzter Nachricht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="flex flex-col h-[--height-chat-desktop] sm:h-[--height-chat-mobile] max-h-[800px]">
      <ChatHeader sessionId={sessionId} messageCount={messages.length} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
            <p className="text-lg font-medium mb-2 text-foreground">{CHAT_UI_TEXTS.WELCOME_TITLE}</p>
            <p className="text-sm mb-4 max-w-md">
              {CHAT_UI_TEXTS.WELCOME_SUBTITLE}
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-3">{CHAT_UI_TEXTS.EXAMPLE_REQUESTS_TITLE}</p>
              <div className="space-y-1 text-left bg-muted/50 rounded-lg p-3 max-w-md">
                {CHAT_UI_TEXTS.EXAMPLE_REQUESTS.map((req, index) => (
                  <p key={index}>{req}</p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{CHAT_UI_TEXTS.THINKING}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </Card>
  );
}
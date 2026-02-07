"use client";

import { Message } from "./chat-interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Bot } from "lucide-react";
import { useState, useEffect, memo, useCallback } from "react";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isMobile?: boolean;
}

export const MessageBubble = memo(({ message, isMobile = false }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);

  // Cleanup für Timeout
  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        logger.error("Kopieren fehlgeschlagen:", err);
      }
    }
  }, [message.content]);

  const isUser = message.role === "user";

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
        {/* Avatar nur für Assistant */}
        {!isUser && (
          <div className="bg-accent/10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <Bot className="text-accent h-4 w-4" />
          </div>
        )}

        <div
          className={cn(
            "flex flex-col",
            isUser ? "items-end" : "items-start",
            isUser ? "max-w-[85%]" : "max-w-[85%]"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-3",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border-border rounded-bl-md border"
            )}
          >
            <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Timestamp und Copy Button */}
          <div
            className={cn(
              "mt-1 flex items-center gap-2 px-1",
              isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span className="text-muted-foreground text-[11px]">
              {message.timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="hover:bg-muted active:bg-muted/80 rounded-full p-1.5 transition-colors"
                aria-label={copied ? "Kopiert" : "Nachricht kopieren"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="text-muted-foreground h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Avatar nur für User */}
        {isUser && (
          <div className="bg-primary/10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <User className="text-primary h-4 w-4" />
          </div>
        )}
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm">
          <Bot className="text-accent h-5 w-5" />
        </div>
      )}

      <Card
        className={cn(
          "max-w-[80%] shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted/50 dark:bg-muted/30"
        )}
      >
        <div className="p-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs opacity-60">
              {message.timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 min-w-[44px] opacity-50 transition-opacity duration-200 hover:opacity-100"
                aria-label={copied ? "Kopiert" : "Nachricht kopieren"}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {isUser && (
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm">
          <User className="text-primary h-5 w-5" />
        </div>
      )}
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

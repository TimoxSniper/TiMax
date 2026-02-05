"use client";

import { Message } from "./chat-interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isMobile?: boolean;
}

export function MessageBubble({ message, isMobile = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  // Cleanup für Timeout
  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        logger.error("Kopieren fehlgeschlagen:", err);
      }
    }
  };

  const isUser = message.role === "user";

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <div className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start"
      )}>
        {/* Avatar nur für Assistant */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
            <Bot className="w-4 h-4 text-accent" />
          </div>
        )}

        <div className={cn(
          "flex flex-col",
          isUser ? "items-end" : "items-start",
          isUser ? "max-w-[85%]" : "max-w-[85%]"
        )}>
          <div
            className={cn(
              "px-4 py-3 rounded-2xl",
              isUser 
                ? "bg-primary text-primary-foreground rounded-br-md" 
                : "bg-card border border-border rounded-bl-md"
            )}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
          
          {/* Timestamp und Copy Button */}
          <div className={cn(
            "flex items-center gap-2 mt-1 px-1",
            isUser ? "flex-row-reverse" : "flex-row"
          )}>
            <span className="text-[11px] text-muted-foreground">
              {message.timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
                aria-label={copied ? "Kopiert" : "Nachricht kopieren"}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Avatar nur für User */}
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-5 h-5 text-accent" />
        </div>
      )}

      <Card
        className={cn(
          "max-w-[80%] shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 dark:bg-muted/30"
        )}
      >
        <div className="p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center justify-between mt-2 gap-2">
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
                className="h-8 w-8 min-w-[44px] opacity-50 hover:opacity-100 transition-opacity duration-200"
                aria-label={copied ? "Kopiert" : "Nachricht kopieren"}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-5 h-5 text-primary" />
        </div>
      )}
    </div>
  );
}

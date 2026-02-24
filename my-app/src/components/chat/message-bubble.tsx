"use client";

import { Message } from "./chat-interface";
import { Copy, Check } from "lucide-react";
import { useState, useEffect, memo, useCallback } from "react";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isMobile?: boolean;
  _isLastMessage?: boolean;
}

export const MessageBubble = memo(
  ({ message, isMobile = false, _isLastMessage = false }: MessageBubbleProps) => {
    const [copied, setCopied] = useState(false);

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

    return (
      <div
        className={cn("flex", isUser ? "justify-end" : "justify-start")}
        role="listitem"
        aria-label={isUser ? "Ihre Nachricht" : "Assistenten Antwort"}
      >
        <div
          className={cn(
            "flex flex-col gap-1",
            isMobile ? "max-w-[88%]" : "max-w-[75%]",
            isUser ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isMobile && "touch-manipulation",
              isUser
                ? "bg-accent text-accent-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            )}
            role="paragraph"
          >
            <p className="touch-callout whitespace-pre-wrap break-words select-text">
              {message.content}
            </p>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 px-1",
              isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <time
              dateTime={message.timestamp.toISOString()}
              className="text-muted-foreground/50 text-xs"
            >
              {message.timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>

            {!isUser && (
              <button
                onClick={handleCopy}
                className={cn(
                  "rounded p-1 transition-colors",
                  copied
                    ? "text-green-600"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                )}
                aria-label={copied ? "Text wurde kopiert" : "Nachricht kopieren"}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

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
  _isLastMessage?: boolean;
}

export const MessageBubble = memo(
  ({ message, isMobile = false, _isLastMessage = false }: MessageBubbleProps) => {
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
        <div
          className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
          role="listitem"
          aria-label={isUser ? "Ihre Nachricht" : "Assistenten Antwort"}
        >
          {/* Avatar nur für Assistant */}
          {!isUser && (
            <div
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-100 bg-amber-50 shadow-sm transition-all duration-200"
              aria-label="Assistent"
              role="img"
            >
              <Bot className="h-5 w-5 text-amber-700" aria-hidden="true" />
            </div>
          )}

          <div
            className={cn(
              "flex flex-col",
              isUser ? "items-end" : "items-start",
              isUser ? "max-w-[88%]" : "max-w-[88%]"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-5 py-5 shadow-sm transition-all duration-200",
                isUser
                  ? "rounded-br-sm bg-amber-600 text-white"
                  : "rounded-bl-sm border border-amber-100 bg-white hover:border-amber-200"
              )}
              role="paragraph"
            >
              <p className="touch-callout font-sans text-sm leading-relaxed break-words whitespace-pre-wrap select-text">
                {message.content}
              </p>
            </div>

            {/* Timestamp und Copy Button */}
            <div
              className={cn(
                "mt-2 flex items-center gap-2 px-1",
                isUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              <time
                dateTime={message.timestamp.toISOString()}
                className="text-xs font-medium text-amber-600/60"
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
                    "touch-manipulation rounded-full p-2 transition-all duration-200",
                    copied
                      ? "scale-110 bg-green-100 text-green-600"
                      : "bg-amber-50 text-amber-600/60 hover:scale-105 hover:bg-amber-100 hover:text-amber-700"
                  )}
                  aria-label={
                    copied ? "Text wurde kopiert" : "Nachricht in Zwischenablage kopieren"
                  }
                  title={copied ? "Kopiert!" : "Kopieren"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Text wurde kopiert</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Nachricht kopieren</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Avatar nur für User */}
          {isUser && (
            <div
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100 shadow-sm transition-all duration-200"
              aria-label="Sie"
              role="img"
            >
              <User className="h-5 w-5 text-amber-700" aria-hidden="true" />
            </div>
          )}
        </div>
      );
    }

    // ========== DESKTOP LAYOUT ==========
    return (
      <div
        className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}
        role="listitem"
        aria-label={isUser ? "Ihre Nachricht" : "Assistenten Antwort"}
      >
        {!isUser && (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-100 bg-amber-50 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-amber-100"
            aria-label="Assistent"
            role="img"
          >
            <Bot className="h-6 w-6 text-amber-700" aria-hidden="true" />
          </div>
        )}

        <Card
          className={cn(
            "max-w-[75%] shadow-sm transition-all duration-200 hover:shadow-md",
            isUser
              ? "bg-amber-600 text-white"
              : "border border-amber-100 bg-white hover:border-amber-200"
          )}
        >
          <div className="p-5">
            <p className="touch-callout font-sans text-base leading-relaxed whitespace-pre-wrap select-text">
              {message.content}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <time
                dateTime={message.timestamp.toISOString()}
                className="text-xs font-medium text-amber-600/60"
              >
                {message.timestamp.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={cn(
                    "h-8 w-8 min-w-[44px] transition-all duration-200",
                    copied
                      ? "scale-110 bg-green-100 text-green-600"
                      : "bg-amber-50 text-amber-600/60 hover:scale-105 hover:bg-amber-100 hover:text-amber-700"
                  )}
                  aria-label={
                    copied ? "Text wurde kopiert" : "Nachricht in Zwischenablage kopieren"
                  }
                  title={copied ? "Kopiert!" : "Kopieren"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Text wurde kopiert</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Nachricht kopieren</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {isUser && (
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-amber-200"
            aria-label="Sie"
            role="img"
          >
            <User className="h-6 w-6 text-amber-700" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

"use client";

import { Message } from "./chat-interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Bot } from "lucide-react";
import { useState, useEffect } from "react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
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
      // In Production: Hier würde man zu einem Error-Tracking-Service loggen
      if (process.env.NODE_ENV === "development") {
        console.error("Kopieren fehlgeschlagen:", err);
      }
      // Fehler wird stillschweigend ignoriert, da Copy-Funktionalität optional ist
    }
  };

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-label="KI-Assistent">
          <Bot className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
      )}
      
      <Card
        className={`max-w-[80%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <div className="p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-xs opacity-70">
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
                className="h-8 w-8 min-w-[44px] opacity-70 hover:opacity-100"
                aria-label={copied ? "Kopiert" : "Nachricht kopieren"}
              >
                {copied ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4" aria-hidden="true" />
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-label="Du">
          <User className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
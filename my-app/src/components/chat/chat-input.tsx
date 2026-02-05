"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export function ChatInput({ onSendMessage, disabled, isMobile = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Auf Mobile: Enter sendet nicht automatisch (Nutzer wollen oft mehrzeilige Nachrichten)
    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = isMobile ? 120 : 128;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <div className="border-t bg-card/95 backdrop-blur-sm px-3 py-3 safe-area-bottom">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 px-4 py-3 rounded-2xl border border-border bg-background",
              "text-base leading-normal resize-none",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "min-h-[48px] max-h-[120px]"
            )}
            style={{ fontSize: "16px" }} // Verhindert iOS Zoom
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full shrink-0",
              "bg-primary hover:bg-primary/90",
              "disabled:opacity-40"
            )}
            aria-label="Nachricht senden"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {/* Hinweis für Mobile */}
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
          Tippe auf den Senden-Button zum Absenden
        </p>
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className="border-t p-4">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          aria-label="Nachricht eingeben"
          placeholder="Nachricht eingeben... (Enter zum Senden, Shift+Enter für neue Zeile)"
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 min-h-[44px] max-h-32 px-3 py-2 rounded-md border border-input bg-background text-sm transition-all duration-200",
            "resize-none overflow-y-auto",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:border-accent/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground/70"
          )}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="h-11 w-11 shrink-0"
          aria-label="Nachricht senden"
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

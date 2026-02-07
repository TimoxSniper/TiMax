"use client";

import { useState, useRef, KeyboardEvent } from "react";
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
      <div className="bg-card/95 safe-area-bottom border-t px-3 py-3 backdrop-blur-sm">
        <div className="flex items-end gap-2">
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
              "border-border bg-background flex-1 rounded-2xl border px-4 py-3",
              "resize-none text-base leading-normal",
              "placeholder:text-muted-foreground/60",
              "focus:ring-accent/30 focus:border-accent/50 focus:ring-2 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "max-h-[120px] min-h-[48px]"
            )}
            style={{ fontSize: "16px" }} // Verhindert iOS Zoom
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className={cn(
              "h-12 w-12 shrink-0 rounded-full",
              "bg-primary hover:bg-primary/90",
              "disabled:opacity-40"
            )}
            aria-label="Nachricht senden"
          >
            {disabled ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>

        {/* Hinweis für Mobile */}
        <p className="text-muted-foreground/50 mt-2 text-center text-[10px]">
          Tippe auf den Senden-Button zum Absenden
        </p>
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div className="border-t p-4">
      <div className="flex items-end gap-2">
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
            "border-input bg-background max-h-32 min-h-[44px] flex-1 rounded-md border px-3 py-2 text-sm transition-all duration-200",
            "resize-none overflow-y-auto",
            "focus-visible:ring-accent/30 focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:outline-none",
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
          {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

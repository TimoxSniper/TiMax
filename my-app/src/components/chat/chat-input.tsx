"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileDevice } from "@/hooks/useMobileDevice";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const isMobileDevice = useMobileDevice();

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter für neue Zeile (wird durch Input-Typ textarea unterstützt)
  };

  return (
    <div className={cn(
      "border-t p-4",
      // Auf echten mobilen Geräten: Safe Area Padding für Home-Indicator
      isMobileDevice && "mobile-safe-bottom"
    )}>
      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Nachricht eingeben"
          // Kürzerer Placeholder auf echten mobilen Geräten
          placeholder={isMobileDevice 
            ? "Nachricht eingeben..." 
            : "Nachricht eingeben... (Enter zum Senden, Shift+Enter für neue Zeile)"
          }
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 px-3 py-2 rounded-md border border-input bg-background transition-all duration-200",
            "resize-none overflow-y-auto",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)_/_0.3)] focus-visible:border-[rgb(var(--accent-rgb)_/_0.5)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground/70",
            // Auf echten mobilen Geräten: größerer Input für bessere Touch-Bedienung
            isMobileDevice 
              ? "min-h-[48px] max-h-40 text-base" 
              : "min-h-[44px] max-h-32 text-sm"
          )}
          style={{
            height: "auto",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            // Mehr Platz auf echten mobilen Geräten
            const maxHeight = isMobileDevice ? 160 : 128;
            target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
          }}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          // Größerer Touch-Target auf echten mobilen Geräten
          className={cn(
            "shrink-0",
            isMobileDevice ? "h-12 w-12" : "h-11 w-11"
          )}
          aria-label="Nachricht senden"
        >
          {disabled ? (
            <Loader2 className={cn("animate-spin", isMobileDevice ? "w-5 h-5" : "w-4 h-4")} aria-hidden="true" />
          ) : (
            <Send className={cn(isMobileDevice ? "w-5 h-5" : "w-4 h-4")} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}

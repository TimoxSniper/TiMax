"use client";

import { useState, useRef, KeyboardEvent, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatSchema } from "@/lib/validation";
import { ERROR_MESSAGES } from "@/lib/errors";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export const ChatInput = memo(({ onSendMessage, disabled, isMobile = false }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateInput = useCallback((value: string): string | null => {
    try {
      chatSchema.shape.message.parse(value);
      return null;
    } catch (err) {
      const error = err as { issues?: Array<{ message: string }> };
      return error.issues?.[0]?.message || ERROR_MESSAGES.chat.sendFailed;
    }
  }, []);

  const handleSend = useCallback(() => {
    if (input.trim() && !disabled) {
      const validationError = validateInput(input);
      if (validationError) {
        setError(validationError);
        return;
      }

      onSendMessage(input);
      setInput("");
      setError(null);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [input, disabled, onSendMessage, validateInput]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Clear error on key press
      if (error) {
        setError(null);
      }

      // Auf Mobile: Enter sendet nicht automatisch (Nutzer wollen oft mehrzeilige Nachrichten)
      if (!isMobile && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [isMobile, handleSend, error]
  );

  // Auto-resize textarea
  const handleInput = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = isExpanded ? (isMobile ? 200 : 300) : isMobile ? 120 : 128;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [isExpanded, isMobile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);

      // Validate input while typing
      if (value.length > 0) {
        const validationError = validateInput(value);
        setError(validationError);
      } else {
        setError(null);
      }

      handleInput();
    },
    [validateInput, handleInput]
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Calculate character count
  const charCount = input.length;
  const maxChars = 10000;
  const isCharCountWarning = charCount > maxChars * 0.8;
  const isCharCountError = charCount > maxChars;

  // ========== MOBILE LAYOUT ==========
  if (isMobile) {
    return (
      <div
        className="bg-card/95 safe-area-bottom border-t px-4 py-4 backdrop-blur-md"
        role="region"
        aria-label="Mobiler Chat-Eingabebereich"
      >
        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive mb-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="flex-1 font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht schreiben..."
            disabled={disabled}
            rows={1}
            className={cn(
              "border-border bg-background flex-1 rounded-2xl border px-5 py-4 transition-all duration-200",
              "resize-none text-base leading-relaxed",
              "placeholder:text-muted-foreground/60",
              "focus:ring-accent/40 focus:border-accent focus:ring-2 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                : "focus:ring-accent/40 focus:border-accent",
              isExpanded ? "max-h-[220px]" : "max-h-[140px]",
              "min-h-[56px] touch-manipulation"
            )}
            style={{ fontSize: "16px" }} // Verhindert iOS Zoom
            aria-label="Nachricht eingeben"
            aria-describedby="mobile-send-hint"
            aria-disabled={disabled}
            aria-invalid={!!error}
            role="textbox"
            aria-multiline="true"
          />

          <div className="flex flex-col gap-2">
            <Button
              onClick={toggleExpand}
              disabled={disabled}
              size="icon"
              variant="ghost"
              className="h-12 w-12 shrink-0 rounded-full"
              aria-label={isExpanded ? "Eingabefeld verkleinern" : "Eingabefeld vergrößern"}
            >
              {isExpanded ? (
                <Minimize2 className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>

            <Button
              onClick={handleSend}
              disabled={disabled || !input.trim() || !!error}
              size="icon"
              className={cn(
                "h-14 w-14 shrink-0 rounded-full transition-all duration-200",
                "bg-accent text-accent-foreground shadow-editorial-sm hover:shadow-editorial-md",
                "hover:bg-accent/90 disabled:opacity-40 disabled:hover:shadow-none",
                input.trim() && !error ? "hover:scale-105 active:scale-95" : ""
              )}
              aria-label={disabled ? "Senden deaktiviert, bitte warten" : "Nachricht senden"}
              aria-disabled={disabled}
            >
              {disabled ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Wird gesendet...</span>
                </>
              ) : (
                <Send className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Character Count */}
        {(charCount > 0 || isExpanded) && (
          <div
            className={cn(
              "mt-3 text-right text-xs font-medium",
              isCharCountError
                ? "text-destructive"
                : isCharCountWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            )}
          >
            {charCount} / {maxChars} Zeichen
          </div>
        )}

        {/* Hinweis für Mobile */}
        <p id="mobile-send-hint" className="text-muted-foreground/50 mt-2 text-center text-xs">
          Tippe auf den Senden-Button zum Absenden
        </p>
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div
      className="bg-card/50 border-t p-4 backdrop-blur-sm"
      role="region"
      aria-label="Chat-Eingabebereich"
    >
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{error}</p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Nachricht eingeben"
          aria-describedby="desktop-send-info"
          placeholder="Nachricht eingeben... (Enter zum Senden, Shift+Enter für neue Zeile)"
          disabled={disabled}
          rows={1}
          className={cn(
            "border-input bg-background max-h-72 min-h-[52px] flex-1 rounded-lg border px-4 py-3 text-sm transition-all duration-200",
            "resize-none overflow-y-auto leading-relaxed",
            "placeholder:text-muted-foreground/70",
            "focus-visible:ring-accent/40 focus-visible:border-accent focus-visible:ring-2 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              : "focus-visible:ring-accent/40 focus-visible:border-accent",
            isExpanded ? "max-h-[300px]" : "max-h-32",
            "touch-manipulation"
          )}
          aria-disabled={disabled}
          aria-invalid={!!error}
          role="textbox"
          aria-multiline="true"
        />

        <div className="flex flex-col gap-1">
          <Button
            onClick={toggleExpand}
            disabled={disabled}
            size="icon"
            variant="ghost"
            className="h-10 w-10 shrink-0"
            aria-label={isExpanded ? "Eingabefeld verkleinern" : "Eingabefeld vergrößern"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>

          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim() || !!error}
            size="icon"
            className={cn(
              "h-11 w-11 shrink-0 transition-all duration-200",
              "bg-accent text-accent-foreground shadow-editorial-sm hover:shadow-editorial-md",
              "hover:bg-accent/90 disabled:opacity-40 disabled:hover:shadow-none",
              input.trim() && !error ? "hover:scale-105 active:scale-95" : ""
            )}
            aria-label={disabled ? "Senden deaktiviert, bitte warten" : "Nachricht senden"}
            aria-disabled={disabled}
          >
            {disabled ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span className="sr-only">Wird gesendet...</span>
              </>
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Character Count and Keyboard Hint */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p id="desktop-send-info" className="text-muted-foreground text-xs">
          Drücken Sie{" "}
          <kbd className="border-muted bg-background rounded border px-1 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>{" "}
          zum Senden,{" "}
          <kbd className="border-muted bg-background rounded border px-1 py-0.5 font-mono text-[10px]">
            Shift+Enter
          </kbd>{" "}
          für eine neue Zeile
        </p>
        {(charCount > 0 || isExpanded) && (
          <div
            className={cn(
              "text-right text-xs font-medium",
              isCharCountError
                ? "text-destructive"
                : isCharCountWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            )}
          >
            {charCount} / {maxChars} Zeichen
          </div>
        )}
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

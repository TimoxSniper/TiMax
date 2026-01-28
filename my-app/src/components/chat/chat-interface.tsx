"use client";

import { useState, useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialSessionId?: string;
}

export function ChatInterface({ initialSessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(initialSessionId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Session-ID generieren falls nicht vorhanden
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Auto-Scroll zu letzter Nachricht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Abbrechen vorheriger Request falls noch aktiv
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Neue Request-ID für Race-Condition-Schutz
    const currentRequestId = ++requestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Erstelle aktualisierte Messages-Liste mit neuer Nachricht
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Sende Request mit vollständiger Historie
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({
          message: content.trim(),
          sessionId,
          chatHistory: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      // Prüfe ob dieser Request noch aktuell ist (Race-Condition-Schutz)
      if (currentRequestId !== requestIdRef.current) {
        return; // Verwerfe veraltete Antwort
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler bei der Chat-Anfrage");
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.output || "Keine Antwort erhalten",
        timestamp: new Date(),
      };

      // Nur aktualisieren wenn dieser Request noch aktuell ist
      if (currentRequestId === requestIdRef.current) {
        setMessages((prev) => {
          // Prüfe ob die User-Nachricht bereits vorhanden ist
          const userMsgExists = prev.some((msg) => msg.id === userMessage.id);
          if (userMsgExists) {
            return [...prev, assistantMessage];
          }
          // Falls nicht (sollte nicht passieren), füge beide hinzu
          return [...prev, userMessage, assistantMessage];
        });
      }
    } catch (err) {
      // Ignoriere Abort-Errors (normale Request-Cancellation)
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      // Nur Fehler anzeigen wenn dieser Request noch aktuell ist
      if (currentRequestId === requestIdRef.current) {
        const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
        setError(errorMessage);
        // In Production: Hier würde man zu einem Error-Tracking-Service loggen
        if (process.env.NODE_ENV === "development") {
          console.error("Chat-Fehler:", err);
        }
      }
    } finally {
      // Nur Loading-State zurücksetzen wenn dieser Request noch aktuell ist
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };


  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <ChatHeader sessionId={sessionId} messageCount={messages.length} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Willkommen bei REX!</p>
            <p className="text-sm">
              Stelle Fragen oder bitte um Content-Generierung.
              <br />
              Beispiel: "Erstelle einen LinkedIn Post über Produktivität"
            </p>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">REX denkt nach...</span>
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
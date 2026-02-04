"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// Das Message-Interface wird von der Komponente importiert,
// daher definieren wir es hier wieder oder importieren es von einem geteilten Ort.
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  initialSessionId?: string;
}

export function useChat({ initialSessionId }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(initialSessionId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Session-ID mit UUID generieren, falls nicht vorhanden
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `chat-${uuidv4()}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const currentRequestId = ++requestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Message = {
      id: `msg-${uuidv4()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Fehler bei der Chat-Anfrage");
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Fehler bei der Chat-Anfrage");
      }

      const assistantMessage: Message = {
        id: `msg-${uuidv4()}`,
        role: "assistant",
        content: data.output || "Keine Antwort erhalten",
        timestamp: new Date(),
      };

      if (currentRequestId === requestIdRef.current) {
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Ignoriere Abort-Errors
        return;
      }

      if (currentRequestId === requestIdRef.current) {
        const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
        setError(errorMessage);
        // Hier sollte Sentry oder ein anderer Error-Tracker integriert werden
        console.error("Chat-Fehler:", err);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  return {
    messages,
    sessionId,
    isLoading,
    error,
    handleSendMessage,
  };
}

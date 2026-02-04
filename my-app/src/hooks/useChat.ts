"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { CHAT_UI_TEXTS, CHAT_ERROR_TEXTS } from "@/lib/constants";
import * as Sentry from "@sentry/nextjs";

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
  const [chatId, setChatId] = useState<string | null>(null);
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

  // Lade Historie wenn chatId gesetzt wird
  useEffect(() => {
    if (!chatId) return;

    const abortController = new AbortController();

    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/chat?chat_id=${chatId}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || CHAT_ERROR_TEXTS.HISTORY_LOAD_ERROR || "Historie konnte nicht geladen werden");
        }

        const data = await response.json();

        if (data.success && data.chat) {
          const loadedMessages = (data.chat.messages || []).map((m: any) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at || m.timestamp),
          }));

          // Wenn der Chat eine Session-ID hat, übernehmen wir diese
          if (data.chat.session_id) {
            setSessionId(data.chat.session_id);
          }

          setMessages(loadedMessages);
        } else {
          throw new Error(data.error || "Unerwartetes Format der Historien-Daten");
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Fehler beim Laden der Historie:", err);
        setError(err instanceof Error ? err.message : "Historie konnte nicht geladen werden");

        Sentry.captureException(err, {
          extra: { chatId, action: "loadHistory" }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      abortController.abort();
    };
  }, [chatId]);

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
      // Hole CSRF-Token vor dem POST
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        signal: abortController.signal,
        body: JSON.stringify({
          message: content.trim(),
          sessionId,
          chat_id: chatId, // Sende bestehende chat_id mit
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
        throw new Error(data.error || CHAT_ERROR_TEXTS.DEFAULT_API_ERROR);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || CHAT_ERROR_TEXTS.DEFAULT_API_ERROR);
      }

      // Speichere die chat_id vom Server
      if (data.chat_id && !chatId) {
        setChatId(data.chat_id);
      }

      const assistantMessage: Message = {
        id: `msg-${uuidv4()}`,
        role: "assistant",
        content: data.output || CHAT_UI_TEXTS.ASSISTANT_DEFAULT_RESPONSE,
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
        const errorMessage = err instanceof Error ? err.message : CHAT_ERROR_TEXTS.UNKNOWN_ERROR;
        setError(errorMessage);

        // Sentry Integration für Production Error-Tracking
        Sentry.captureException(err, {
          extra: {
            sessionId,
            chatId,
            messageCount: messages.length,
            requestId: currentRequestId
          }
        });

        console.error(CHAT_ERROR_TEXTS.CHAT_ERROR_LOG_PREFIX, err);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatId(null);
    const newSessionId = `chat-${uuidv4()}`;
    setSessionId(newSessionId);
    setError(null);
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    messages,
    sessionId,
    chatId,
    isLoading,
    error,
    handleSendMessage,
    startNewChat,
    setChatId,
  };
}

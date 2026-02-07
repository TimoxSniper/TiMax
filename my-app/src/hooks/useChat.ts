"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { CHAT_UI_TEXTS, CHAT_ERROR_TEXTS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { useMessages, Message } from "./useMessages";
import { useSession } from "./useSession";
import { handleError } from "@/lib/error-handler";

// Exportiere Message-Typ für andere Komponenten
export type { Message };

interface RawMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  timestamp?: string;
}

interface UseChatOptions {
  initialSessionId?: string;
}

export function useChat({ initialSessionId }: UseChatOptions = {}) {
  const { messages, addMessage, setMessages } = useMessages();
  const { sessionId, setSessionId, chatId, setChatId, createNewSession } = useSession({
    initialSessionId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Prüfe auf Transkript-Übergabe aus Dashboard (einmalig beim Mount)
  useEffect(() => {
    const pendingTranscript = localStorage.getItem("pending_transcript");
    if (pendingTranscript && messages.length === 0) {
      const initialMessage: Message = {
        id: `context-${uuidv4()}`,
        role: "user",
        content: `Hier ist ein Transkript als Kontext:\n\n${pendingTranscript}\n\nBitte hilf mir, dieses Transkript zu analysieren oder Inhalte daraus zu generieren.`,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      localStorage.removeItem("pending_transcript");
    }
  }, []); // Nur beim ersten Mount ausführen

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
          throw new Error(
            errorData.error ||
              CHAT_ERROR_TEXTS.HISTORY_LOAD_ERROR ||
              "Historie konnte nicht geladen werden"
          );
        }

        const data = await response.json();

        if (data.success && data.chat) {
          const loadedMessages = (data.chat.messages || []).map((m: RawMessage) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.created_at || m.timestamp || Date.now()),
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

        // Verwende das zentrale Error-Handling
        const handledError = handleError(err, {
          action: "loadHistory",
          chatId,
          component: "useChat",
        });

        setError(handledError.userMessage || "Historie konnte nicht geladen werden");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      abortController.abort();
    };
  }, [chatId, setMessages, setSessionId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const currentRequestId = ++requestIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Omit<Message, "id" | "timestamp"> = {
      role: "user",
      content: content.trim(),
    };

    addMessage(userMessage);
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
          chatHistory: [
            ...messages,
            { ...userMessage, id: `temp-${uuidv4()}`, timestamp: new Date() },
          ]
            .slice(-10)
            .map((msg) => ({
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

      const assistantMessage: Omit<Message, "id" | "timestamp"> = {
        role: "assistant",
        content: data.output || CHAT_UI_TEXTS.ASSISTANT_DEFAULT_RESPONSE,
      };

      if (currentRequestId === requestIdRef.current) {
        addMessage(assistantMessage);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Ignoriere Abort-Errors
        return;
      }

      if (currentRequestId === requestIdRef.current) {
        // Verwende das zentrale Error-Handling
        const handledError = handleError(err, { 
          action: "sendMessage", 
          sessionId,
          chatId,
          messageCount: messages.length,
          requestId: currentRequestId,
          component: "useChat"
        });
        
        setError(handledError.userMessage || CHAT_ERROR_TEXTS.UNKNOWN_ERROR);
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
    createNewSession();
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

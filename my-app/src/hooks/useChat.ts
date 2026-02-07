"use client";

import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { CHAT_UI_TEXTS, CHAT_ERROR_TEXTS } from "@/lib/constants";
import * as Sentry from "@sentry/nextjs";
import { logger } from "@/lib/logger";
import { useChatReducer, ChatState, Message } from "./useChatReducer";

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
  const { state, dispatch } = useChatReducer(initialSessionId);
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Prüfe auf Transkript-Übergabe aus Dashboard (einmalig beim Mount)
  useEffect(() => {
    const pendingTranscript = localStorage.getItem("pending_transcript");
    if (pendingTranscript && state.messages.length === 0) {
      const initialMessage: Message = {
        id: `context-${uuidv4()}`,
        role: "user",
        content: `Hier ist ein Transkript als Kontext:\n\n${pendingTranscript}\n\nBitte hilf mir, dieses Transkript zu analysieren oder Inhalte daraus zu generieren.`,
        timestamp: new Date(),
      };
      dispatch({ type: "SET_MESSAGES", payload: [initialMessage] });
      localStorage.removeItem("pending_transcript");
    }
  }, []); // Nur beim ersten Mount ausführen

  // Lade Historie wenn chatId gesetzt wird
  useEffect(() => {
    if (!state.chatId) return;

    const abortController = new AbortController();

    const loadHistory = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      try {
        const response = await fetch(`/api/chat?chat_id=${state.chatId}`, {
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
            dispatch({ type: "SET_SESSION_ID", payload: data.chat.session_id });
          }

          dispatch({ type: "SET_MESSAGES", payload: loadedMessages });
        } else {
          throw new Error(data.error || "Unerwartetes Format der Historien-Daten");
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        logger.error("Fehler beim Laden der Historie:", err);
        dispatch({ 
          type: "SET_ERROR", 
          payload: err instanceof Error ? err.message : "Historie konnte nicht geladen werden" 
        });

        Sentry.captureException(err, {
          extra: { chatId: state.chatId, action: "loadHistory" },
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadHistory();

    return () => {
      abortController.abort();
    };
  }, [state.chatId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || state.isLoading) return;

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

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

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
          sessionId: state.sessionId,
          chat_id: state.chatId, // Sende bestehende chat_id mit
          chatHistory: [...state.messages, userMessage].slice(-10).map((msg) => ({
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
      if (data.chat_id && !state.chatId) {
        dispatch({ type: "SET_CHAT_ID", payload: data.chat_id });
      }

      const assistantMessage: Message = {
        id: `msg-${uuidv4()}`,
        role: "assistant",
        content: data.output || CHAT_UI_TEXTS.ASSISTANT_DEFAULT_RESPONSE,
        timestamp: new Date(),
      };

      if (currentRequestId === requestIdRef.current) {
        dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Ignoriere Abort-Errors
        return;
      }

      if (currentRequestId === requestIdRef.current) {
        const errorMessage = err instanceof Error ? err.message : CHAT_ERROR_TEXTS.UNKNOWN_ERROR;
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        // Sentry Integration für Production Error-Tracking
        Sentry.captureException(err, {
          extra: {
            sessionId: state.sessionId,
            chatId: state.chatId,
            messageCount: state.messages.length,
            requestId: currentRequestId,
          },
        });

        logger.error(CHAT_ERROR_TEXTS.CHAT_ERROR_LOG_PREFIX, err);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        dispatch({ type: "SET_LOADING", payload: false });
        abortControllerRef.current = null;
      }
    }
  };

  const startNewChat = () => {
    dispatch({ type: "RESET_CHAT" });
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    messages: state.messages,
    sessionId: state.sessionId,
    chatId: state.chatId,
    isLoading: state.isLoading,
    error: state.error,
    handleSendMessage,
    startNewChat,
    setChatId: (id: string | null) => dispatch({ type: "SET_CHAT_ID", payload: id }),
  };
}

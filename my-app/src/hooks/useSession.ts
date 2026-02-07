import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { UseSessionOptions } from "@/lib/types";

export function useSession({ initialSessionId }: UseSessionOptions = {}) {
  const [sessionId, setSessionId] = useState<string>(initialSessionId || `chat-${uuidv4()}`);
  const [chatId, setChatId] = useState<string | null>(null);

  const createNewSession = useCallback(() => {
    const newSessionId = `chat-${uuidv4()}`;
    setSessionId(newSessionId);
    setChatId(null);
    return newSessionId;
  }, []);

  return {
    sessionId,
    setSessionId,
    chatId,
    setChatId,
    createNewSession,
  };
}
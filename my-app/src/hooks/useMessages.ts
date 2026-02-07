import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseMessagesOptions {
  initialMessages?: Message[];
}

export function useMessages({ initialMessages = [] }: UseMessagesOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: `msg-${uuidv4()}`,
      ...message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const addMessages = useCallback((newMessages: Omit<Message, 'id' | 'timestamp'>[]) => {
    const messagesWithIds = newMessages.map(message => ({
      id: `msg-${uuidv4()}`,
      ...message,
      timestamp: new Date(),
    }));
    setMessages(prev => [...prev, ...messagesWithIds]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return {
    messages,
    addMessage,
    addMessages,
    clearMessages,
    removeMessage,
    setMessages,
  };
}
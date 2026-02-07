import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface RawMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  timestamp?: string;
}

export interface ChatState {
  messages: Message[];
  sessionId: string;
  chatId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_CHAT_ID"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_CHAT" };

const initialState: ChatState = {
  messages: [],
  sessionId: `chat-${uuidv4()}`,
  chatId: null,
  isLoading: false,
  error: null,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload };
    case "SET_CHAT_ID":
      return { ...state, chatId: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "RESET_CHAT":
      return {
        ...initialState,
        sessionId: `chat-${uuidv4()}`,
      };
    default:
      return state;
  }
}

export function useChatReducer(initialSessionId?: string) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    sessionId: initialSessionId || `chat-${uuidv4()}`,
  });

  return { state, dispatch };
}
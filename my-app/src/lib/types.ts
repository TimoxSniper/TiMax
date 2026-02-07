/**
 * Gemeinsame Typdefinitionen für die Anwendung
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RawMessage {
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

export interface UseChatOptions {
  initialSessionId?: string;
}

export interface UseMessagesOptions {
  initialMessages?: Message[];
}

export interface UseSessionOptions {
  initialSessionId?: string;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface UseUploadsOptions {
  maxConcurrentUploads?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatApiResponse {
  success: boolean;
  output?: string;
  chat_id?: string;
  error?: string;
}

export interface UploadApiResponse {
  success: boolean;
  status?: string;
  fileName?: string;
  transcript?: string;
  uploadId?: string;
  error?: string;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}
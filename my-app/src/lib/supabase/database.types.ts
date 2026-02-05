/**
 * TiMax Supabase Database Types
 * 
 * Diese Datei definiert TypeScript-Typen für alle Supabase-Tabellen.
 * Basierend auf dem Schema in /supabase-schema.sql
 * 
 * HINWEIS: Bei Schema-Änderungen manuell aktualisieren oder
 * mit `npx supabase gen types typescript` automatisch generieren.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          role?: "user" | "assistant";
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey";
            columns: ["chat_id"];
            referencedRelation: "chats";
            referencedColumns: ["id"];
          }
        ];
      };
      uploads: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          storage_path: string | null;
          transcript: string | null;
          status: string;
          error_message: string | null;
          metadata: UploadMetadata | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path?: string | null;
          transcript?: string | null;
          status?: string;
          error_message?: string | null;
          metadata?: UploadMetadata | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path?: string | null;
          transcript?: string | null;
          status?: string;
          error_message?: string | null;
          metadata?: UploadMetadata | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

/**
 * Upload Metadata Interface
 * Definiert die Struktur der AI-generierten Metadaten für Uploads
 */
export interface UploadMetadata {
  topics?: string[];
  intention?: "bildung" | "motivation" | "argumentation" | "beispiel" | "geschichte" | "general";
  platform_suitability?: ("reel_hook" | "linkedin_post" | "twitter_thread" | "youtube_short" | "blog_post")[];
  tone?: "enthusiastisch" | "kritisch" | "sachlich" | "inspirierend" | "neutral";
  content_quality?: number; // 1-10
  key_quotes?: string[];
}

/**
 * Convenience Types für einfacheren Zugriff
 */
export type Chat = Database["public"]["Tables"]["chats"]["Row"];
export type ChatInsert = Database["public"]["Tables"]["chats"]["Insert"];
export type ChatUpdate = Database["public"]["Tables"]["chats"]["Update"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export type Upload = Database["public"]["Tables"]["uploads"]["Row"];
export type UploadInsert = Database["public"]["Tables"]["uploads"]["Insert"];
export type UploadUpdate = Database["public"]["Tables"]["uploads"]["Update"];

/**
 * Chat mit Messages (für Abfragen mit Relations)
 */
export interface ChatWithMessages extends Chat {
  messages: Message[];
}

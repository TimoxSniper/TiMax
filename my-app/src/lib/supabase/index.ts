/**
 * Supabase Client Exports
 * 
 * Zentrale Export-Datei für alle Supabase-Clients und Typen
 */

// Client-seitig (Browser)
export { createClient } from "./client";

// Server-seitig (API Routes, Server Components)
export { createClient as createServerClient } from "./server";

// Admin (Service Role - für Server-zu-Server, n8n, Cron)
export { createAdminClient, getAdminClient } from "./admin";

// Types
export type {
  Database,
  Json,
  Chat,
  ChatInsert,
  ChatUpdate,
  Message,
  MessageInsert,
  MessageUpdate,
  Upload,
  UploadInsert,
  UploadUpdate,
  UploadMetadata,
  ChatWithMessages,
} from "./database.types";

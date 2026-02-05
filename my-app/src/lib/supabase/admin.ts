import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Admin Client mit Service Role Key
 * WICHTIG: Nur für Server-zu-Server Kommunikation verwenden!
 * - Bypass RLS (Row Level Security)
 * - Für n8n Webhooks, Cron Jobs, Admin-Operationen
 * - NIEMALS im Client verwenden!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Admin Client: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY sind erforderlich"
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Alias für ältere Imports - Async-Version für Kompatibilität
 * @deprecated Verwende createAdminClient() direkt
 */
export async function getAdminClient() {
  return createAdminClient();
}

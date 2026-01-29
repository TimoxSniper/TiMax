import { z } from "zod";

/**
 * Schema für Environment-Variablen
 * Validiert alle benötigten ENV-Vars beim Start der Anwendung
 */
const envSchema = z.object({
  // n8n Webhook URLs (erforderlich)
  N8N_CHAT_WEBHOOK_URL: z.string().url().optional(),
  N8N_UPLOAD_WEBHOOK_URL: z.string().url().optional(),

  // n8n API (optional, für MCP Server)
  N8N_API_URL: z.string().url().optional().default("http://localhost:5678"),
  N8N_API_KEY: z.string().optional(),

  // NextAuth.js (für Phase 2 - optional für jetzt)
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Supabase (für Phase 2 - optional für jetzt)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional().default("uploads"),

  // VirusTotal (optional, für Virus-Scanning)
  VIRUSTOTAL_API_KEY: z.string().optional(),

  // Sentry (für Phase 1.1 - optional für jetzt)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Analytics (für Phase 1.2 - optional für jetzt)
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validiert und gibt die Environment-Variablen zurück
 * Wirft einen Fehler, wenn kritische Variablen fehlen
 */
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Fehlerhafte Environment-Variablen:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Ungültige Environment-Variablen");
  }

  return parsed.data;
}

/**
 * Validiert nur die kritischen ENV-Vars (für API-Routen)
 * Gibt einen Fehler zurück, wenn kritische Variablen fehlen
 */
export function validateRequiredEnv() {
  const env = process.env;

  // Kritische Variablen für API-Routen
  const errors: string[] = [];

  if (!env.N8N_CHAT_WEBHOOK_URL) {
    errors.push("N8N_CHAT_WEBHOOK_URL ist erforderlich");
  }

  if (!env.N8N_UPLOAD_WEBHOOK_URL) {
    errors.push("N8N_UPLOAD_WEBHOOK_URL ist erforderlich");
  }

  if (errors.length > 0) {
    throw new Error(`Fehlende Environment-Variablen: ${errors.join(", ")}`);
  }

  return {
    N8N_CHAT_WEBHOOK_URL: env.N8N_CHAT_WEBHOOK_URL!,
    N8N_UPLOAD_WEBHOOK_URL: env.N8N_UPLOAD_WEBHOOK_URL!,
    N8N_API_URL: env.N8N_API_URL || "http://localhost:5678",
    N8N_API_KEY: env.N8N_API_KEY,
  };
}

/**
 * Validiert die Environment-Variablen (nur bei Bedarf aufrufen)
 * In Production wird ein Fehler geworfen, in Development nur eine Warnung
 */
export function getEnv() {
  return validateEnv();
}

/**
 * Helper-Funktion für sichere ENV-Zugriffe
 */
export function getEnvValue(key: keyof z.infer<typeof envSchema>): string | undefined {
  const env = getEnv();
  return env[key];
}


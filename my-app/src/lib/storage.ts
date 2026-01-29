/**
 * File Storage mit Supabase Storage Free Tier
 * Kostenlos: 1GB Storage, 2GB Bandwidth/Monat
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

// Supabase Client (Server-side)
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialisiert Supabase Client
 */
function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL oder Service Role Key fehlt');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

/**
 * Uploadet eine Datei zu Supabase Storage
 * 
 * @param file - Datei als File oder Buffer
 * @param fileName - Dateiname
 * @param userId - User ID (optional, für Zugriffskontrolle)
 * @returns Storage URL
 */
export async function uploadFile(
  file: File | Buffer,
  fileName: string,
  userId?: string
): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();

    // Erstelle eindeutigen Pfad
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = userId 
      ? `${userId}/${timestamp}-${sanitizedFileName}`
      : `uploads/${timestamp}-${sanitizedFileName}`;

    // Konvertiere File zu Buffer falls nötig
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload zu Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file instanceof File ? file.type : 'application/octet-stream',
        upsert: false, // Überschreibe nicht existierende Dateien
      });

    if (error) {
      console.error('Supabase Storage Upload Fehler:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Erstelle Private URL (Signed URL für Download)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, 3600); // 1 Stunde gültig

    if (urlError) {
      console.error('Supabase Signed URL Fehler:', urlError);
      return {
        success: false,
        error: urlError.message,
      };
    }

    return {
      success: true,
      url: urlData.signedUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Storage Upload Fehler:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
}

/**
 * Löscht eine Datei aus Supabase Storage
 * 
 * @param filePath - Pfad zur Datei
 */
export async function deleteFile(filePath: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Supabase Storage Delete Fehler:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Storage Delete Fehler:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
}

/**
 * Erstellt eine Signed URL für Download
 * 
 * @param filePath - Pfad zur Datei
 * @param expiresIn - Gültigkeit in Sekunden (Standard: 1 Stunde)
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Supabase Signed URL Fehler:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    console.error('Signed URL Fehler:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
}

/**
 * Prüft ob Storage verfügbar ist
 */
export function isStorageAvailable(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}


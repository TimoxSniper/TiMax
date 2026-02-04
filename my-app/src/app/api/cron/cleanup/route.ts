import { NextRequest, NextResponse } from "next/server";
import { RETENTION_POLICY } from "@/lib/upload-config";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

/**
 * Cron Job für File Cleanup & Retention Policy
 * 
 * Wird von Vercel Cron Jobs aufgerufen (vercel.json konfiguriert)
 * 
 * Retention Policy:
 * - Uploads ohne Transkript: 7 Tage
 * - Fertige Transkripte: 90 Tage ohne Aktivität
 * - Gelöschte Accounts: SOFORT alle Daten löschen
 * 
 * Hinweis: Diese Route benötigt eine Database-Integration,
 * um tatsächlich Dateien zu löschen. Aktuell ist dies eine
 * Vorbereitung für zukünftige Implementierung.
 */
export async function GET(request: NextRequest) {
  try {
    // Prüfe Authorization Header (Vercel Cron Secret)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();
    const deletedCounts = {
      uploadsWithoutTranscript: 0,
      inactiveChats: 0,
      oldUploads: 0,
    };

    const supabase = await createClient();

    // 1. Lösche Uploads ohne Transkript (älter als 7 Tage)
    const uploadsWithoutTranscriptCutoff = new Date(
      now.getTime() - RETENTION_POLICY.uploadsWithoutTranscript
    );

    const { data: uploadsToDelete, error: uploadsError } = await supabase
      .from("uploads")
      .select("id")
      .is("transcript", null)
      .lt("created_at", uploadsWithoutTranscriptCutoff.toISOString());

    if (!uploadsError && uploadsToDelete) {
      for (const upload of uploadsToDelete) {
        const { error: deleteError } = await supabase
          .from("uploads")
          .delete()
          .eq("id", upload.id);

        if (!deleteError) {
          deletedCounts.uploadsWithoutTranscript++;
        } else {
          logger.error("[Cleanup] Fehler beim Löschen von Upload:", deleteError);
        }
      }
    } else if (uploadsError) {
      logger.error("[Cleanup] Fehler beim Abrufen von Uploads:", uploadsError);
    }

    // 2. Lösche inaktive Chats (90 Tage ohne Aktivität)
    // Hinweis: Chats haben kein updated_at in RLS Policies, daher nutzen wir created_at
    const inactiveChatsCutoff = new Date(
      now.getTime() - RETENTION_POLICY.transcriptsInactive
    );

    const { data: chatsToDelete, error: chatsError } = await supabase
      .from("chats")
      .select("id")
      .lt("created_at", inactiveChatsCutoff.toISOString());

    if (!chatsError && chatsToDelete) {
      for (const chat of chatsToDelete) {
        // Messages werden durch CASCADE automatisch gelöscht
        const { error: deleteError } = await supabase
          .from("chats")
          .delete()
          .eq("id", chat.id);

        if (!deleteError) {
          deletedCounts.inactiveChats++;
        } else {
          logger.error("[Cleanup] Fehler beim Löschen von Chat:", deleteError);
        }
      }
    } else if (chatsError) {
      logger.error("[Cleanup] Fehler beim Abrufen von Chats:", chatsError);
    }

    // 3. Lösche alte Uploads mit Transkript (älter als 90 Tage)
    const oldUploadsCutoff = new Date(
      now.getTime() - RETENTION_POLICY.transcriptsInactive
    );

    const { data: oldUploads, error: oldUploadsError } = await supabase
      .from("uploads")
      .select("id")
      .not("transcript", "is", null)
      .lt("created_at", oldUploadsCutoff.toISOString());

    if (!oldUploadsError && oldUploads) {
      for (const upload of oldUploads) {
        const { error: deleteError } = await supabase
          .from("uploads")
          .delete()
          .eq("id", upload.id);

        if (!deleteError) {
          deletedCounts.oldUploads++;
        } else {
          logger.error("[Cleanup] Fehler beim Löschen von altem Upload:", deleteError);
        }
      }
    } else if (oldUploadsError) {
      logger.error("[Cleanup] Fehler beim Abrufen von alten Uploads:", oldUploadsError);
    }

    logger.log("[Cleanup] Erfolgreich ausgeführt:", deletedCounts);

    return NextResponse.json({
      success: true,
      message: "Cleanup Job erfolgreich ausgeführt",
      timestamp: now.toISOString(),
      deletedCounts,
      retentionPolicy: {
        uploadsWithoutTranscript: `${RETENTION_POLICY.uploadsWithoutTranscript / (1000 * 60 * 60 * 24)} Tage`,
        inactiveData: `${RETENTION_POLICY.transcriptsInactive / (1000 * 60 * 60 * 24)} Tage`,
      },
    });
  } catch (error) {
    logger.error("Cleanup Job Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Ein interner Fehler ist aufgetreten.",
      },
      { status: 500 }
    );
  }
}


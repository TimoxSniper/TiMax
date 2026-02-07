import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";

/**
 * POST /api/uploads/create
 * Erstellt einen Upload-Eintrag in Supabase BEVOR die Datei zu n8n gesendet wird
 * Gibt die upload_id zurück, die dann als Header an n8n gesendet wird
 */
async function createUploadHandler(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileSize, fileType } = body;

    if (!fileName || !fileSize || !fileType) {
      return NextResponse.json(
        {
          success: false,
          error: "fileName, fileSize und fileType sind erforderlich",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Upload-Eintrag erstellen mit Status "pending"
    const { data: upload, error } = await supabase
      .from("uploads")
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        status: "pending", // Wird von n8n auf "processing" → "completed" gesetzt
      })
      .select("id")
      .single();

    if (error) {
      logger.error("[Create Upload API] Fehler beim Erstellen:", error);
      throw error;
    }

    logger.log("[Create Upload API] Upload-Eintrag erstellt:", upload.id);

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/uploads/create" },
    });

    logger.error("[Create Upload API] Fehler:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Fehler beim Erstellen des Upload-Eintrags",
      },
      { status: 500 }
    );
  }
}

export const POST = withCsrfProtection(createUploadHandler);

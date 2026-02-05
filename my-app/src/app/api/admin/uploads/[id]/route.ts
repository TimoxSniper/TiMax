import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Einzelnen Upload laden
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Admin-Check
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Keine Admin-Berechtigung" },
        { status: 403 }
      );
    }

    const { id: uploadId } = await params;
    const supabase = createAdminClient();

    const { data: upload, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .single();

    if (error || !upload) {
      return NextResponse.json(
        { success: false, error: "Upload nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      upload,
    });
  } catch (error) {
    logger.error("[Admin Upload API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/uploads/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Uploads" },
      { status: 500 }
    );
  }
}

// DELETE: Upload löschen
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Admin-Check
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Keine Admin-Berechtigung" },
        { status: 403 }
      );
    }

    const { id: uploadId } = await params;
    const supabase = createAdminClient();

    // Erst prüfen ob Upload existiert (für Storage-Pfad)
    const { data: upload } = await supabase
      .from("uploads")
      .select("storage_path")
      .eq("id", uploadId)
      .single();

    // Falls Datei im Storage existiert, auch dort löschen
    if (upload?.storage_path) {
      const { error: storageError } = await supabase
        .storage
        .from("timax-uploads")
        .remove([upload.storage_path]);

      if (storageError) {
        logger.warn("[Admin Upload API] Fehler beim Löschen der Datei aus Storage:", storageError);
        // Weiter machen, Datenbank-Eintrag trotzdem löschen
      }
    }

    // Upload aus Datenbank löschen
    const { error } = await supabase
      .from("uploads")
      .delete()
      .eq("id", uploadId);

    if (error) {
      logger.error("[Admin Upload API] Fehler beim Löschen:", error);
      throw error;
    }

    logger.info(`[Admin] Upload ${uploadId} gelöscht von Admin ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Upload erfolgreich gelöscht",
    });
  } catch (error) {
    logger.error("[Admin Upload API] Fehler beim Löschen:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/uploads/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Uploads" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

/**
 * POST /api/uploads/[id]/retry
 * Retry a failed upload by resetting its status to pending
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const uploadId = params.id;

    const supabase = createAdminClient();

    // First, verify the upload belongs to the user and is in failed state
    const { data: upload, error: fetchError } = await supabase
      .from("uploads")
      .select("id, user_id, status, file_name")
      .eq("id", uploadId)
      .single();

    if (fetchError || !upload) {
      logger.error("[Upload Retry API] Upload nicht gefunden:", fetchError);
      return NextResponse.json(
        { success: false, error: "Upload nicht gefunden" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (upload.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Keine Berechtigung für diese Aktion" },
        { status: 403 }
      );
    }

    // Only allow retry for failed uploads
    if (upload.status !== "failed") {
      return NextResponse.json(
        {
          success: false,
          error: `Retry ist nur für fehlgeschlagene Uploads möglich. Aktueller Status: ${upload.status}`,
        },
        { status: 400 }
      );
    }

    // Reset upload to pending/processing state
    const { data: updatedUpload, error: updateError } = await supabase
      .from("uploads")
      .update({
        status: "pending",
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", uploadId)
      .select("*")
      .single();

    if (updateError) {
      logger.error("[Upload Retry API] Fehler beim Update:", updateError);
      throw updateError;
    }

    logger.info(`[Upload Retry] Retry gestartet für: ${upload.file_name} (${uploadId})`);

    // TODO: Optional - Trigger n8n reprocessing webhook
    // This would require sending a webhook to n8n to reprocess the upload
    // For now, we just reset the status and the user can re-upload if needed

    return NextResponse.json({
      success: true,
      message: "Upload wird erneut verarbeitet",
      upload: updatedUpload,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/uploads/[id]/retry" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Retry" },
      { status: 500 }
    );
  }
}

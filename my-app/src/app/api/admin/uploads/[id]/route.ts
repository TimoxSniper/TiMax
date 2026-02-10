import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";

async function deleteUploadHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: upload, error: fetchError } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Upload nicht gefunden" },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    const { error: deleteError } = await supabase.from("uploads").delete().eq("id", id);

    if (deleteError) throw deleteError;

    logger.info(`[Admin Uploads API] Upload ${id} (${upload.file_name}) deleted`);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[Admin Uploads API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Uploads" },
      { status: 500 }
    );
  }
}

export const DELETE = withCsrfProtection(deleteUploadHandler);

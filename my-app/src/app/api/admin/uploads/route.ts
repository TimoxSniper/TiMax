import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import type { UploadStatus } from "@/lib/supabase/database.types";

const VALID_UPLOAD_STATUSES: UploadStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
];

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") || "";
    const userId = searchParams.get("userId") || "";
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    let countQuery = supabase.from("uploads").select("*", { count: "exact", head: true });
    let dataQuery = supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      countQuery = countQuery.eq("user_id", userId);
      dataQuery = dataQuery.eq("user_id", userId);
    }

    if (statusParam && VALID_UPLOAD_STATUSES.includes(statusParam as UploadStatus)) {
      countQuery = countQuery.eq("status", statusParam as UploadStatus);
      dataQuery = dataQuery.eq("status", statusParam as UploadStatus);
    }

    const { count: totalCount, error: countError } = await countQuery;
    if (countError) throw countError;

    const { data: uploads, error } = await dataQuery;
    if (error) throw error;

    let filteredUploads = uploads || [];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredUploads = filteredUploads.filter(
        (upload: any) =>
          upload.file_name?.toLowerCase().includes(lowerSearch) ||
          upload.user_id?.toLowerCase().includes(lowerSearch) ||
          upload.file_type?.toLowerCase().includes(lowerSearch)
      );
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      uploads: filteredUploads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("[Admin Uploads API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Uploads" },
      { status: 500 }
    );
  }
}

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

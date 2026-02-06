import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type { UploadStatus } from "@/lib/supabase/database.types";

const VALID_UPLOAD_STATUSES: UploadStatus[] = ["pending", "processing", "completed", "failed", "cancelled"];

// GET: Alle Uploads des Users laden
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;

    // Optional: Filter nach Status
    const statusParam = searchParams.get("status");
    const status = statusParam && VALID_UPLOAD_STATUSES.includes(statusParam as UploadStatus)
      ? (statusParam as UploadStatus)
      : null;

    // Build base query for count
    let countQuery = supabase
      .from("uploads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (status) {
      countQuery = countQuery.eq("status", status);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      logger.error("[Uploads API] Fehler beim Zählen:", countError);
      throw countError;
    }

    // Build query for data
    let query = supabase
      .from("uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: uploads, error } = await query;

    if (error) {
      logger.error("[Uploads API] Fehler beim Laden:", error);
      throw error;
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      uploads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/uploads" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Uploads" },
      { status: 500 }
    );
  }
}

// POST: Neuen Upload-Eintrag erstellen (für Metadaten-Updates)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileName, fileSize, fileType } = body;

    const supabase = await createClient();

    const { data: upload, error } = await supabase
      .from("uploads")
      .insert({
        user_id: userId,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        status: "processing",
      })
      .select("*")
      .single();

    if (error) {
      logger.error("[Uploads API] Fehler beim Erstellen:", error);
      throw error;
    }

    return NextResponse.json({ success: true, upload });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/uploads" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Uploads" },
      { status: 500 }
    );
  }
}
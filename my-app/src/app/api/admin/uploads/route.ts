import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

// GET: Alle Uploads laden (für Admin)
export async function GET(request: NextRequest) {
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

    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Optional: Filter
    const filterUserId = searchParams.get("userId");
    const filterStatus = searchParams.get("status");

    // Gesamtanzahl für Pagination
    let countQuery = supabase
      .from("uploads")
      .select("*", { count: "exact", head: true });

    if (filterUserId) {
      countQuery = countQuery.eq("user_id", filterUserId);
    }
    if (filterStatus) {
      countQuery = countQuery.eq("status", filterStatus);
    }

    const { count: total } = await countQuery;

    // Uploads laden
    let query = supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (filterUserId) {
      query = query.eq("user_id", filterUserId);
    }
    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }

    const { data: uploads, error } = await query;

    if (error) {
      logger.error("[Admin Uploads API] Fehler beim Laden:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      uploads: uploads || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (error) {
    logger.error("[Admin Uploads API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/uploads" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Uploads" },
      { status: 500 }
    );
  }
}

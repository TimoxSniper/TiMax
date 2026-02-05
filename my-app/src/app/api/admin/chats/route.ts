import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

// GET: Alle Chats laden (für Admin)
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

    // Optional: Filter nach User
    const filterUserId = searchParams.get("userId");

    // Gesamtanzahl für Pagination
    let countQuery = supabase
      .from("chats")
      .select("*", { count: "exact", head: true });

    if (filterUserId) {
      countQuery = countQuery.eq("user_id", filterUserId);
    }

    const { count: total } = await countQuery;

    // Chats laden
    let query = supabase
      .from("chats")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (filterUserId) {
      query = query.eq("user_id", filterUserId);
    }

    const { data: chats, error } = await query;

    if (error) {
      logger.error("[Admin Chats API] Fehler beim Laden:", error);
      throw error;
    }

    // Message-Counts für jeden Chat laden
    const chatsWithMessageCount = await Promise.all(
      (chats || []).map(async (chat) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("chat_id", chat.id);

        return {
          ...chat,
          messageCount: count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      chats: chatsWithMessageCount,
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (error) {
    logger.error("[Admin Chats API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/chats" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Chats" },
      { status: 500 }
    );
  }
}

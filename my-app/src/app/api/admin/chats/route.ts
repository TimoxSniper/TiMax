import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";
import { parsePaginationParams, buildPaginationResponse } from "@/lib/pagination";

// Cache-Control Header for fast loading
const CACHE_CONTROL = "public, s-maxage=15, stale-while-revalidate=60";

// GET: Alle Chats laden (für Admin)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
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

    // Pagination with validation
    const { page, limit, offset } = parsePaginationParams(searchParams);

    // Optional: Filter nach User
    const filterUserId = searchParams.get("userId");

    // Optional: Zeit-Filter
    const timeFilter = searchParams.get("timeFilter"); // 'today', 'week', 'month'

    let startDate: Date | null = null;
    if (timeFilter) {
      if (timeFilter === "today") {
        const now = new Date();
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (timeFilter === "week") {
        const now = new Date();
        now.setDate(now.getDate() - 7);
        startDate = now;
      } else if (timeFilter === "month") {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        startDate = now;
      }
    }

    // Parallelize count and data fetching
    const [countResult, queryResult] = await Promise.all([
      (async () => {
        let countQuery = supabase.from("chats").select("*", { count: "exact", head: true });
        if (filterUserId) countQuery = countQuery.eq("user_id", filterUserId);
        if (startDate) countQuery = countQuery.gte("created_at", startDate.toISOString());
        return countQuery;
      })(),
      (async () => {
        let query = supabase
          .from("chats")
          .select(
            `
            id,
            user_id,
            title,
            created_at,
            updated_at,
            messages:messages(count)
          `
          )
          .order("updated_at", { ascending: false })
          .range(offset, offset + limit - 1);
        if (filterUserId) query = query.eq("user_id", filterUserId);
        if (startDate) query = query.gte("created_at", startDate.toISOString());
        return query;
      })(),
    ]);

    const { count: total } = countResult;
    const { data: chats, error } = queryResult;

    if (error) {
      logger.error("[Admin Chats API] Fehler beim Laden:", error);
      throw error;
    }

    // Transform data with message count
    const chatsWithMessageCount = (chats || []).map((chat) => ({
      id: chat.id,
      user_id: chat.user_id,
      title: chat.title,
      created_at: chat.created_at,
      updated_at: chat.updated_at,
      messageCount: chat.messages[0]?.count || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        chats: chatsWithMessageCount,
        pagination: buildPaginationResponse(page, limit, total || 0),
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL,
        },
      }
    );
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

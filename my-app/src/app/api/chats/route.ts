import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";

// GET Handler
async function getChatsHandler(
  request: NextRequest,
  _context?: { params: Promise<Record<string, never>> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from("chats")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      logger.error("[Chats API] Fehler beim Zählen:", countError);
      throw countError;
    }

    // Get paginated chats
    const { data: chats, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error("[Chats API] Fehler beim Laden:", error);
      throw error;
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      chats,
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
      tags: { api_route: "/api/chats" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Chats" },
      { status: 500 }
    );
  }
}

// POST Handler (mit CSRF-Schutz - kritische Operation)
async function postChatsHandler(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    const body = await request.json();
    const { title = "Neuer Chat", sessionId } = body;

    const supabase = createAdminClient();

    const { data: chat, error } = await supabase
      .from("chats")
      .insert({
        user_id: userId,
        session_id: sessionId || crypto.randomUUID(),
        title,
      })
      .select("*")
      .single();

    if (error) {
      logger.error("[Chats API] Fehler beim Erstellen:", error);
      throw error;
    }

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chats" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Chats" },
      { status: 500 }
    );
  }
}

// Export Handler mit CSRF-Schutz
export const GET = withCsrfProtection(getChatsHandler);
export const POST = withCsrfProtection(postChatsHandler);

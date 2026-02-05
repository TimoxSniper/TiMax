import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Einzelnen Chat mit Messages laden
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

    const { id: chatId } = await params;
    const supabase = createAdminClient();

    // Chat laden
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { success: false, error: "Chat nicht gefunden" },
        { status: 404 }
      );
    }

    // Messages laden
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      logger.error("[Admin Chat API] Fehler beim Laden der Messages:", messagesError);
      throw messagesError;
    }

    return NextResponse.json({
      success: true,
      chat,
      messages: messages || [],
    });
  } catch (error) {
    logger.error("[Admin Chat API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/chats/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Chats" },
      { status: 500 }
    );
  }
}

// DELETE: Chat löschen (kaskadiert zu Messages)
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

    const { id: chatId } = await params;
    const supabase = createAdminClient();

    // Chat löschen (Messages werden durch CASCADE automatisch gelöscht)
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId);

    if (error) {
      logger.error("[Admin Chat API] Fehler beim Löschen:", error);
      throw error;
    }

    logger.info(`[Admin] Chat ${chatId} gelöscht von Admin ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Chat erfolgreich gelöscht",
    });
  } catch (error) {
    logger.error("[Admin Chat API] Fehler beim Löschen:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/chats/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Chats" },
      { status: 500 }
    );
  }
}

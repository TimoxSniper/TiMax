import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { validateCsrfToken } from "@/lib/csrf";

// GET Handler (idempotent - CSRF optional)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = createAdminClient();

    // Chat mit allen Nachrichten laden
    const { data: chat, error } = await supabase
      .from("chats")
      .select(`
        *,
        messages(*)
      `)
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      logger.error("[Chat API] Fehler beim Laden:", error);
      return NextResponse.json(
        { success: false, error: "Chat nicht gefunden" },
        { status: 404 }
      );
    }

    // Nachrichten nach Zeit sortieren
    if (chat?.messages) {
      chat.messages.sort((a: { created_at: string }, b: { created_at: string }) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chats/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Chats" },
      { status: 500 }
    );
  }
}

// DELETE: Chat löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfError = await validateCsrfToken(request);
    if (csrfError) return csrfError;

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = createAdminClient();

    // Lösche Chat (cascade löscht auch Nachrichten)
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      logger.error("[Chat API] Fehler beim Löschen:", error);
      throw error;
    }

    return NextResponse.json({ success: true, message: "Chat gelöscht" });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chats/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Chats" },
      { status: 500 }
    );
  }
}

// PATCH: Chat aktualisieren (z.B. Titel ändern)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const csrfError = await validateCsrfToken(request);
    if (csrfError) return csrfError;

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title } = body;

    const supabase = createAdminClient();

    const { data: chat, error } = await supabase
      .from("chats")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      logger.error("[Chat API] Fehler beim Aktualisieren:", error);
      throw error;
    }

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chats/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Chats" },
      { status: 500 }
    );
  }
}
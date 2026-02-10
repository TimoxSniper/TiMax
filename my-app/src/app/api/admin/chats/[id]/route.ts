import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { withCsrfProtectionWithParams } from "@/lib/csrf";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", id)
      .single();

    if (chatError) {
      if (chatError.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Chat nicht gefunden" }, { status: 404 });
      }
      throw chatError;
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerk = await clerkClient();

    const user = await clerk.users.getUser(chat.user_id).catch(() => null);

    return NextResponse.json({
      success: true,
      chat: {
        ...chat,
        user: user
          ? {
              userId: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.emailAddresses[0]?.emailAddress,
              imageUrl: user.imageUrl,
            }
          : null,
      },
      messages: messages || [],
    });
  } catch (error) {
    logger.error("[Admin Chat Detail API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Chats" },
      { status: 500 }
    );
  }
}

async function deleteChatHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = createAdminClient();

    const { error: messagesError } = await supabase.from("messages").delete().eq("chat_id", id);

    if (messagesError) throw messagesError;

    const { error: chatError } = await supabase.from("chats").delete().eq("id", id);

    if (chatError) throw chatError;

    logger.info(`[Admin Chats API] Chat ${id} deleted`);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[Admin Chats API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Chats" },
      { status: 500 }
    );
  }
}

export const DELETE = withCsrfProtectionWithParams(deleteChatHandler);

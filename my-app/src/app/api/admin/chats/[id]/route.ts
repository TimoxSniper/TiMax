/**
 * Admin Chat Detail API Route
 *
 * GET - Get chat with all messages
 * DELETE - Soft delete chat
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient, logAdminAction } from "@/lib/admin/auth";
import { getClerkUser } from "@/lib/admin/clerk-helpers";
import type { ChatWithDetails } from "@/types/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id: chatId } = await params;
    const supabase = getAdminSupabaseClient();

    // Fetch chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .is("deleted_at", null)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 }
      );
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    // Fetch user info
    const user = await getClerkUser(chat.user_id);

    const chatWithDetails: ChatWithDetails = {
      ...chat,
      user: user!,
      messageCount: messages?.length || 0,
      lastMessageAt: messages?.[messages.length - 1]?.created_at || null,
      messages: messages || [],
    };

    return NextResponse.json({
      success: true,
      data: chatWithDetails,
    });
  } catch (error) {
    console.error("Chat detail API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch chat details",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id: chatId } = await params;
    const body = await request.json();
    const { reason } = body;

    const supabase = getAdminSupabaseClient();

    // Check if chat exists
    const { data: chat, error: fetchError } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chatId)
      .is("deleted_at", null)
      .single();

    if (fetchError || !chat) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("chats")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: authResult.userId!,
      })
      .eq("id", chatId);

    if (deleteError) throw deleteError;

    // Log action
    await logAdminAction(
      authResult.userId!,
      authResult.user!.email ?? "Unknown",
      {
        actionType: "delete_chat",
        targetType: "chat",
        targetId: chatId,
        details: { reason: reason || "Deleted by admin", userId: chat.user_id },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to delete chat",
      },
      { status: 500 }
    );
  }
}

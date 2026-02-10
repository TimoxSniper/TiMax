/**
 * Admin Chats API Route
 *
 * GET - List all chats with pagination and filters
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient } from "@/lib/admin/auth";
import { getClerkUsers } from "@/lib/admin/clerk-helpers";
import type { EnrichedChat, PaginatedResponse } from "@/types/admin";

export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const filter = searchParams.get("filter") || "all"; // all, recent
    const search = searchParams.get("search") || "";

    const supabase = getAdminSupabaseClient();

    // Build query
    let query = supabase
      .from("chats")
      .select("*, messages(count)", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filter === "recent") {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      query = query.gte("created_at", oneDayAgo.toISOString());
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: chats, error, count } = await query;

    if (error) throw error;

    if (!chats || chats.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        } as PaginatedResponse<EnrichedChat>,
      });
    }

    // Get unique user IDs
    const userIds = [...new Set(chats.map((chat) => chat.user_id))];

    // Batch fetch Clerk users
    const clerkUsers = await getClerkUsers(userIds);

    // Get message counts and last message time
    const chatIds = chats.map((c) => c.id);
    const { data: messages } = await supabase
      .from("messages")
      .select("chat_id, created_at")
      .in("chat_id", chatIds);

    // Count messages per chat and get last message time
    const messageCounts = new Map<string, number>();
    const lastMessageTimes = new Map<string, string>();

    messages?.forEach((msg) => {
      messageCounts.set(msg.chat_id, (messageCounts.get(msg.chat_id) || 0) + 1);
      const existing = lastMessageTimes.get(msg.chat_id);
      if (!existing || msg.created_at > existing) {
        lastMessageTimes.set(msg.chat_id, msg.created_at);
      }
    });

    // Enrich chats with user data
    const enrichedChats: EnrichedChat[] = chats.map((chat) => ({
      ...chat,
      user: clerkUsers.get(chat.user_id)!,
      messageCount: messageCounts.get(chat.id) || 0,
      lastMessageAt: lastMessageTimes.get(chat.id) || null,
    }));

    // Apply search filter (on enriched data)
    let filteredChats = enrichedChats;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredChats = enrichedChats.filter(
        (chat) =>
          chat.title?.toLowerCase().includes(searchLower) ||
          chat.user.fullName.toLowerCase().includes(searchLower) ||
          chat.user.email?.toLowerCase().includes(searchLower)
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    const response: PaginatedResponse<EnrichedChat> = {
      data: filteredChats,
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Chats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch chats",
      },
      { status: 500 }
    );
  }
}

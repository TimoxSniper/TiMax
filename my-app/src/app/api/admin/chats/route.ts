import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";
    const timeFilter = searchParams.get("timeFilter") || "";
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    let countQuery = supabase.from("chats").select("*", { count: "exact", head: true });
    let dataQuery = supabase
      .from("chats")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      countQuery = countQuery.eq("user_id", userId);
      dataQuery = dataQuery.eq("user_id", userId);
    }

    if (timeFilter) {
      const now = new Date();
      let startDate: Date;

      switch (timeFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      countQuery = countQuery.gte("created_at", startDate.toISOString());
      dataQuery = dataQuery.gte("created_at", startDate.toISOString());
    }

    const { count: totalCount, error: countError } = await countQuery;
    if (countError) throw countError;

    const { data: chats, error } = await dataQuery;
    if (error) throw error;

    let filteredChats = chats || [];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredChats = filteredChats.filter(
        (chat) =>
          chat.title?.toLowerCase().includes(lowerSearch) ||
          chat.user_id?.toLowerCase().includes(lowerSearch)
      );
    }

    const chatIds = filteredChats.map((c) => c.id);

    // Only fetch message counts if there are chats
    if (chatIds.length > 0) {
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("chat_id")
        .in("chat_id", chatIds);

      if (messagesError) {
        logger.warn("[Admin Chats API] Error fetching message counts:", messagesError);
        // Continue without message counts rather than throwing an error
      } else if (messagesData) {
        const messageCounts = messagesData.reduce((acc: Record<string, number>, m) => {
          acc[m.chat_id] = (acc[m.chat_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        filteredChats = filteredChats.map((chat) => ({
          ...chat,
          messageCount: messageCounts[chat.id] || 0,
        }));
      }
    } else {
      // No chats, set empty message counts
      filteredChats = filteredChats.map((chat) => ({
        ...chat,
        messageCount: 0,
      }));
    }

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      chats: filteredChats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("[Admin Chats API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Chats" },
      { status: 500 }
    );
  }
}

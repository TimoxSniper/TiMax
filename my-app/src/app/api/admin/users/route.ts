/**
 * Admin Users API Route
 *
 * GET - List all users with pagination and filters
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient } from "@/lib/admin/auth";
import { getAllClerkUsers } from "@/lib/admin/clerk-helpers";
import type { UserWithStats, PaginatedResponse } from "@/types/admin";

export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const filter = searchParams.get("filter") || "all"; // all, active, banned
    const search = searchParams.get("search") || "";

    // Get all Clerk users with pagination
    const { users: clerkUsers, totalCount } = await getAllClerkUsers({
      limit,
      offset: (page - 1) * limit,
      query: search || undefined,
    });

    const supabase = getAdminSupabaseClient();
    const userIds = clerkUsers.map((u) => u.id);

    if (userIds.length === 0) {
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
        } as PaginatedResponse<UserWithStats>,
      });
    }

    // Fetch Supabase data for users
    const [chatsResult, uploadsResult, bansResult] = await Promise.all([
      supabase
        .from("chats")
        .select("user_id")
        .in("user_id", userIds)
        .is("deleted_at", null),
      supabase
        .from("uploads")
        .select("user_id")
        .in("user_id", userIds)
        .is("deleted_at", null),
      supabase.from("user_bans").select("*").in("user_id", userIds),
    ]);

    const chats = chatsResult.data || [];
    const uploads = uploadsResult.data || [];
    const bans = bansResult.data || [];

    // Count chats and uploads per user
    const chatCounts = new Map<string, number>();
    const uploadCounts = new Map<string, number>();
    const banMap = new Map<string, typeof bans[0]>();

    chats.forEach((chat) => {
      chatCounts.set(chat.user_id, (chatCounts.get(chat.user_id) || 0) + 1);
    });

    uploads.forEach((upload) => {
      uploadCounts.set(upload.user_id, (uploadCounts.get(upload.user_id) || 0) + 1);
    });

    bans.forEach((ban) => {
      banMap.set(ban.user_id, ban);
    });

    // Merge data
    let usersWithStats: UserWithStats[] = clerkUsers.map((user) => {
      const ban = banMap.get(user.id);
      const isBanned = ban !== undefined &&
        (ban.ban_type === "permanent" ||
          (ban.expires_at && new Date(ban.expires_at) > new Date()));

      return {
        ...user,
        totalUploads: uploadCounts.get(user.id) || 0,
        totalChats: chatCounts.get(user.id) || 0,
        lastActive: user.lastSignInAt,
        isBanned,
        banInfo: ban,
      };
    });

    // Apply filters
    if (filter === "banned") {
      usersWithStats = usersWithStats.filter((u) => u.isBanned);
    } else if (filter === "active") {
      // Active in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      usersWithStats = usersWithStats.filter(
        (u) => u.lastActive && u.lastActive > sevenDaysAgo
      );
    }

    const totalPages = Math.ceil(totalCount / limit);

    const response: PaginatedResponse<UserWithStats> = {
      data: usersWithStats,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

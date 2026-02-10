/**
 * Admin Dashboard API Route
 *
 * Aggregates statistics and recent activity for dashboard overview
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient } from "@/lib/admin/auth";
import { getClerkUsers } from "@/lib/admin/clerk-helpers";
import type { DashboardStats, RecentActivity, SystemHealth } from "@/types/admin";

export async function GET(request: NextRequest) {
  // Check admin authorization
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const supabase = getAdminSupabaseClient();

    // Fetch all stats in parallel
    const [
      { count: totalChats },
      { count: totalMessages },
      { data: uploads },
      { data: recentChatsData },
      { data: recentUploadsData },
    ] = await Promise.all([
      supabase.from("chats").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("uploads").select("status, created_at, user_id").is("deleted_at", null),
      supabase
        .from("chats")
        .select("created_at, user_id")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("uploads")
        .select("created_at, user_id, status")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Calculate upload stats by status
    const uploadsByStatus = {
      pending: uploads?.filter((u) => u.status === "pending").length ?? 0,
      processing: uploads?.filter((u) => u.status === "processing").length ?? 0,
      completed: uploads?.filter((u) => u.status === "completed").length ?? 0,
      failed: uploads?.filter((u) => u.status === "failed").length ?? 0,
      cancelled: uploads?.filter((u) => u.status === "cancelled").length ?? 0,
    };

    // Calculate active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUserIds = new Set<string>();

    // Add users from recent chats
    recentChatsData?.forEach((chat) => {
      if (new Date(chat.created_at) > sevenDaysAgo) {
        activeUserIds.add(chat.user_id);
      }
    });

    // Add users from recent uploads
    recentUploadsData?.forEach((upload) => {
      if (new Date(upload.created_at) > sevenDaysAgo) {
        activeUserIds.add(upload.user_id);
      }
    });

    const activeUsers = activeUserIds.size;

    // Build recent activity
    const recentActivity: RecentActivity[] = [];

    // Add chat activities
    if (recentChatsData) {
      const chatUserIds = [...new Set(recentChatsData.map((c) => c.user_id))];
      const chatUsers = await getClerkUsers(chatUserIds);

      recentChatsData.slice(0, 5).forEach((chat) => {
        const user = chatUsers.get(chat.user_id);
        recentActivity.push({
          id: `chat-${chat.created_at}`,
          type: "chat_created",
          description: `New chat created by ${user?.fullName ?? "User"}`,
          userId: chat.user_id,
          user,
          timestamp: chat.created_at,
        });
      });
    }

    // Add upload activities
    if (recentUploadsData) {
      const uploadUserIds = [...new Set(recentUploadsData.map((u) => u.user_id))];
      const uploadUsers = await getClerkUsers(uploadUserIds);

      recentUploadsData.slice(0, 5).forEach((upload) => {
        const user = uploadUsers.get(upload.user_id);
        recentActivity.push({
          id: `upload-${upload.created_at}`,
          type: "upload_completed",
          description: `Upload ${upload.status} by ${user?.fullName ?? "User"}`,
          userId: upload.user_id,
          user,
          timestamp: upload.created_at,
          metadata: { status: upload.status },
        });
      });
    }

    // Sort by timestamp (most recent first)
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // System health (basic check)
    const startTime = Date.now();
    const { error: dbError } = await supabase.from("chats").select("id").limit(1);
    const apiResponseTime = Date.now() - startTime;

    const systemHealth: SystemHealth = {
      status: dbError ? "down" : apiResponseTime > 1000 ? "degraded" : "healthy",
      databaseConnected: !dbError,
      storageConnected: true, // Assume storage is working if DB is
      apiResponseTime,
      activeUsers,
      uptime: 0, // Would need to track this separately
    };

    // Build response
    const stats: DashboardStats = {
      totalUsers: 0, // Will be fetched from Clerk separately
      activeUsers,
      totalChats: totalChats ?? 0,
      totalMessages: totalMessages ?? 0,
      totalUploads: uploads?.length ?? 0,
      uploadsByStatus,
      recentActivity: recentActivity.slice(0, 10),
      systemHealth,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}

/**
 * Admin System Health API Route
 *
 * GET - Get system health metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient } from "@/lib/admin/auth";
import type { SystemHealth } from "@/types/admin";

export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const supabase = getAdminSupabaseClient();

    // Test database connection with timing
    const dbStartTime = Date.now();
    const { error: dbError } = await supabase.from("chats").select("id").limit(1);
    const dbResponseTime = Date.now() - dbStartTime;

    // Test storage connection
    let storageConnected = true;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      storageConnected = !!buckets;
    } catch {
      storageConnected = false;
    }

    // Count active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: recentChats } = await supabase
      .from("chats")
      .select("user_id")
      .gte("created_at", sevenDaysAgo.toISOString())
      .is("deleted_at", null);

    const activeUsers = new Set(recentChats?.map((c) => c.user_id) || []).size;

    // Calculate status
    let status: "healthy" | "degraded" | "down" = "healthy";
    if (!dbError && storageConnected) {
      if (dbResponseTime > 1000) {
        status = "degraded";
      }
    } else {
      status = "down";
    }

    // Mock uptime (would need to track this in production)
    const uptime = process.uptime();

    const health: SystemHealth = {
      status,
      databaseConnected: !dbError,
      storageConnected,
      apiResponseTime: dbResponseTime,
      activeUsers,
      uptime: Math.floor(uptime),
    };

    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error("System health API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch system health",
      },
      { status: 500 }
    );
  }
}

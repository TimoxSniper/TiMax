/**
 * Unban User API Route
 *
 * POST - Remove a user ban
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient, logAdminAction } from "@/lib/admin/auth";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { reason } = body;

    const supabase = getAdminSupabaseClient();

    // Check if user is banned
    const { data: ban } = await supabase
      .from("user_bans")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!ban) {
      return NextResponse.json(
        { success: false, error: "User is not banned" },
        { status: 400 }
      );
    }

    // Remove ban record
    const { error: deleteError } = await supabase
      .from("user_bans")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      throw deleteError;
    }

    // Update Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        banned: false,
        banReason: undefined,
        banExpiresAt: undefined,
      },
    });

    // Log action
    await logAdminAction(
      authResult.userId!,
      authResult.user!.email ?? "Unknown",
      {
        actionType: "unban_user",
        targetType: "user",
        targetId: userId,
        details: { reason: reason || "Ban removed" },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "User unbanned successfully",
    });
  } catch (error) {
    console.error("Unban user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to unban user",
      },
      { status: 500 }
    );
  }
}

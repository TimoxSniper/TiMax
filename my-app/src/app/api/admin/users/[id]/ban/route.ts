/**
 * Ban User API Route
 *
 * POST - Ban a user (temporary or permanent)
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient, logAdminAction } from "@/lib/admin/auth";
import { clerkClient } from "@clerk/nextjs/server";
import type { BanUserPayload } from "@/types/admin";

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
    const body: BanUserPayload = await request.json();

    const { reason, banType, expiresAt, metadata } = body;

    // Validate input
    if (!reason || reason.length < 10) {
      return NextResponse.json(
        { success: false, error: "Reason must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (banType === "temporary" && !expiresAt) {
      return NextResponse.json(
        { success: false, error: "Expiry date required for temporary bans" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    // Check if already banned
    const { data: existingBan } = await supabase
      .from("user_bans")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingBan) {
      return NextResponse.json(
        { success: false, error: "User is already banned" },
        { status: 400 }
      );
    }

    // Insert ban record
    const { error: banError } = await supabase.from("user_bans").insert({
      user_id: userId,
      banned_by: authResult.userId!,
      reason,
      ban_type: banType,
      expires_at: expiresAt || null,
      metadata: metadata || null,
    });

    if (banError) {
      throw banError;
    }

    // Update Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        banned: true,
        banReason: reason,
        banExpiresAt: expiresAt || undefined,
      },
    });

    // Revoke all sessions (force logout)
    try {
      await clerk.sessions.revokeSession(userId);
    } catch {
      // Sessions may not exist, ignore error
    }

    // Log action
    await logAdminAction(
      authResult.userId!,
      authResult.user!.email ?? "Unknown",
      {
        actionType: "ban_user",
        targetType: "user",
        targetId: userId,
        details: { reason, banType, expiresAt },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "User banned successfully",
    });
  } catch (error) {
    console.error("Ban user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to ban user",
      },
      { status: 500 }
    );
  }
}

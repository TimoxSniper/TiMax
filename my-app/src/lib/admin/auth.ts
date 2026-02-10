/**
 * Admin Authentication & Authorization Helpers
 *
 * Core functions for verifying admin access and logging admin actions
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { AdminAuthResult, AdminAction } from "@/types/admin";

/**
 * Create Supabase client with service role key (for admin operations)
 * SECURITY: Only use server-side, never expose to client
 */
function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase credentials for admin client");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

/**
 * Check if the current user is an admin
 * Returns authorization result with user info or error response
 */
export async function checkAdminAuth(): Promise<AdminAuthResult> {
  try {
    // Get authenticated user ID from Clerk
    const { userId } = await auth();

    if (!userId) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: "Unauthorized", message: "Not authenticated" },
          { status: 401 }
        ),
      };
    }

    // Fetch user from Clerk to check metadata
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Check if user has admin role in public metadata
    const isAdmin = user.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: "Forbidden", message: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    // Return user info for further use
    return {
      authorized: true,
      userId,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.id,
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
        publicMetadata: user.publicMetadata as {
          role?: string;
          banned?: boolean;
          banReason?: string;
          banExpiresAt?: string;
        },
      },
    };
  } catch (error) {
    console.error("Admin auth check error:", error);
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Internal error", message: "Failed to verify admin access" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Require admin access - throws error if not authorized
 * Use this for server components that need admin access
 */
export async function requireAdmin() {
  const authResult = await checkAdminAuth();

  if (!authResult.authorized) {
    throw new Error("Admin access required");
  }

  return authResult;
}

/**
 * Log an admin action to the audit trail
 * All destructive and sensitive actions should be logged
 */
export async function logAdminAction(
  adminUserId: string,
  adminEmail: string,
  action: AdminAction,
  request?: Request
): Promise<void> {
  try {
    const supabase = getAdminSupabaseClient();

    // Extract IP and user agent from request if available
    const ipAddress = request?.headers.get("x-real-ip") || request?.headers.get("x-forwarded-for") || null;
    const userAgent = request?.headers.get("user-agent") || null;

    await supabase.from("admin_logs").insert({
      admin_user_id: adminUserId,
      admin_email: adminEmail,
      action_type: action.actionType,
      target_type: action.targetType,
      target_id: action.targetId,
      details: action.details as never, // Type assertion for JSONB
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    // Don't throw - logging failure shouldn't break the operation
    console.error("Failed to log admin action:", error);
  }
}

/**
 * Check if a user is banned
 * Returns ban info if user is currently banned
 */
export async function checkUserBan(userId: string) {
  try {
    const supabase = getAdminSupabaseClient();

    const { data: ban } = await supabase
      .from("user_bans")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!ban) {
      return { isBanned: false };
    }

    // Check if temporary ban has expired
    if (ban.ban_type === "temporary" && ban.expires_at) {
      const expiryDate = new Date(ban.expires_at);
      if (expiryDate < new Date()) {
        // Ban has expired - remove it
        await supabase.from("user_bans").delete().eq("user_id", userId);
        return { isBanned: false };
      }
    }

    return {
      isBanned: true,
      ban,
    };
  } catch (error) {
    console.error("Failed to check user ban:", error);
    return { isBanned: false };
  }
}

/**
 * Get admin Supabase client (for use in admin API routes)
 * SECURITY: Only use in admin-protected API routes
 */
export { getAdminSupabaseClient };

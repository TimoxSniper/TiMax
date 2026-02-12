import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "25")));
    const search = searchParams.get("search") || "";

    const clerk = await clerkClient();

    // Get ALL users from Clerk with pagination
    const offset = (page - 1) * limit;

    const clerkResult = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
      ...(search && { query: search }),
    });

    const clerkUsers = clerkResult.data;
    const totalCount = clerkResult.totalCount;

    // Get chat counts for all users from Supabase
    const supabase = createAdminClient();
    const userIds = clerkUsers.map((u) => u.id);

    let chatCounts: Record<string, number> = {};

    if (userIds.length > 0) {
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("user_id")
        .in("user_id", userIds);

      if (chatsError) {
        logger.warn("[Admin Users API] Error fetching chat counts:", chatsError);
        // Continue without chat counts
      } else {
        chatCounts = (chatsData || []).reduce((acc: Record<string, number>, chat) => {
          acc[chat.user_id] = (acc[chat.user_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    // Map Clerk users to our format
    const users = clerkUsers.map((user) => ({
      userId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl || "",
      createdAt: new Date(user.createdAt).toISOString(),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
      role: (user.publicMetadata?.role as string) || "user",
      chatCount: chatCounts[user.id] || 0,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("[Admin Users API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Benutzer" },
      { status: 500 }
    );
  }
}

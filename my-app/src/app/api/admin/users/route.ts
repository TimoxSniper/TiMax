import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "25")));
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    let baseQuery = supabase.from("chats").select("user_id", { count: "exact", head: true });
    let dataQuery = supabase.from("chats").select("user_id");

    if (search) {
      const clerk = (await import("@clerk/nextjs/server")).clerkClient();
      const clerkClient = await clerk();
      const { data: clerkUsers } = await clerkClient.users.getUserList({
        query: search,
        limit: 100,
      });

      const userIds = clerkUsers.map((u) => u.id);
      if (userIds.length === 0) {
        return NextResponse.json({
          success: true,
          users: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }

      baseQuery = baseQuery.in("user_id", userIds);
      dataQuery = dataQuery.in("user_id", userIds);
    }

    const { count: totalCount, error: countError } = await baseQuery;
    if (countError) throw countError;

    const { data: userChats, error: chatsError } = await dataQuery;
    if (chatsError) throw chatsError;

    const uniqueUserIds = [...new Set(userChats?.map((c: any) => c.user_id) || [])];

    const clerk = (await import("@clerk/nextjs/server")).clerkClient();
    const clerkClient = await clerk();

    const clerkUsers = await Promise.all(
      uniqueUserIds.map((userId) => clerkClient.users.getUser(userId).catch(() => null))
    );

    const chatCounts = userChats?.reduce((acc: Record<string, number>, c: any) => {
      acc[c.user_id] = (acc[c.user_id] || 0) + 1;
      return acc;
    }, {});

    const users = clerkUsers
      .filter((u) => u !== null)
      .map((user: any) => ({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        role: user.publicMetadata?.role || "user",
        chatCount: chatCounts[user.id] || 0,
      }));

    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
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

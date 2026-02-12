import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createAdminClient();

    // Fetch recent uploads (last 10)
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("id, file_name, status, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    if (uploadsError) throw uploadsError;

    // Fetch recent chats (last 10)
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("id, title, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10);

    if (chatsError) throw chatsError;

    // Fetch recent users from Clerk (last 10)
    const client = await clerkClient();
    const { data: clerkUsers } = await client.users.getUserList({
      limit: 10,
      orderBy: "-created_at",
    });

    const users = clerkUsers.map((user) => ({
      userId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      createdAt: new Date(user.createdAt).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        uploads: uploads || [],
        chats: chats || [],
        users: users || [],
      },
    });
  } catch (error) {
    logger.error("[Admin Recent Activity API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der neuesten Aktivitäten" },
      { status: 500 }
    );
  }
}

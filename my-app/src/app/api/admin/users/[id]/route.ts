import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Admin-Check
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Keine Admin-Berechtigung" },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await params;
    const supabase = createAdminClient();
    const clerk = await clerkClient();

    // Clerk-Benutzerdaten laden
    let clerkUser;
    try {
      clerkUser = await clerk.users.getUser(targetUserId);
    } catch {
      return NextResponse.json(
        { success: false, error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Chats des Benutzers laden
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", targetUserId)
      .order("updated_at", { ascending: false });

    if (chatsError) {
      logger.error("[Admin User API] Fehler beim Laden der Chats:", chatsError);
    }

    // Uploads des Benutzers laden
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (uploadsError) {
      logger.error("[Admin User API] Fehler beim Laden der Uploads:", uploadsError);
    }

    // Statistiken berechnen
    const totalMessages = await Promise.all(
      (chats || []).map(async (chat) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("chat_id", chat.id);
        return count || 0;
      })
    );

    const messageCount = totalMessages.reduce((sum, count) => sum + count, 0);

    // Letzte Aktivität
    const lastChatActivity = chats?.[0]?.updated_at || null;
    const lastUploadActivity = uploads?.[0]?.created_at || null;

    let lastActivity = null;
    if (lastChatActivity && lastUploadActivity) {
      lastActivity = new Date(lastChatActivity) > new Date(lastUploadActivity)
        ? lastChatActivity
        : lastUploadActivity;
    } else {
      lastActivity = lastChatActivity || lastUploadActivity;
    }

    // Chats mit Message Counts
    const chatsWithMessageCount = await Promise.all(
      (chats || []).map(async (chat, index) => ({
        ...chat,
        messageCount: totalMessages[index],
      }))
    );

    return NextResponse.json({
      success: true,
      user: {
        userId: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        imageUrl: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt,
        lastActivity,
      },
      stats: {
        chatCount: chats?.length || 0,
        uploadCount: uploads?.length || 0,
        messageCount,
      },
      chats: chatsWithMessageCount,
      uploads: uploads || [],
    });
  } catch (error) {
    logger.error("[Admin User API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/users/[id]" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Benutzerdaten" },
      { status: 500 }
    );
  }
}

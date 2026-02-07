import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // Admin-Check (Einmalig für alle Daten)
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Keine Admin-Berechtigung" },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();

    // Alle Daten parallel abrufen
    const [statsData, recentChatsData, recentUploadsData] = await Promise.all([
      fetchStats(supabase),
      fetchRecentChats(supabase),
      fetchRecentUploads(supabase),
    ]);

    return NextResponse.json({
      success: true,
      stats: statsData,
      recentChats: recentChatsData,
      recentUploads: recentUploadsData,
    });
  } catch (error) {
    logger.error("[Admin Dashboard API] Gesamtfehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/dashboard" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Dashboard-Daten" },
      { status: 500 }
    );
  }
}

async function fetchStats(supabase: ReturnType<typeof createAdminClient>) {
  // Optimierte Stats-Abfrage
  const [chatsCount, messagesCount, uploadsCount, statusCounts, totalUsersCount] =
    await Promise.all([
      supabase.from("chats").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("uploads").select("*", { count: "exact", head: true }),
      // Status counts in einem Rutsch (geht leider nicht direkt mit count: head,
      // daher verwenden wir hier die 5 parallelen Queries oder eine gruppierte)
      // Da Supabase keine direkte Group-By Count API hat, bleiben wir bei parallel,
      // aber innerhalb des Promise.all von fetchStats
      Promise.all([
        supabase
          .from("uploads")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed"),
        supabase
          .from("uploads")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("uploads")
          .select("*", { count: "exact", head: true })
          .eq("status", "processing"),
        supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "failed"),
        supabase
          .from("uploads")
          .select("*", { count: "exact", head: true })
          .eq("status", "cancelled"),
      ]),
      (await clerkClient()).users.getCount(),
    ]);

  const [completed, pending, processing, failed, cancelled] = statusCounts;

  return {
    totalUsers: totalUsersCount,
    totalChats: chatsCount.count || 0,
    totalMessages: messagesCount.count || 0,
    totalUploads: uploadsCount.count || 0,
    uploadsByStatus: {
      completed: completed.count || 0,
      pending: pending.count || 0,
      processing: processing.count || 0,
      failed: failed.count || 0,
      cancelled: cancelled.count || 0,
    },
    uploadsByType: {},
  };
}

async function fetchRecentChats(supabase: ReturnType<typeof createAdminClient>) {
  const { data: chats } = await supabase
    .from("chats")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);

  if (!chats || chats.length === 0) return [];

  const chatIds = chats.map((c) => c.id);
  const { data: messageCounts } = await supabase
    .from("messages")
    .select("chat_id")
    .in("chat_id", chatIds);

  const countMap = new Map<string, number>();
  messageCounts?.forEach((m) => {
    countMap.set(m.chat_id, (countMap.get(m.chat_id) || 0) + 1);
  });

  return chats.map((c) => ({
    ...c,
    messageCount: countMap.get(c.id) || 0,
  }));
}

async function fetchRecentUploads(supabase: ReturnType<typeof createAdminClient>) {
  const { data: uploads } = await supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return uploads || [];
}

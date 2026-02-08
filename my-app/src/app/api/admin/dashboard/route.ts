import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";

// Cache-Control Header for fast loading
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

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

    return NextResponse.json(
      {
        success: true,
        stats: statsData,
        recentChats: recentChatsData,
        recentUploads: recentUploadsData,
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL,
        },
      }
    );
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
  // Optimierte Stats-Abfrage mit maximaler Parallelisierung
  const [chatsCount, messagesCount, uploadsCount, statusCounts, totalUsersCount, uploadTypesCount] =
    await Promise.all([
      supabase.from("chats").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("uploads").select("*", { count: "exact", head: true }),
      // Status counts in einem Rutsch (parallel)
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
      // Upload types count (audio/video)
      supabase.from("uploads").select("file_type").not("file_type", "is", null),
    ]);

  const [completed, pending, processing, failed, cancelled] = statusCounts;

  // Calculate upload types statistics
  const uploadsByType: Record<string, number> = {
    audio: 0,
    video: 0,
    other: 0,
  };
  uploadTypesCount.data?.forEach((upload) => {
    if (upload.file_type?.startsWith("audio/")) {
      uploadsByType.audio++;
    } else if (upload.file_type?.startsWith("video/")) {
      uploadsByType.video++;
    } else {
      uploadsByType.other++;
    }
  });

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
    uploadsByType,
  };
}

async function fetchRecentChats(supabase: ReturnType<typeof createAdminClient>) {
  // Optimierte Abfrage mit Join für Message Count (faster than separate query)
  const { data: chats } = await supabase
    .from("chats")
    .select(
      `
      id,
      user_id,
      title,
      created_at,
      updated_at,
      messages:messages(count)
    `
    )
    .order("updated_at", { ascending: false })
    .limit(5);

  if (!chats || chats.length === 0) return [];

  return chats.map((chat) => ({
    id: chat.id,
    user_id: chat.user_id,
    title: chat.title,
    created_at: chat.created_at,
    updated_at: chat.updated_at,
    messageCount: chat.messages[0]?.count || 0,
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

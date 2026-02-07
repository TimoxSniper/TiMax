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

    const supabase = createAdminClient();
    const clerk = await clerkClient();

    // Parallele Abfragen für Performance
    const [
      chatsResult,
      messagesResult,
      uploadsResult,
      clerkUsersResponse,
    ] = await Promise.all([
      // Gesamtzahl Chats
      supabase.from("chats").select("*", { count: "exact", head: true }),
      // Gesamtzahl Messages
      supabase.from("messages").select("*", { count: "exact", head: true }),
      // Gesamtzahl Uploads
      supabase.from("uploads").select("*", { count: "exact", head: true }),
      // Alle Clerk-Benutzer zählen
      clerk.users.getCount(),
    ]);

    // Uploads nach Status gruppieren - optimiert mit separaten Count-Queries
    const [completedUploads, pendingUploads, processingUploads, failedUploads, cancelledUploads] = await Promise.all([
      supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "processing"),
      supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("uploads").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    ]);

    const uploadsByStatus: Record<string, number> = {
      completed: completedUploads.count || 0,
      pending: pendingUploads.count || 0,
      processing: processingUploads.count || 0,
      failed: failedUploads.count || 0,
      cancelled: cancelledUploads.count || 0,
    };

    // Uploads nach Dateityp - nur für die Statistik, nicht für das Dashboard
    const uploadsByType: Record<string, number> = {};

    const stats = {
      totalUsers: clerkUsersResponse,
      totalChats: chatsResult.count || 0,
      totalMessages: messagesResult.count || 0,
      totalUploads: uploadsResult.count || 0,
      uploadsByStatus,
      uploadsByType,
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    logger.error("[Admin Stats API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/stats" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Statistiken" },
      { status: 500 }
    );
  }
}

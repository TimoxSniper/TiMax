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
      uploadsByStatusResult,
      uploadsByTypeResult,
      clerkUsersResponse,
    ] = await Promise.all([
      // Gesamtzahl Chats
      supabase.from("chats").select("*", { count: "exact", head: true }),
      // Gesamtzahl Messages
      supabase.from("messages").select("*", { count: "exact", head: true }),
      // Gesamtzahl Uploads
      supabase.from("uploads").select("*", { count: "exact", head: true }),
      // Uploads nach Status
      supabase.from("uploads").select("status"),
      // Uploads nach Dateityp
      supabase.from("uploads").select("file_type"),
      // Alle Clerk-Benutzer zählen
      clerk.users.getCount(),
    ]);

    // Uploads nach Status gruppieren
    const uploadsByStatus: Record<string, number> = {};
    uploadsByStatusResult.data?.forEach(upload => {
      const status = upload.status || "unknown";
      uploadsByStatus[status] = (uploadsByStatus[status] || 0) + 1;
    });

    // Uploads nach Dateityp gruppieren
    const uploadsByType: Record<string, number> = {};
    uploadsByTypeResult.data?.forEach(upload => {
      const type = upload.file_type || "unknown";
      uploadsByType[type] = (uploadsByType[type] || 0) + 1;
    });

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

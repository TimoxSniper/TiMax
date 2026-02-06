import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/admin";
import { logger } from "@/lib/logger";
import { parsePaginationParams, buildPaginationResponse } from "@/lib/pagination";

interface UserStats {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
  // Clerk user info
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
}

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);

    // Pagination with validation
    const { page, limit, offset } = parsePaginationParams(searchParams, 50);

    const clerk = await clerkClient();

    // Alle Clerk-Benutzer laden
    const clerkUsersResponse = await clerk.users.getUserList({
      limit: 500, // Clerk's default limit
    });

    const allClerkUsers = clerkUsersResponse.data;

    // Alle User-IDs aus Chats und Uploads sammeln
    const [chatsResult, uploadsResult] = await Promise.all([
      supabase.from("chats").select("user_id, updated_at"),
      supabase.from("uploads").select("user_id, updated_at"),
    ]);

    // Map für User-Statistiken erstellen
    const userStatsMap = new Map<string, { chatCount: number; uploadCount: number; lastActivity: string | null }>();

    // Chats verarbeiten
    chatsResult.data?.forEach(chat => {
      const existing = userStatsMap.get(chat.user_id);
      if (existing) {
        existing.chatCount++;
        if (chat.updated_at && (!existing.lastActivity || chat.updated_at > existing.lastActivity)) {
          existing.lastActivity = chat.updated_at;
        }
      } else {
        userStatsMap.set(chat.user_id, {
          chatCount: 1,
          uploadCount: 0,
          lastActivity: chat.updated_at,
        });
      }
    });

    // Uploads verarbeiten
    uploadsResult.data?.forEach(upload => {
      const existing = userStatsMap.get(upload.user_id);
      if (existing) {
        existing.uploadCount++;
        if (upload.updated_at && (!existing.lastActivity || upload.updated_at > existing.lastActivity)) {
          existing.lastActivity = upload.updated_at;
        }
      } else {
        userStatsMap.set(upload.user_id, {
          chatCount: 0,
          uploadCount: 1,
          lastActivity: upload.updated_at,
        });
      }
    });

    // Alle Clerk-Benutzer mit ihren Statistiken kombinieren
    const allUsers: UserStats[] = allClerkUsers.map(clerkUser => {
      const stats = userStatsMap.get(clerkUser.id) || {
        chatCount: 0,
        uploadCount: 0,
        lastActivity: null,
      };

      return {
        userId: clerkUser.id,
        chatCount: stats.chatCount,
        uploadCount: stats.uploadCount,
        lastActivity: stats.lastActivity,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
        imageUrl: clerkUser.imageUrl,
      };
    });

    // Sortieren nach letzter Aktivität
    allUsers.sort((a, b) => {
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

    const total = allUsers.length;
    const usersWithClerkData = allUsers.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      users: usersWithClerkData,
      pagination: buildPaginationResponse(page, limit, total),
    });
  } catch (error) {
    logger.error("[Admin Users API] Fehler:", error);
    Sentry.captureException(error, {
      tags: { api_route: "/api/admin/users" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Benutzer" },
      { status: 500 }
    );
  }
}

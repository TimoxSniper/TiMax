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

    // Alle User-IDs aus Chats und Uploads sammeln
    const [chatsResult, uploadsResult] = await Promise.all([
      supabase.from("chats").select("user_id, updated_at"),
      supabase.from("uploads").select("user_id, updated_at"),
    ]);

    // Map für User-Statistiken
    const userStatsMap = new Map<string, UserStats>();

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
          userId: chat.user_id,
          chatCount: 1,
          uploadCount: 0,
          lastActivity: chat.updated_at,
          firstName: null,
          lastName: null,
          email: null,
          imageUrl: null,
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
          userId: upload.user_id,
          chatCount: 0,
          uploadCount: 1,
          lastActivity: upload.updated_at,
          firstName: null,
          lastName: null,
          email: null,
          imageUrl: null,
        });
      }
    });

    // In Array umwandeln und sortieren (nach letzter Aktivität)
    const allUsers = Array.from(userStatsMap.values())
      .sort((a, b) => {
        if (!a.lastActivity) return 1;
        if (!b.lastActivity) return -1;
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      });

    const total = allUsers.length;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    // Clerk-Benutzerdaten für die paginierten User laden
    const clerk = await clerkClient();
    const usersWithClerkData = await Promise.all(
      paginatedUsers.map(async (user) => {
        try {
          const clerkUser = await clerk.users.getUser(user.userId);
          return {
            ...user,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            email: clerkUser.emailAddresses[0]?.emailAddress || null,
            imageUrl: clerkUser.imageUrl,
          };
        } catch {
          // User nicht in Clerk gefunden (z.B. gelöscht)
          return {
            ...user,
            firstName: null,
            lastName: null,
            email: null,
            imageUrl: null,
          };
        }
      })
    );

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

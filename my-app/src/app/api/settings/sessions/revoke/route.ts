import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * POST /api/settings/sessions/revoke
 * Revokes a session for the current user (only own sessions).
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : null;
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId fehlt" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();
    const { data: userSessions } = await clerk.sessions.getSessionList({ userId });
    const canRevoke = userSessions?.some((s) => s.id === sessionId);
    if (!canRevoke) {
      return NextResponse.json(
        { success: false, error: "Sitzung nicht gefunden oder keine Berechtigung" },
        { status: 403 }
      );
    }

    await clerk.sessions.revokeSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session revoke error:", error);
    return NextResponse.json(
      { success: false, error: "Sitzung konnte nicht beendet werden" },
      { status: 500 }
    );
  }
}

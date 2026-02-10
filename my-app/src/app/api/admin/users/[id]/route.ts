import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { withCsrfProtectionWithParams } from "@/lib/csrf";
import { logger } from "@/lib/logger";

async function patchUserHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ success: false, error: "Ungültige Rolle" }, { status: 400 });
    }

    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerk = await clerkClient();

    await clerk.users.updateUser(id, {
      publicMetadata: { role },
    });

    logger.info(`[Admin Users API] User ${id} role updated to ${role}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("[Admin Users API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Benutzers" },
      { status: 500 }
    );
  }
}

export const PATCH = withCsrfProtectionWithParams(patchUserHandler);

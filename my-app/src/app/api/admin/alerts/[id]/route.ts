import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { validateCsrfToken } from "@/lib/csrf";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    // Validate CSRF token
    const csrfError = await validateCsrfToken(request);
    if (csrfError) {
      return csrfError;
    }

    await params; // id would be used here if we stored dismissed alerts

    // For now, alerts are generated dynamically, so dismissing is just a client-side action
    // In a real implementation, you'd store dismissed alert IDs in a database or session

    return NextResponse.json({
      success: true,
      message: "Benachrichtigung entfernt",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Fehler beim Entfernen der Benachrichtigung" },
      { status: 500 }
    );
  }
}

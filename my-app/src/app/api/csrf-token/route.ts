import { NextResponse } from "next/server";
import { generateSignedCSRFToken } from "@/lib/csrf";

/**
 * GET /api/csrf-token
 * Gibt einen CSRF Token für den Client zurück
 */
export async function GET() {
  const token = generateSignedCSRFToken();

  return NextResponse.json(
    { csrfToken: token },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}


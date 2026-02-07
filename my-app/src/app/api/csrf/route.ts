import { NextResponse } from "next/server";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";

/**
 * GET /api/csrf
 * Generates a new CSRF token, sets it as an httpOnly cookie,
 * and returns it in the JSON body for the frontend to use in headers.
 */
export async function GET() {
  const token = generateCsrfToken();

  // Set the httpOnly cookie
  await setCsrfCookie(token);

  // Return the token for the frontend to include in the X-CSRF-Token header
  return NextResponse.json({ csrfToken: token });
}

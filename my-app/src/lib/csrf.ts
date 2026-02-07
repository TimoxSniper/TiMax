/**
 * CSRF Protection Utilities
 *
 * Implements Double Submit Cookie pattern for CSRF protection
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Get CSRF token from request headers
 */
function getCsrfTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Get CSRF token from cookies
 */
async function getCsrfTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Set CSRF token cookie
 */
export async function setCsrfCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Validate CSRF token
 * Returns null if valid, error response if invalid
 */
export async function validateCsrfToken(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests (they should be idempotent)
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  // Get tokens
  const headerToken = getCsrfTokenFromRequest(request);
  const cookieToken = await getCsrfTokenFromCookie();

  // Check if tokens exist
  if (!headerToken || !cookieToken) {
    return NextResponse.json(
      {
        success: false,
        error: "CSRF token missing. Please refresh the page and try again.",
      },
      { status: 403 }
    );
  }

  // Compare tokens using timing-safe comparison
  const headerBuffer = Buffer.from(headerToken, "utf8");
  const cookieBuffer = Buffer.from(cookieToken, "utf8");

  if (headerBuffer.length !== cookieBuffer.length) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid CSRF token. Please refresh the page and try again.",
      },
      { status: 403 }
    );
  }

  const isValid = crypto.timingSafeEqual(headerBuffer, cookieBuffer);

  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid CSRF token. Please refresh the page and try again.",
      },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Higher-order function to wrap API routes with CSRF protection
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Validate CSRF token
    const csrfError = await validateCsrfToken(request);
    if (csrfError) {
      return csrfError;
    }

    // Call the actual handler
    return handler(request);
  };
}

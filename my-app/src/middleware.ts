import { NextRequest, NextResponse } from "next/server";

// In-memory Rate Limiting Store (für Production sollte Redis verwendet werden)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate Limiting Konfiguration
const RATE_LIMITS = {
  "/api/upload": { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 Uploads/Stunde
  "/api/chat": { maxRequests: 20, windowMs: 60 * 1000 }, // 20 Requests/Minute
  "/api/generate": { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 Requests/Stunde
  default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 Requests/Minute für andere Endpunkte
};

function getClientIP(request: NextRequest): string {
  // Prüfe verschiedene Header für echte IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback
  return "unknown";
}

function checkRateLimit(
  pathname: string,
  ip: string
): { allowed: boolean; resetTime?: number; remaining?: number } {
  const config =
    RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;

  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const stored = rateLimitStore.get(key);

  // Cleanup alte Einträge (alle 5 Minuten)
  if (Math.random() < 0.01) {
    // 1% Chance bei jedem Request
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!stored || stored.resetTime < now) {
    // Neuer Window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (stored.count >= config.maxRequests) {
    return {
      allowed: false,
      resetTime: stored.resetTime,
      remaining: 0,
    };
  }

  // Erhöhe Counter
  stored.count++;
  rateLimitStore.set(key, stored);

  return {
    allowed: true,
    remaining: config.maxRequests - stored.count,
  };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSP Header generieren - Nonce erstellen
  const nonce = Buffer.from(
    Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  ).toString("base64");
  // Hashes für Next.js Inline-Scripts (von Browser-Fehlermeldungen)
  const scriptHashes = [
    "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='",
    "'sha256-785ajcyXqRN19y7eTBno8NdZZ13UmfL41I4uk0iwRS8='",
    "'sha256-Jz+3dLASJW4r3qRWq9NV0DM6jxv9Bkiu7NE2yZ2I+Vw='",
    "'sha256-8QGtv9j9lw2t07LbQSpKDeynV1kzA+PvAYjQDKTyYQY='",
    "'sha256-nzmdl+AXdlsLPaG5B+ouuCXbm2uL+onDzFRTXheLkqo='",
    "'sha256-NQvBp15KZHVMaUc/ogD5gUFB4cQg8Q5iMwGFG991U7U='",
  ].join(" ");

  // CSP Header: 'strict-dynamic' entfernt, damit Next.js Chunks von 'self' geladen werden können
  // Die Hashes erlauben die Next.js Inline-Scripts
  // 'self' erlaubt direkte Script-Ladungen von der eigenen Domain (für Next.js Chunks)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${scriptHashes} https://vercel.live https://*.sentry.io;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.sentry.io https://*.vercel.app https://*.n8n.cloud https://*.n8n.io;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // Rate Limiting für API Routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(pathname, ip);

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
        },
        { status: 429 }
      );

      if (rateLimit.resetTime) {
        const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
        response.headers.set("Retry-After", retryAfter.toString());
        response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString());
      }

      response.headers.set("X-RateLimit-Remaining", "0");
      return response;
    }

    // Rate Limit Headers hinzufügen
    const response = NextResponse.next();
    if (rateLimit.remaining !== undefined) {
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimit.remaining.toString()
      );
    }
    if (rateLimit.resetTime) {
      response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString());
    }

    // CSP Header hinzufügen
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Nonce", nonce);

    return response;
  }

  // Für alle anderen Routes nur CSP hinzufügen
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


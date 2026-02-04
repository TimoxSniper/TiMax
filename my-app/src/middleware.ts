import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Redis Rate Limiting Import
import { checkRateLimit } from "./lib/rate-limit";

// Rate Limit Konfiguration aus Environment Variables
const RATE_LIMITS = {
  "/api/upload": {
    maxRequests: Number(process.env.RATE_LIMIT_UPLOAD_MAX) || 5,
    windowMs: 60 * 60 * 1000
  },
  "/api/chat": {
    maxRequests: Number(process.env.RATE_LIMIT_CHAT_MAX) || 20,
    windowMs: 60 * 1000
  },
  "/api/generate": {
    maxRequests: Number(process.env.RATE_LIMIT_GENERATE_MAX) || 10,
    windowMs: 60 * 60 * 1000
  },
  default: {
    maxRequests: Number(process.env.RATE_LIMIT_DEFAULT_MAX) || 100,
    windowMs: 60 * 1000
  },
};

// Geschützte Routen (nur für eingeloggte User)
const isProtectedRoute = createRouteMatcher([
  "/chat(.*)",
  "/upload(.*)",
  "/text-generator(.*)",
  "/api/upload(.*)",
  "/api/chat(.*)",
]);

// Öffentliche Routen (für alle zugänglich)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/cookies",
  "/monitoring(.*)", // Sentry Tunnel explizit ignorieren
]);

function getClientIP(request: NextRequest): string {
  // 1. Try common proxy headers
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Note: The first element can be spoofed by the client if not behind a trusted proxy.
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Rate Limiting für API Routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(req);
    const config = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;

    // Redis Check
    const rateLimit = await checkRateLimit(`${ip}:${pathname}`, config);

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

    // Geschützte API Routes erfordern Auth
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

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

    return response;
  }

  // Geschützte Seiten erfordern Auth
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

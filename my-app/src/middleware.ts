import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
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
]);

function getClientIP(request: NextRequest): string {
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

  // Cleanup alte Einträge
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!stored || stored.resetTime < now) {
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

  stored.count++;
  rateLimitStore.set(key, stored);

  return {
    allowed: true,
    remaining: config.maxRequests - stored.count,
  };
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Rate Limiting für API Routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(req);
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Redis Rate Limiting Import
import { checkRateLimit } from "./lib/rate-limit";

// Rate Limit Konfiguration aus Environment Variables
// SICHERHEIT: Strikte Limits pro User UND IP
const RATE_LIMITS = {
  "/api/upload": {
    maxRequests: Number(process.env.RATE_LIMIT_UPLOAD_MAX) || 5,
    windowMs: 60 * 60 * 1000 // 5 Uploads pro Stunde
  },
  "/api/chat": {
    maxRequests: Number(process.env.RATE_LIMIT_CHAT_MAX) || 30,
    windowMs: 60 * 1000 // 30 Nachrichten pro Minute
  },
  "/api/generate": {
    maxRequests: Number(process.env.RATE_LIMIT_GENERATE_MAX) || 10,
    windowMs: 60 * 60 * 1000 // 10 Generierungen pro Stunde
  },
  default: {
    maxRequests: Number(process.env.RATE_LIMIT_DEFAULT_MAX) || 100,
    windowMs: 60 * 1000 // 100 Anfragen pro Minute
  },
};

// Geschützte Routen (nur für eingeloggte User)
const isProtectedRoute = createRouteMatcher([
  "/chat(.*)",
  "/upload(.*)",
  "/uploads(.*)",
  "/admin(.*)",
  "/api/upload(.*)",
  "/api/chat(.*)",
  "/api/admin(.*)",
]);

// Hinweis: Öffentliche Routen werden implizit behandelt (alles was nicht protected ist)

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

    // SICHERHEIT: Hole User ID für user-spezifisches Rate Limiting
    let rateLimitKey = `ip:${ip}:${pathname}`;
    
    // Versuche User ID zu bekommen (falls eingeloggt)
    try {
      const { userId } = await auth();
      if (userId) {
        // User-basiertes Rate Limiting (sicherer, kann nicht durch IP-Wechsel umgangen werden)
        rateLimitKey = `user:${userId}:${pathname}`;
      }
    } catch {
      // Falls Auth fehlschlägt, nutze IP-basiertes Rate Limiting
    }

    // Redis Check mit User-spezifischem Key
    const rateLimit = await checkRateLimit(rateLimitKey, config);

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

    // CSP Header für n8n Direct Upload setzen
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.timax.xyz https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://clerk.timax.xyz https://*.clerk.accounts.dev https://*.sentry.io https://*.supabase.co https://clerk-telemetry.com https://*.n8n.cloud https://zapkothimofej.app.n8n.cloud; img-src 'self' data: https://img.clerk.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self' https://challenges.cloudflare.com; worker-src 'self' blob:;"
    );

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

  const response = NextResponse.next();

  // CSP Header für n8n Direct Upload setzen
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.timax.xyz https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://clerk.timax.xyz https://*.clerk.accounts.dev https://*.sentry.io https://*.supabase.co https://clerk-telemetry.com https://*.n8n.cloud https://zapkothimofej.app.n8n.cloud; img-src 'self' data: https://img.clerk.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self' https://challenges.cloudflare.com; worker-src 'self' blob:;"
  );

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

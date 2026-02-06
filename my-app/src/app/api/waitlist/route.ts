import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { waitlistSchema } from "@/lib/validation";
import { logger } from "@/lib/logger";

// Rate limit config: 3 requests per hour per IP
const RATE_LIMIT_CONFIG = {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * GET /api/waitlist
 * Admin-only: Get waitlist stats (count only, no emails exposed)
 */
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) {
      logger.error("[Waitlist API] Fehler beim Abrufen der Statistiken:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: count || 0,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/waitlist" },
    });

    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Statistiken" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/waitlist
 * Public: Add email to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Rate limiting check
    const rateLimit = await checkRateLimit(
      `waitlist:${ip}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Zu viele Anfragen. Bitte versuche es in einer Stunde erneut.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = waitlistSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Ungültige Eingabe";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { email, source } = validation.data;

    const supabase = createAdminClient();

    // Check for duplicate email
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Diese E-Mail-Adresse ist bereits angemeldet.",
        },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const { data: waitlistEntry, error } = await supabase
      .from("waitlist")
      .insert({
        email: email.toLowerCase(),
        source,
        metadata: {
          ip_address: ip,
          user_agent: request.headers.get("user-agent") || "unknown",
          timestamp: new Date().toISOString(),
        },
      })
      .select("id, created_at")
      .single();

    if (error) {
      // Handle unique constraint violation (race condition)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Diese E-Mail-Adresse ist bereits angemeldet.",
          },
          { status: 409 }
        );
      }

      logger.error("[Waitlist API] Fehler beim Speichern:", error);
      throw error;
    }

    logger.info(`[Waitlist] Neue Anmeldung: ${email.substring(0, 3)}***@*** von ${source}`);

    return NextResponse.json(
      {
        success: true,
        message: "Erfolgreich angemeldet! Du erhältst eine E-Mail, sobald TiMax verfügbar ist.",
      },
      { status: 201 }
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/waitlist" },
    });

    return NextResponse.json(
      { success: false, error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut." },
      { status: 500 }
    );
  }
}

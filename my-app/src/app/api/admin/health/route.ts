import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

interface HealthStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  details?: string;
}

async function checkDatabase(): Promise<HealthStatus> {
  const startTime = Date.now();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("chats").select("id").limit(1);

    if (error) throw error;

    return {
      name: "Database",
      status: "healthy",
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("[Health Check] Database error:", error);
    return {
      name: "Database",
      status: "down",
      responseTime: Date.now() - startTime,
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkN8nWebhook(url: string, name: string): Promise<HealthStatus> {
  const startTime = Date.now();

  if (!url) {
    return {
      name,
      status: "degraded",
      responseTime: Date.now() - startTime,
      details: "Webhook URL not configured",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && (response.ok || response.status === 404 || response.status === 405)) {
      return {
        name,
        status: "healthy",
        responseTime: Date.now() - startTime,
      };
    }

    return {
      name,
      status: "degraded",
      responseTime: Date.now() - startTime,
      details: `Unexpected response: ${response?.status}`,
    };
  } catch (error) {
    logger.error(`[Health Check] ${name} error:`, error);
    return {
      name,
      status: "down",
      responseTime: Date.now() - startTime,
      details: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

async function checkRedisRateLimiting(): Promise<HealthStatus> {
  const startTime = Date.now();

  try {
    const { checkRateLimit } = await import("@/lib/rate-limit");

    const testKey = `health-check-${Date.now()}`;
    const result = await checkRateLimit(testKey, {
      maxRequests: 1,
      windowMs: 1000,
    });

    return {
      name: "Redis Rate Limiting",
      status: "healthy",
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    logger.error("[Health Check] Redis error:", error);
    return {
      name: "Redis Rate Limiting",
      status: "degraded",
      responseTime: Date.now() - startTime,
      details: "Rate limiting may not be functioning",
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const [database, chatWebhook, uploadWebhook, transcriptionWebhook, redis] = await Promise.all([
      checkDatabase(),
      checkN8nWebhook(process.env.N8N_CHAT_WEBHOOK_URL || "", "n8n Chat Webhook"),
      checkN8nWebhook(process.env.N8N_UPLOAD_WEBHOOK_URL || "", "n8n Upload Webhook"),
      checkN8nWebhook(process.env.N8N_TRANSCRIPTION_WEBHOOK_URL || "", "n8n Transcription Webhook"),
      checkRedisRateLimiting(),
    ]);

    const checks = [database, chatWebhook, uploadWebhook, transcriptionWebhook, redis];

    const overallStatus = checks.some((c) => c.status === "down")
      ? "down"
      : checks.some((c) => c.status === "degraded")
        ? "degraded"
        : "healthy";

    const avgResponseTime = Math.round(
      checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length
    );

    return NextResponse.json({
      success: true,
      health: {
        overallStatus,
        avgResponseTime,
        timestamp: new Date().toISOString(),
        checks,
      },
    });
  } catch (error) {
    logger.error("[Admin Health API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Health Check" },
      { status: 500 }
    );
  }
}

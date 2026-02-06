import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

/**
 * GET /api/health/redis
 * Health check endpoint for Redis connection
 * Tests: connection, set, get, delete operations
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check if Redis is configured
    const isConfigured = !!(
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.UPSTASH_REDIS_REST_URL !== "https://example.upstash.io" &&
      process.env.UPSTASH_REDIS_REST_TOKEN !== "your_token_here"
    );

    if (!isConfigured) {
      return NextResponse.json(
        {
          status: "not_configured",
          message: "Redis is not configured. Using in-memory fallback.",
          config: {
            url: process.env.UPSTASH_REDIS_REST_URL || "not_set",
            token: process.env.UPSTASH_REDIS_REST_TOKEN ? "***" : "not_set",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Test Redis operations
    const testKey = `health:test:${Date.now()}`;
    const testValue = "health_check_test";

    try {
      // 1. Test SET
      await redis.set(testKey, testValue, { ex: 10 }); // Expire in 10 seconds

      // 2. Test GET
      const getValue = await redis.get(testKey);

      if (getValue !== testValue) {
        throw new Error(
          `GET operation failed: expected '${testValue}', got '${getValue}'`
        );
      }

      // 3. Test DELETE
      await redis.del(testKey);

      // 4. Verify DELETE
      const deletedValue = await redis.get(testKey);
      if (deletedValue !== null) {
        throw new Error("DELETE operation failed: key still exists");
      }

      const responseTime = Date.now() - startTime;

      logger.info(`[Redis Health Check] OK - ${responseTime}ms`);

      return NextResponse.json({
        status: "healthy",
        message: "Redis is working correctly",
        tests: {
          set: "passed",
          get: "passed",
          delete: "passed",
        },
        performance: {
          responseTime: `${responseTime}ms`,
        },
        config: {
          url: process.env.UPSTASH_REDIS_REST_URL?.split("@")[1] || "***",
          configured: true,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (redisError) {
      logger.error("[Redis Health Check] Redis operation failed:", redisError);

      const responseTime = Date.now() - startTime;

      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Redis operations failed",
          error: redisError instanceof Error ? redisError.message : String(redisError),
          performance: {
            responseTime: `${responseTime}ms`,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error("[Redis Health Check] Error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : String(error),
        performance: {
          responseTime: `${responseTime}ms`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

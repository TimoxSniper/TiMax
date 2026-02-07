/**
 * In-Memory Rate Limiting Fallback
 *
 * WARNING: This is ONLY for development/testing!
 * DO NOT use in production - it won't work with serverless/multiple instances
 *
 * Use Upstash Redis for production (see RATE_LIMITING_SETUP.md)
 */

import type { RateLimitResult, RateLimitConfig } from "./rate-limit";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets when server restarts)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

export async function checkRateLimitMemory(
  descriptor: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `ratelimit:${descriptor}`;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

// Export stats for debugging
export function getRateLimitStats() {
  const stats = {
    totalKeys: rateLimitStore.size,
    entries: [] as Array<{ key: string; count: number; resetTime: number }>,
  };

  for (const [key, entry] of rateLimitStore.entries()) {
    stats.entries.push({
      key,
      count: entry.count,
      resetTime: entry.resetTime,
    });
  }

  return stats;
}

/**
 * Upstash Redis Rate Limiting
 *
 * Production-ready rate limiting using Upstash Redis.
 * Works properly with serverless/edge functions.
 *
 * Required environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from '@upstash/redis';
import type { RateLimitResult, RateLimitConfig } from './rate-limit';

let redis: Redis | null = null;

function getRedisClient(): Redis {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }

        redis = new Redis({ url, token });
    }
    return redis;
}

/**
 * Check rate limit using Upstash Redis (sliding window)
 */
export async function checkRateLimitUpstash(
    descriptor: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const client = getRedisClient();
    const key = `ratelimit:${descriptor}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Use a pipeline for atomic operations
    const pipeline = client.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add the current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

    // Set expiry on the key
    pipeline.expire(key, Math.ceil(config.windowMs / 1000));

    const results = await pipeline.exec();

    // The second result (index 1) is the count before adding current request
    const currentCount = (results[1] as number) || 0;

    if (currentCount >= config.maxRequests) {
        // Remove the request we just added since it's rate limited
        await client.zremrangebyscore(key, now, now);

        return {
            allowed: false,
            remaining: 0,
            resetTime: now + config.windowMs,
        };
    }

    return {
        allowed: true,
        remaining: Math.max(0, config.maxRequests - currentCount - 1),
        resetTime: now + config.windowMs,
    };
}

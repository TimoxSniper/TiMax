import { redis } from './redis';
import { checkRateLimitMemory } from './rate-limit-memory';
import { logger } from './logger';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

export type RateLimitConfig = {
    maxRequests: number;
    windowMs: number;
};

// Check if Redis is configured
const isRedisConfigured = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_URL !== 'https://example.upstash.io' &&
    process.env.UPSTASH_REDIS_REST_TOKEN !== 'your_token_here'
);

export async function checkRateLimit(
    descriptor: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    // Use in-memory fallback if Redis is not configured
    if (!isRedisConfigured) {
        if (process.env.NODE_ENV === 'development') {
            logger.warn('[Rate Limit] Using in-memory fallback (development only). Configure Upstash Redis for production.');
        }
        return checkRateLimitMemory(descriptor, config);
    }

    const key = `ratelimit:${descriptor}`;
    const now = Date.now();

    try {
        // Pipeline für atomare Operationen:
        // 1. Inkrementieren
        // 2. TTL abfragen (um zu sehen ob wir expire setzen müssen)
        const pipeline = redis.pipeline();
        pipeline.incr(key);
        pipeline.pttl(key);

        const [count, ttl] = await pipeline.exec<[number, number]>();

        // Wenn der Key neu ist (oder abgelaufen), setzen wir die Expiration
        if (ttl === -1 || count === 1) {
            await redis.pexpire(key, config.windowMs);
        }

        // Berechne Reset-Zeit
        // Falls TTL valid ist (>0), ist resetTime = now + ttl
        // Falls wir gerade expire gesetzt haben, ist resetTime = now + windowMs
        const effectiveTtl = (ttl > 0 ? ttl : config.windowMs);
        const resetTime = now + effectiveTtl;

        if (count > config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime,
            };
        }

        return {
            allowed: true,
            remaining: Math.max(0, config.maxRequests - count),
            resetTime,
        };

    } catch (error) {
        logger.error('Rate Limit Error (falling back to memory):', error);
        // Fallback to in-memory if Redis fails
        return checkRateLimitMemory(descriptor, config);
    }
}

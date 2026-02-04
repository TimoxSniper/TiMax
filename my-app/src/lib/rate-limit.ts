import { redis } from './redis';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

export type RateLimitConfig = {
    maxRequests: number;
    windowMs: number;
};

export async function checkRateLimit(
    descriptor: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
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
        console.error('Rate Limit Error:', error);
        // Fail Open: Wenn Redis nicht erreichbar ist, erlauben wir den Request
        return {
            allowed: true,
            remaining: 1,
            resetTime: now + config.windowMs,
        };
    }
}

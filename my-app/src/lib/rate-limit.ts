import { checkRateLimitMemory } from './rate-limit-memory';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
}

export type RateLimitConfig = {
    maxRequests: number;
    windowMs: number;
};

/**
 * Rate limiting mit In-Memory Speicher
 * Funktioniert lokal und in Production über alle Requests hinweg
 */
export async function checkRateLimit(
    descriptor: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    return checkRateLimitMemory(descriptor, config);
}

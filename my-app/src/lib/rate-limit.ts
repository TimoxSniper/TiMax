import { checkRateLimitMemory } from './rate-limit-memory';
import { checkRateLimitUpstash } from './rate-limit-upstash';

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
 * Rate limiting with automatic backend selection
 *
 * Uses Upstash Redis in production (when env vars are set),
 * falls back to in-memory for local development.
 *
 * In-memory DOES NOT work properly on Vercel serverless!
 * Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production.
 */
export async function checkRateLimit(
    descriptor: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    // Use Upstash Redis if environment variables are configured and valid
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    const isUpstashConfigured =
        upstashUrl &&
        upstashToken &&
        !upstashUrl.includes('example') &&
        !upstashToken.includes('your_token');

    if (isUpstashConfigured) {
        try {
            return await checkRateLimitUpstash(descriptor, config);
        } catch (error) {
            // If Upstash fails, fall back to in-memory
            console.warn('Upstash rate limit check failed, falling back to in-memory:', error);
            return checkRateLimitMemory(descriptor, config);
        }
    }

    // Fallback to in-memory (development only)
    return checkRateLimitMemory(descriptor, config);
}

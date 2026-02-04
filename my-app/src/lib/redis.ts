import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Initialisierung von Redis fehlgeschlagen: UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN sind nicht gesetzt. Rate Limiting ist deaktiviert (Fail-Open).');
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

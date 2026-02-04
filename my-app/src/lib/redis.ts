import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Initialisierung von Redis fehlgeschlagen: UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN müssen gesetzt sein.');
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

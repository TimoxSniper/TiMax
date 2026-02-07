import { Redis } from "@upstash/redis";
import { logger } from "./logger";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  logger.warn(
    "Initialisierung von Redis fehlgeschlagen: UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN sind nicht gesetzt. Rate Limiting ist deaktiviert (Fail-Open)."
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  // Production Stability Settings
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});

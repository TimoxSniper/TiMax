import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimitMemory, getRateLimitStats } from "@/lib/rate-limit-memory";
import type { RateLimitConfig } from "@/lib/rate-limit";

describe("Rate Limit Memory", () => {
  const defaultConfig: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
  };

  beforeEach(() => {
    // Clear the store before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkRateLimitMemory", () => {
    it("should allow first request", async () => {
      const result = await checkRateLimitMemory("user1", defaultConfig);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it("should track multiple requests from same user", async () => {
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimitMemory("user2", defaultConfig);
        expect(result.allowed).toBe(true);
      }

      // 6th request should be blocked
      const result = await checkRateLimitMemory("user2", defaultConfig);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should track different users separately", async () => {
      // Max out user3
      for (let i = 0; i < 5; i++) {
        await checkRateLimitMemory("user3", defaultConfig);
      }
      const user3Result = await checkRateLimitMemory("user3", defaultConfig);
      expect(user3Result.allowed).toBe(false);

      // User4 should still be allowed
      const user4Result = await checkRateLimitMemory("user4", defaultConfig);
      expect(user4Result.allowed).toBe(true);
    });

    it("should reset after window expires", async () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      // Max out requests
      for (let i = 0; i < 5; i++) {
        await checkRateLimitMemory("user5", defaultConfig);
      }

      const blockedResult = await checkRateLimitMemory("user5", defaultConfig);
      expect(blockedResult.allowed).toBe(false);

      // Advance time past the window
      vi.setSystemTime(startTime + defaultConfig.windowMs + 1000);

      // Should be allowed again
      const resetResult = await checkRateLimitMemory("user5", defaultConfig);
      expect(resetResult.allowed).toBe(true);
      expect(resetResult.remaining).toBe(4);
    });

    it("should handle different configs", async () => {
      const strictConfig: RateLimitConfig = {
        maxRequests: 1,
        windowMs: 1000,
      };

      const result1 = await checkRateLimitMemory("user6", strictConfig);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(0);

      const result2 = await checkRateLimitMemory("user6", strictConfig);
      expect(result2.allowed).toBe(false);
    });

    it("should correctly calculate remaining requests", async () => {
      const result1 = await checkRateLimitMemory("user7", defaultConfig);
      expect(result1.remaining).toBe(4);

      const result2 = await checkRateLimitMemory("user7", defaultConfig);
      expect(result2.remaining).toBe(3);

      const result3 = await checkRateLimitMemory("user7", defaultConfig);
      expect(result3.remaining).toBe(2);

      const result4 = await checkRateLimitMemory("user7", defaultConfig);
      expect(result4.remaining).toBe(1);

      const result5 = await checkRateLimitMemory("user7", defaultConfig);
      expect(result5.remaining).toBe(0);
    });

    it("should handle long window durations", async () => {
      const longConfig: RateLimitConfig = {
        maxRequests: 10,
        windowMs: 3600000, // 1 hour
      };

      const result = await checkRateLimitMemory("user8", longConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });

    it("should handle very short window durations", async () => {
      const shortConfig: RateLimitConfig = {
        maxRequests: 100,
        windowMs: 1000, // 1 second
      };

      const result = await checkRateLimitMemory("user9", shortConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(99);
    });

    it("should handle maxRequests of 1", async () => {
      const strictConfig: RateLimitConfig = {
        maxRequests: 1,
        windowMs: 60000,
      };

      const result1 = await checkRateLimitMemory("user10", strictConfig);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(0);

      const result2 = await checkRateLimitMemory("user10", strictConfig);
      expect(result2.allowed).toBe(false);
      expect(result2.remaining).toBe(0);
    });

    it("should set correct reset time", async () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      const result = await checkRateLimitMemory("user11", defaultConfig);

      expect(result.resetTime).toBe(startTime + defaultConfig.windowMs);
    });
  });

  describe("getRateLimitStats", () => {
    it("should return stats object structure", () => {
      const stats = getRateLimitStats();
      expect(stats).toHaveProperty("totalKeys");
      expect(stats).toHaveProperty("entries");
      expect(Array.isArray(stats.entries)).toBe(true);
    });

    it("should track new entries after requests", async () => {
      const beforeStats = getRateLimitStats();
      const beforeCount = beforeStats.totalKeys;

      await checkRateLimitMemory("stats-user1", defaultConfig);
      await checkRateLimitMemory("stats-user2", defaultConfig);

      const afterStats = getRateLimitStats();
      expect(afterStats.totalKeys).toBeGreaterThanOrEqual(beforeCount + 2);
      expect(afterStats.entries.length).toBeGreaterThanOrEqual(beforeCount + 2);
    });

    it("should include entry details", async () => {
      const uniqueKey = `stats-test-${Date.now()}`;
      await checkRateLimitMemory(uniqueKey, defaultConfig);

      const stats = getRateLimitStats();
      const entry = stats.entries.find((e) => e.key.includes(uniqueKey));

      expect(entry).toBeDefined();
      expect(entry?.count).toBeGreaterThanOrEqual(1);
      expect(entry?.resetTime).toBeGreaterThan(Date.now());
    });
  });
});

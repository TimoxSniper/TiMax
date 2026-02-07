import { describe, it, expect } from "vitest";
import { TIMEOUTS, UPLOAD_CONFIG, CHAT_CONFIG, BREAKPOINTS } from "@/lib/constants";

describe("Constants", () => {
  describe("TIMEOUTS", () => {
    it("should have all timeout constants defined", () => {
      expect(TIMEOUTS.COPY_FEEDBACK).toBe(2000);
      expect(TIMEOUTS.UPLOAD_RESET).toBe(3000);
      expect(TIMEOUTS.TOAST_AUTO_REMOVE).toBe(5000);
      expect(TIMEOUTS.SCROLL_DELAY).toBe(100);
      expect(TIMEOUTS.UPLOAD_SCROLL_DELAY).toBe(500);
    });

    it("should have reasonable timeout values", () => {
      // All timeouts should be positive numbers
      Object.values(TIMEOUTS).forEach((timeout) => {
        expect(timeout).toBeGreaterThan(0);
        expect(timeout).toBeLessThan(60000); // Max 1 minute
      });
    });

    it("should have correct structure", () => {
      // Verify all expected keys are present
      expect(TIMEOUTS).toHaveProperty("COPY_FEEDBACK");
      expect(TIMEOUTS).toHaveProperty("UPLOAD_RESET");
      expect(TIMEOUTS).toHaveProperty("TOAST_AUTO_REMOVE");
      expect(TIMEOUTS).toHaveProperty("SCROLL_DELAY");
      expect(TIMEOUTS).toHaveProperty("UPLOAD_SCROLL_DELAY");
    });
  });

  describe("UPLOAD_CONFIG", () => {
    it("should have correct max file size", () => {
      expect(UPLOAD_CONFIG.MAX_FILE_SIZE).toBe(100 * 1024 * 1024); // 100MB
    });

    it("should have allowed MIME types", () => {
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("audio/mpeg");
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("audio/mp4");
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("audio/wav");
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("audio/m4a");
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("video/mp4");
      expect(UPLOAD_CONFIG.ALLOWED_TYPES).toContain("video/webm");
    });

    it("should not be empty", () => {
      expect(UPLOAD_CONFIG.ALLOWED_TYPES.length).toBeGreaterThan(0);
    });
  });

  describe("CHAT_CONFIG", () => {
    it("should have correct max message length", () => {
      expect(CHAT_CONFIG.MAX_MESSAGE_LENGTH).toBe(4000);
    });

    it("should have correct min message length", () => {
      expect(CHAT_CONFIG.MIN_MESSAGE_LENGTH).toBe(1);
    });

    it("should have reasonable limits", () => {
      expect(CHAT_CONFIG.MAX_MESSAGE_LENGTH).toBeGreaterThan(CHAT_CONFIG.MIN_MESSAGE_LENGTH);
      expect(CHAT_CONFIG.MAX_MESSAGE_LENGTH).toBeLessThan(50000); // Sanity check
    });
  });

  describe("BREAKPOINTS", () => {
    it("should have mobile breakpoint defined", () => {
      expect(BREAKPOINTS.MOBILE).toBe(1024);
    });

    it("should be a reasonable value", () => {
      expect(BREAKPOINTS.MOBILE).toBeGreaterThan(0);
      expect(BREAKPOINTS.MOBILE).toBeLessThan(2000);
    });
  });
});

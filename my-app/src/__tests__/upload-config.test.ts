import { describe, it, expect } from "vitest";
import {
  UPLOAD_CONFIG,
  RETENTION_POLICY,
  isFileSizeAllowed,
  isMimeTypeAllowed,
  isExtensionAllowed,
  isDurationAllowed,
  formatFileSize,
  formatDuration,
} from "@/lib/upload-config";

describe("Upload Config", () => {
  describe("UPLOAD_CONFIG", () => {
    it("should have correct max file size (100MB)", () => {
      expect(UPLOAD_CONFIG.maxFileSize).toBe(100 * 1024 * 1024);
      expect(UPLOAD_CONFIG.maxFileSizeBytes).toBe(100 * 1024 * 1024);
    });

    it("should have allowed video formats", () => {
      expect(UPLOAD_CONFIG.allowedVideoFormats).toContain("video/mp4");
      expect(UPLOAD_CONFIG.allowedVideoFormats).toContain("video/webm");
      expect(UPLOAD_CONFIG.allowedVideoFormats).toContain("video/quicktime");
    });

    it("should have allowed audio formats", () => {
      expect(UPLOAD_CONFIG.allowedAudioFormats).toContain("audio/mpeg");
      expect(UPLOAD_CONFIG.allowedAudioFormats).toContain("audio/mp3");
      expect(UPLOAD_CONFIG.allowedAudioFormats).toContain("audio/wav");
      expect(UPLOAD_CONFIG.allowedAudioFormats).toContain("audio/m4a");
      expect(UPLOAD_CONFIG.allowedAudioFormats).toContain("audio/webm");
    });

    it("should have allowed extensions", () => {
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".mp4");
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".webm");
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".mov");
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".mp3");
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".wav");
      expect(UPLOAD_CONFIG.allowedExtensions).toContain(".m4a");
    });

    it("should have reasonable rate limits", () => {
      expect(UPLOAD_CONFIG.maxUploadsPerHour).toBe(5);
      expect(UPLOAD_CONFIG.maxUploadsPerDay).toBe(20);
    });

    it("should have correct max duration (3 hours)", () => {
      expect(UPLOAD_CONFIG.maxUploadDuration).toBe(180 * 60);
      expect(UPLOAD_CONFIG.maxUploadDurationSeconds).toBe(180 * 60);
    });

    it("should have correct storage limit (10GB)", () => {
      expect(UPLOAD_CONFIG.maxStoragePerUser).toBe(10 * 1024 * 1024 * 1024);
    });

    it("should have chunked upload config", () => {
      expect(UPLOAD_CONFIG.chunkSize).toBe(5 * 1024 * 1024); // 5MB
      expect(UPLOAD_CONFIG.maxChunks).toBe(20);
    });
  });

  describe("RETENTION_POLICY", () => {
    it("should have 7 days for uploads without transcript", () => {
      expect(RETENTION_POLICY.uploadsWithoutTranscript).toBe(7 * 24 * 60 * 60 * 1000);
    });

    it("should have 90 days for inactive transcripts", () => {
      expect(RETENTION_POLICY.transcriptsInactive).toBe(90 * 24 * 60 * 60 * 1000);
    });

    it("should have immediate deletion for deleted accounts", () => {
      expect(RETENTION_POLICY.deletedAccounts).toBe(0);
    });

    it("should allow manual deletion always", () => {
      expect(RETENTION_POLICY.manualDeletion).toBe("always");
    });
  });

  describe("isFileSizeAllowed", () => {
    it("should return true for files under limit", () => {
      expect(isFileSizeAllowed(1024)).toBe(true);
      expect(isFileSizeAllowed(100 * 1024 * 1024 - 1)).toBe(true);
    });

    it("should return true for files exactly at limit", () => {
      expect(isFileSizeAllowed(100 * 1024 * 1024)).toBe(true);
    });

    it("should return false for files over limit", () => {
      expect(isFileSizeAllowed(100 * 1024 * 1024 + 1)).toBe(false);
      expect(isFileSizeAllowed(200 * 1024 * 1024)).toBe(false);
    });

    it("should return true for zero bytes", () => {
      expect(isFileSizeAllowed(0)).toBe(true);
    });
  });

  describe("isMimeTypeAllowed", () => {
    it("should accept video formats", () => {
      expect(isMimeTypeAllowed("video/mp4")).toBe(true);
      expect(isMimeTypeAllowed("video/webm")).toBe(true);
      expect(isMimeTypeAllowed("video/quicktime")).toBe(true);
    });

    it("should accept audio formats", () => {
      expect(isMimeTypeAllowed("audio/mpeg")).toBe(true);
      expect(isMimeTypeAllowed("audio/mp3")).toBe(true);
      expect(isMimeTypeAllowed("audio/wav")).toBe(true);
      expect(isMimeTypeAllowed("audio/m4a")).toBe(true);
      expect(isMimeTypeAllowed("audio/webm")).toBe(true);
    });

    it("should reject invalid formats", () => {
      expect(isMimeTypeAllowed("application/pdf")).toBe(false);
      expect(isMimeTypeAllowed("image/jpeg")).toBe(false);
      expect(isMimeTypeAllowed("text/plain")).toBe(false);
      expect(isMimeTypeAllowed("application/octet-stream")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isMimeTypeAllowed("")).toBe(false);
    });
  });

  describe("isExtensionAllowed", () => {
    it("should accept valid extensions (lowercase)", () => {
      expect(isExtensionAllowed("video.mp4")).toBe(true);
      expect(isExtensionAllowed("audio.mp3")).toBe(true);
      expect(isExtensionAllowed("file.wav")).toBe(true);
      expect(isExtensionAllowed("podcast.m4a")).toBe(true);
    });

    it("should accept valid extensions (uppercase)", () => {
      expect(isExtensionAllowed("video.MP4")).toBe(true);
      expect(isExtensionAllowed("audio.MP3")).toBe(true);
      expect(isExtensionAllowed("file.WAV")).toBe(true);
    });

    it("should reject invalid extensions", () => {
      expect(isExtensionAllowed("document.pdf")).toBe(false);
      expect(isExtensionAllowed("image.jpg")).toBe(false);
      expect(isExtensionAllowed("script.js")).toBe(false);
      expect(isExtensionAllowed("archive.zip")).toBe(false);
    });

    it("should handle filenames without extension", () => {
      // Files without extension return false as there's no dot
      expect(isExtensionAllowed("nofile")).toBe(false);
    });

    it("should handle filenames with multiple dots", () => {
      expect(isExtensionAllowed("my.video.file.mp4")).toBe(true);
      expect(isExtensionAllowed("archive.tar.gz")).toBe(false); // .gz not in list
    });
  });

  describe("isDurationAllowed", () => {
    it("should return true for short durations", () => {
      expect(isDurationAllowed(60)).toBe(true);
      expect(isDurationAllowed(3600)).toBe(true);
    });

    it("should return true for exactly 3 hours", () => {
      expect(isDurationAllowed(180 * 60)).toBe(true);
    });

    it("should return false for over 3 hours", () => {
      expect(isDurationAllowed(180 * 60 + 1)).toBe(false);
      expect(isDurationAllowed(3600 * 4)).toBe(false);
    });

    it("should return true for zero seconds", () => {
      expect(isDurationAllowed(0)).toBe(true);
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(512)).toBe("512 B");
    });

    it("should format KB correctly", () => {
      expect(formatFileSize(1024)).toBe("1.00 KB");
      expect(formatFileSize(1536)).toBe("1.50 KB");
    });

    it("should format MB correctly", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1.00 MB");
      expect(formatFileSize(5 * 1024 * 1024)).toBe("5.00 MB");
    });

    it("should format GB correctly", () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe("2.50 GB");
    });

    it("should handle zero", () => {
      expect(formatFileSize(0)).toBe("0 B");
    });
  });

  describe("formatDuration", () => {
    it("should format seconds only", () => {
      expect(formatDuration(45)).toBe("45s");
    });

    it("should format minutes and seconds", () => {
      expect(formatDuration(125)).toBe("2m 5s");
      expect(formatDuration(90)).toBe("1m 30s");
    });

    it("should format hours, minutes and seconds", () => {
      expect(formatDuration(3665)).toBe("1h 1m 5s");
      expect(formatDuration(7200)).toBe("2h 0m 0s");
    });

    it("should handle zero", () => {
      expect(formatDuration(0)).toBe("0s");
    });

    it("should handle exactly 60 seconds", () => {
      expect(formatDuration(60)).toBe("1m 0s");
    });

    it("should handle exactly 3600 seconds", () => {
      expect(formatDuration(3600)).toBe("1h 0m 0s");
    });
  });
});

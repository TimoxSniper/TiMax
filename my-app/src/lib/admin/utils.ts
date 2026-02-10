/**
 * Admin Dashboard Utility Functions
 *
 * Helper functions for formatting, calculations, and common operations
 */

/**
 * Format file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return past.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (diffDay > 0) {
    return `${diffDay} ${diffDay === 1 ? "Tag" : "Tage"}`;
  }

  if (diffHour > 0) {
    return `${diffHour} ${diffHour === 1 ? "Stunde" : "Stunden"}`;
  }

  if (diffMin > 0) {
    return `${diffMin} ${diffMin === 1 ? "Minute" : "Minuten"}`;
  }

  return "Gerade eben";
}

/**
 * Format date to German locale string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format short date (without time)
 */
export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate percentage change between two numbers
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

/**
 * Get initials from name for avatar fallback
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("de-DE");
}

/**
 * Get color for upload status
 */
export function getUploadStatusColor(
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
): string {
  switch (status) {
    case "completed":
      return "bg-accent/10 text-accent";
    case "processing":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500";
    case "failed":
      return "bg-destructive/10 text-destructive";
    case "cancelled":
      return "bg-muted/50 text-muted-foreground";
    case "pending":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-500";
    default:
      return "bg-muted/50 text-muted-foreground";
  }
}

/**
 * Get color for user status (active/banned)
 */
export function getUserStatusColor(isBanned: boolean): string {
  return isBanned
    ? "bg-destructive/10 text-destructive"
    : "bg-accent/10 text-accent";
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Get file type category (video, audio, document, etc.)
 */
export function getFileTypeCategory(mimeType: string | null): string {
  if (!mimeType) return "unknown";

  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("text/")) return "text";

  return "other";
}

/**
 * Generate a range of dates for time series data
 */
export function generateDateRange(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}

/**
 * Format date for API queries (YYYY-MM-DD)
 */
export function formatDateForQuery(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Check if a ban has expired
 */
export function isBanExpired(expiresAt: string | null): boolean {
  if (!expiresAt) {
    return false; // Permanent ban
  }
  return new Date(expiresAt) < new Date();
}

/**
 * Calculate system health status
 */
export function calculateHealthStatus(metrics: {
  databaseConnected: boolean;
  storageConnected: boolean;
  apiResponseTime: number;
}): "healthy" | "degraded" | "down" {
  if (!metrics.databaseConnected || !metrics.storageConnected) {
    return "down";
  }

  if (metrics.apiResponseTime > 1000) {
    return "degraded";
  }

  return "healthy";
}

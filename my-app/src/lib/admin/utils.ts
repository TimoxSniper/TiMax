/**
 * Shared utility functions for Admin Dashboard
 */

// File size constants
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * 1024;

/**
 * Format date string to German locale
 */
export function formatDate(dateString: string | number | null): string {
  if (!dateString) return "Nie";
  const date = typeof dateString === "number" ? new Date(dateString) : new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format file size from bytes to human-readable string
 */
export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "N/A";
  if (bytes < BYTES_PER_KB) return `${bytes} B`;
  if (bytes < BYTES_PER_MB) return `${(bytes / BYTES_PER_KB).toFixed(1)} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}

/**
 * Upload status colors for badges
 */
export const uploadStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Upload status labels in German
 */
export const uploadStatusLabels: Record<string, string> = {
  pending: "Wartend",
  processing: "Verarbeitung",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
  cancelled: "Abgebrochen",
};

/**
 * Get status color class for upload status
 */
export function getUploadStatusColor(status: string): string {
  return uploadStatusColors[status] || uploadStatusColors.pending;
}

/**
 * Get status label for upload status
 */
export function getUploadStatusLabel(status: string): string {
  return uploadStatusLabels[status] || status;
}

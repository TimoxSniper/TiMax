// Konstanten für Timeouts (in Millisekunden)
export const TIMEOUTS = {
  COPY_FEEDBACK: 2000,
  UPLOAD_RESET: 3000,
  TOAST_AUTO_REMOVE: 5000,
  SCROLL_DELAY: 100,
  UPLOAD_SCROLL_DELAY: 500,
} as const;

// Datei-Upload Konfiguration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: [
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/m4a",
    "video/mp4",
    "video/webm",
  ] as const,
} as const;

// Chat Konfiguration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MIN_MESSAGE_LENGTH: 1,
} as const;

// Breakpoints für Responsive Design
export const BREAKPOINTS = {
  MOBILE: 1024,
} as const;

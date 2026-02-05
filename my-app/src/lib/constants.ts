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

// Chat UI Texte
export const CHAT_UI_TEXTS = {
  WELCOME_TITLE: "Hey! Ich bin TiMax.",
  WELCOME_SUBTITLE: "Ich verwandle deine Videos und Audios in Posts, Artikel und mehr. Lade etwas hoch und sag mir, was du daraus machen willst.",
  EXAMPLE_REQUESTS_TITLE: "Das kann ich für dich tun:",
  EXAMPLE_REQUESTS: [
    '• "Mach einen LinkedIn-Post aus meinem letzten Video"',
    '• "Fasse mein Interview in 3 Punkten zusammen"',
    '• "Schreib einen Newsletter aus meinem Podcast"',
  ],
  THINKING: "TiMax denkt nach...",
  ASSISTANT_DEFAULT_RESPONSE: "Keine Antwort erhalten",
} as const;

// Chat Fehler Texte
export const CHAT_ERROR_TEXTS = {
  DEFAULT_API_ERROR: "Fehler bei der Chat-Anfrage",
  UNKNOWN_ERROR: "Unbekannter Fehler",
  HISTORY_LOAD_ERROR: "Historie konnte nicht geladen werden",
  CHAT_ERROR_LOG_PREFIX: "Chat-Fehler:",
} as const;

// Breakpoints für Responsive Design
export const BREAKPOINTS = {
  MOBILE: 1024,
} as const;

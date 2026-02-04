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
  WELCOME_TITLE: "Willkommen bei REX!",
  WELCOME_SUBTITLE: "Chatte mit deiner KI über deine Transkripte und lass dir Content generieren.",
  EXAMPLE_REQUESTS_TITLE: "Beispiel-Anfragen:",
  EXAMPLE_REQUESTS: [
    "Erstelle einen Instagram Post über Produktivität",
    "Generiere einen Twitter Thread aus meinem letzten Video",
    "Was sind die wichtigsten Punkte aus dem Transkript?",
  ],
  THINKING: "REX denkt nach...",
  ASSISTANT_DEFAULT_RESPONSE: "Keine Antwort erhalten",
  SEND_EXAMPLE: "Beispiel-Anfrage senden",
} as const;

// Chat Fehler Texte
export const CHAT_ERROR_TEXTS = {
  DEFAULT_API_ERROR: "Fehler bei der Chat-Anfrage",
  UNKNOWN_ERROR: "Unbekannter Fehler",
  CHAT_ERROR_LOG_PREFIX: "Chat-Fehler:",
} as const;

// Breakpoints für Responsive Design
export const BREAKPOINTS = {
  MOBILE: 1024,
} as const;

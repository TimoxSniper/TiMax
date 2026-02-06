/**
 * Zentralisierte Error Handling Library
 * Konvertiert technische Fehler in benutzerfreundliche deutsche Nachrichten
 */

export type ErrorCategory =
  | "network"
  | "auth"
  | "validation"
  | "ratelimit"
  | "notfound"
  | "server"
  | "permission"
  | "unknown";

export interface UserFriendlyError {
  message: string;
  category: ErrorCategory;
  actionable: string | null;
  technical?: string;
}

/**
 * Haupt-Funktion: Konvertiert technische Fehler in benutzerfreundliche Nachrichten
 */
export function getUserFriendlyError(error: unknown): UserFriendlyError {
  // Network/Fetch Errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: "Verbindung fehlgeschlagen",
      category: "network",
      actionable: "Überprüfe deine Internetverbindung und versuche es erneut.",
      technical: error.message,
    };
  }

  // HTTP Response Errors (from API)
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status;
    return getErrorForStatusCode(status, error);
  }

  // Parse error message string
  if (typeof error === "string") {
    return parseErrorMessage(error);
  }

  // Error object with message
  if (error instanceof Error) {
    return parseErrorMessage(error.message);
  }

  // Unknown error
  return {
    message: "Ein unerwarteter Fehler ist aufgetreten",
    category: "unknown",
    actionable: "Bitte versuche es später erneut oder kontaktiere den Support.",
    technical: String(error),
  };
}

/**
 * HTTP Status Code basierte Fehler
 */
function getErrorForStatusCode(
  status: number,
  error: unknown
): UserFriendlyError {
  const errorMessage =
    typeof error === "object" && error !== null && "error" in error
      ? String((error as { error: unknown }).error)
      : "";

  switch (status) {
    case 400:
      return {
        message: "Ungültige Eingabe",
        category: "validation",
        actionable: errorMessage || "Überprüfe deine Eingaben und versuche es erneut.",
        technical: errorMessage,
      };

    case 401:
      return {
        message: "Sitzung abgelaufen",
        category: "auth",
        actionable: "Bitte melde dich erneut an.",
        technical: errorMessage,
      };

    case 403:
      return {
        message: "Zugriff verweigert",
        category: "permission",
        actionable: "Du hast keine Berechtigung für diese Aktion.",
        technical: errorMessage,
      };

    case 404:
      return {
        message: "Nicht gefunden",
        category: "notfound",
        actionable: "Die angeforderte Ressource existiert nicht.",
        technical: errorMessage,
      };

    case 409:
      return {
        message: "Konflikt",
        category: "validation",
        actionable: errorMessage || "Diese Aktion kann nicht ausgeführt werden.",
        technical: errorMessage,
      };

    case 429:
      return {
        message: "Zu viele Anfragen",
        category: "ratelimit",
        actionable: "Bitte warte einen Moment und versuche es dann erneut.",
        technical: errorMessage,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: "Server-Fehler",
        category: "server",
        actionable:
          "Ein Problem ist auf unserem Server aufgetreten. Bitte versuche es in wenigen Minuten erneut.",
        technical: errorMessage,
      };

    default:
      return {
        message: `Fehler ${status}`,
        category: "unknown",
        actionable: "Bitte versuche es später erneut.",
        technical: errorMessage,
      };
  }
}

/**
 * Parsiert Fehlermeldungen und kategorisiert sie
 */
function parseErrorMessage(message: string): UserFriendlyError {
  const lowerMessage = message.toLowerCase();

  // Network Errors
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("connection") ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("fetch")
  ) {
    return {
      message: "Verbindung fehlgeschlagen",
      category: "network",
      actionable: "Überprüfe deine Internetverbindung und versuche es erneut.",
      technical: message,
    };
  }

  // Auth Errors
  if (
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("authentication") ||
    lowerMessage.includes("token") ||
    lowerMessage.includes("session")
  ) {
    return {
      message: "Sitzung abgelaufen",
      category: "auth",
      actionable: "Bitte melde dich erneut an.",
      technical: message,
    };
  }

  // Rate Limit
  if (
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("too many")
  ) {
    return {
      message: "Zu viele Anfragen",
      category: "ratelimit",
      actionable: "Bitte warte einen Moment und versuche es dann erneut.",
      technical: message,
    };
  }

  // Validation Errors
  if (
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("required") ||
    lowerMessage.includes("validation")
  ) {
    return {
      message: "Ungültige Eingabe",
      category: "validation",
      actionable: message, // Use original message as it's usually user-friendly
      technical: message,
    };
  }

  // Server Errors
  if (
    lowerMessage.includes("server error") ||
    lowerMessage.includes("internal")
  ) {
    return {
      message: "Server-Fehler",
      category: "server",
      actionable:
        "Ein Problem ist auf unserem Server aufgetreten. Bitte versuche es in wenigen Minuten erneut.",
      technical: message,
    };
  }

  // Not Found
  if (
    lowerMessage.includes("not found") ||
    lowerMessage.includes("404")
  ) {
    return {
      message: "Nicht gefunden",
      category: "notfound",
      actionable: "Die angeforderte Ressource existiert nicht.",
      technical: message,
    };
  }

  // Generic error with original message if it's user-friendly
  return {
    message: message.length < 100 ? message : "Ein Fehler ist aufgetreten",
    category: "unknown",
    actionable: "Bitte versuche es später erneut.",
    technical: message,
  };
}

/**
 * Formatiert eine UserFriendlyError für Toast-Nachrichten
 */
export function formatErrorForToast(error: UserFriendlyError): string {
  if (error.actionable && error.actionable !== error.message) {
    return `${error.message}: ${error.actionable}`;
  }
  return error.message;
}

/**
 * Helper-Funktion für API-Aufrufe mit automatischer Fehlerbehandlung
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<Response>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: UserFriendlyError) => void;
    showToast?: (message: string, type: "success" | "error") => void;
  }
): Promise<{ success: boolean; data?: T; error?: UserFriendlyError }> {
  try {
    const response = await apiCall();
    const data = await response.json();

    if (!response.ok) {
      const friendlyError = getUserFriendlyError({
        status: response.status,
        error: data.error || data.message,
      });

      if (options?.onError) {
        options.onError(friendlyError);
      }

      if (options?.showToast) {
        options.showToast(formatErrorForToast(friendlyError), "error");
      }

      return { success: false, error: friendlyError };
    }

    if (options?.onSuccess) {
      options.onSuccess(data);
    }

    return { success: true, data };
  } catch (error) {
    const friendlyError = getUserFriendlyError(error);

    if (options?.onError) {
      options.onError(friendlyError);
    }

    if (options?.showToast) {
      options.showToast(formatErrorForToast(friendlyError), "error");
    }

    return { success: false, error: friendlyError };
  }
}

/**
 * Spezifische Error Messages für verschiedene Funktionen
 */
export const ERROR_MESSAGES = {
  // Upload Errors
  upload: {
    fileTooLarge: "Die Datei ist zu groß. Maximum: 100MB",
    invalidFileType: "Ungültiger Dateityp. Erlaubt: MP4, WebM, MP3, WAV, M4A",
    uploadFailed: "Upload fehlgeschlagen. Bitte versuche es erneut.",
    processingFailed: "Verarbeitung fehlgeschlagen. Bitte versuche es erneut.",
  },

  // Chat Errors
  chat: {
    messageTooLong: "Nachricht ist zu lang. Maximum: 10.000 Zeichen",
    sendFailed: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
    loadFailed: "Chat konnte nicht geladen werden. Bitte aktualisiere die Seite.",
  },

  // Auth Errors
  auth: {
    sessionExpired: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
    notAuthenticated: "Du musst angemeldet sein, um diese Aktion auszuführen.",
    permissionDenied: "Du hast keine Berechtigung für diese Aktion.",
  },

  // General Errors
  general: {
    networkError: "Verbindung fehlgeschlagen. Überprüfe deine Internetverbindung.",
    serverError: "Server-Fehler. Bitte versuche es später erneut.",
    unknownError: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
  },
} as const;

import { z } from "zod";

/**
 * Schema für File Upload Validation
 */
export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 100 * 1024 * 1024, {
      message: "Datei ist zu groß. Maximum: 100MB",
    })
    .refine(
      (file) => {
        const allowedTypes = [
          "video/mp4",
          "video/webm",
          "video/quicktime",
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/m4a",
          "audio/webm",
        ];
        return allowedTypes.includes(file.type);
      },
      {
        message:
          "Ungültiger Dateityp. Erlaubt: MP4, WebM, MP3, WAV, M4A",
      }
    )
    .refine(
      (file) => {
        const allowedExtensions = [
          ".mp4",
          ".webm",
          ".mov",
          ".mp3",
          ".wav",
          ".m4a",
        ];
        const extension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        return allowedExtensions.includes(extension);
      },
      {
        message: "Ungültige Dateiendung",
      }
    )
    .refine(
      (file) => {
        // Validiere Dateiname (keine gefährlichen Zeichen)
        const filenameRegex = /^[a-zA-Z0-9._-]+$/;
        return filenameRegex.test(file.name);
      },
      {
        message:
          "Ungültiger Dateiname. Nur Buchstaben, Zahlen, Punkte, Unterstriche und Bindestriche erlaubt",
      }
    ),
});

/**
 * Schema für Chat API Validation
 */
export const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Nachricht darf nicht leer sein")
    .max(10000, "Nachricht ist zu lang. Maximum: 10000 Zeichen")
    .refine(
      (msg) => {
        // Prüfe auf potenziell gefährliche Inhalte
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /data:text\/html/i,
        ];
        return !dangerousPatterns.some((pattern) => pattern.test(msg));
      },
      {
        message: "Nachricht enthält unerlaubte Inhalte",
      }
    ),
  sessionId: z
    .string()
    .min(1, "sessionId ist erforderlich")
    .max(255, "sessionId ist zu lang")
    .regex(/^[a-zA-Z0-9_-]+$/, "Ungültige sessionId"),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(10000),
      })
    )
    .max(100, "Chat-Historie ist zu lang")
    .optional()
    .default([]),
});

/**
 * Schema für Text Generation Validation
 */
export const generationSchema = z.object({
  transcriptId: z.string().uuid("Ungültige transcriptId"),
  format: z.enum(["social-post", "blog-article", "newsletter", "summary"]),
  length: z.enum(["short", "medium", "long"]),
  tone: z.string().max(100).optional(),
  customPrompt: z.string().max(5000).optional(),
});

/**
 * Helper-Funktion zum Sanitizen von Strings
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Entferne < und >
    .replace(/javascript:/gi, "") // Entferne javascript:
    .replace(/on\w+\s*=/gi, "") // Entferne Event-Handler
    .trim();
}

/**
 * Validiere Dateiname
 */
export function validateFilename(filename: string): boolean {
  // Keine Pfad-Traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false;
  }

  // Nur erlaubte Zeichen
  const filenameRegex = /^[a-zA-Z0-9._-]+$/;
  return filenameRegex.test(filename);
}

/**
 * Validiere MIME-Type basierend auf Magic Bytes (vereinfacht)
 * In Production sollte eine richtige Library wie file-type verwendet werden
 */
export async function validateFileType(file: File): Promise<boolean> {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/m4a",
    "audio/webm",
  ];

  // Prüfe MIME-Type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  // Optional: Magic Bytes prüfen (erste Bytes der Datei)
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 12));

    // MP4 Magic Bytes: 00 00 00 ?? 66 74 79 70
    if (
      bytes[4] === 0x66 &&
      bytes[5] === 0x74 &&
      bytes[6] === 0x79 &&
      bytes[7] === 0x70
    ) {
      return file.type.startsWith("video/");
    }

    // MP3 Magic Bytes: FF FB oder FF F3 oder ID3
    if (
      (bytes[0] === 0xff && (bytes[1] === 0xfb || bytes[1] === 0xf3)) ||
      (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33)
    ) {
      return file.type.startsWith("audio/");
    }

    // WAV Magic Bytes: 52 49 46 46
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46
    ) {
      return file.type.startsWith("audio/");
    }

    // Wenn Magic Bytes nicht erkannt werden, vertraue auf MIME-Type
    return true;
  } catch {
    // Bei Fehler vertraue auf MIME-Type
    return true;
  }
}


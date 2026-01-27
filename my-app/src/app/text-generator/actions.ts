"use server";

import { generateText, type FormatType } from "@/lib/text-templates";

/**
 * Server Action für Text-Generierung
 * Stage 2: Echte Funktionalität mit Server-Side Processing
 */

export interface GenerateTextResult {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Generiert Text basierend auf Format und Transkript
 * @param format - Das gewählte Format (instagram, twitter, blog, caption)
 * @param transcript - Das Transkript als String
 * @returns Result-Objekt mit generiertem Text oder Fehlermeldung
 */
export async function generateTextAction(
  format: FormatType,
  transcript: string
): Promise<GenerateTextResult> {
  try {
    // Validierung
    if (!format || !["instagram", "twitter", "blog", "caption"].includes(format)) {
      console.error("[generateTextAction] Ungültiges Format:", format);
      return {
        success: false,
        error: "Ungültiges Format ausgewählt",
      };
    }

    if (!transcript || transcript.trim().length === 0) {
      console.error("[generateTextAction] Leeres Transkript");
      return {
        success: false,
        error: "Transkript darf nicht leer sein",
      };
    }

    // Server-Side Logging für Debugging
    console.log(`[generateTextAction] Generiere ${format} Text aus Transkript (${transcript.length} Zeichen)`);

    // Template-Generierung aufrufen
    const generatedText = generateText(format, transcript);

    if (!generatedText || generatedText.trim().length === 0) {
      console.error("[generateTextAction] Generierung fehlgeschlagen - leerer Text");
      return {
        success: false,
        error: "Text-Generierung hat keinen Inhalt erzeugt",
      };
    }

    console.log(`[generateTextAction] Erfolgreich generiert: ${generatedText.length} Zeichen`);

    return {
      success: true,
      text: generatedText,
    };
  } catch (error) {
    console.error("[generateTextAction] Fehler:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unbekannter Fehler bei der Text-Generierung",
    };
  }
}


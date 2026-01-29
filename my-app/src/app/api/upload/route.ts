import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { validateRequiredEnv } from "@/lib/env";
import {
  uploadSchema,
  validateFilename,
  validateFileType,
} from "@/lib/validation";
import { UPLOAD_CONFIG } from "@/lib/upload-config";

// Vercel-Konfiguration für größere Dateien
export const runtime = "nodejs";
export const maxDuration = 60; // 60 Sekunden Timeout für große Dateien

export async function POST(request: NextRequest) {
  console.log("[Upload API] ===== Upload Request gestartet =====");
  try {
    // Validiere erforderliche Environment-Variablen
    const env = validateRequiredEnv();
    console.log("[Upload API] Environment-Variablen validiert");
    console.log("[Upload API] N8N_UPLOAD_WEBHOOK_URL:", env.N8N_UPLOAD_WEBHOOK_URL);
    console.log("[Upload API] N8N_TRANSCRIPTION_WEBHOOK_URL:", env.N8N_TRANSCRIPTION_WEBHOOK_URL);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("[Upload API] Datei erhalten:", {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    if (!file) {
      console.error("[Upload API] Keine Datei bereitgestellt");
      return NextResponse.json(
        { success: false, error: "Keine Datei bereitgestellt" },
        { status: 400 }
      );
    }

    // Validiere Dateiname
    if (!validateFilename(file.name)) {
      return NextResponse.json(
        {
          success: false,
          error: "Ungültiger Dateiname. Nur Buchstaben, Zahlen, Punkte, Unterstriche und Bindestriche erlaubt",
        },
        { status: 400 }
      );
    }

    // Validiere File mit Zod Schema
    const validationResult = uploadSchema.safeParse({ file });
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ||
        "Ungültige Datei";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Zusätzliche Magic Bytes Validierung
    const isValidType = await validateFileType(file);
    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error: "Dateityp konnte nicht verifiziert werden. Bitte verwenden Sie eine gültige Audio- oder Videodatei.",
        },
        { status: 400 }
      );
    }

    // Erstelle neue FormData für n8n
    // n8n Form-Trigger erwartet das Feld "Audio/Video Datei"
    const n8nFormData = new FormData();
    n8nFormData.append("Audio/Video Datei", file);

    console.log("[Upload API] Sende Request an n8n:", env.N8N_UPLOAD_WEBHOOK_URL);

    // Upload zu n8n Form-Webhook
    const response = await fetch(env.N8N_UPLOAD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "X-Request-Type": "upload", // Header zur Unterscheidung im n8n Workflow
      },
      body: n8nFormData,
    });

    console.log("[Upload API] n8n Response erhalten:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Upload Fehler: ${response.status} - ${errorText}`);
    }

    // n8n Form-Trigger gibt HTML zurück, Webhooks geben JSON zurück
    const contentType = response.headers.get("content-type") || "";
    let status = "✅ Erfolgreich gespeichert";
    let fileName = file.name;
    let transcript: string | undefined = undefined;

    // Debug: Log Response-Info
    console.log("[Upload API] Response Content-Type:", contentType);
    console.log("[Upload API] Response Status:", response.status);

    if (contentType.includes("application/json") || contentType.includes("text/plain") || contentType.includes("text/")) {
      // JSON-Response oder Text-Response (Webhook)
      try {
        const responseText = await response.text();
        console.log("[Upload API] Raw Response Text (erste 500 Zeichen):", responseText.substring(0, 500));
        
        let data: any;
        
        // Versuche zuerst als JSON zu parsen
        try {
          data = JSON.parse(responseText);
          console.log("[Upload API] Response als JSON geparst");
        } catch (parseError) {
          // Wenn JSON-Parsing fehlschlägt, ist es wahrscheinlich reiner Text (Transkript)
          console.log("[Upload API] Response ist kein JSON, behandele als reines Transkript");
          transcript = responseText.trim();
          if (transcript.length > 0) {
            console.log("[Upload API] ✅ Transkript als reiner Text erkannt, Länge:", transcript.length);
            return NextResponse.json({
              success: true,
              status: "✅ Erfolgreich transkribiert",
              fileName: file.name,
              transcript: transcript
            });
          }
          // Falls leer, weiter mit Standard-Werten
          data = null;
        }

        // Debug-Logging - immer aktiv für Troubleshooting
        if (data) {
          console.log("[Upload API] n8n Response:", JSON.stringify(data, null, 2));
        }

        // Wenn data ein String ist, ist es wahrscheinlich das Transkript
        if (typeof data === "string" && data.trim().length > 0) {
          transcript = data.trim();
          console.log("[Upload API] ✅ Transkript als String in JSON erkannt, Länge:", transcript.length);
          return NextResponse.json({
            success: true,
            status: "✅ Erfolgreich transkribiert",
            fileName: file.name,
            transcript: transcript
          });
        }

        // Validierung: Prüfe ob data existiert und ein valides Format hat
        if (!data || (typeof data !== "object" && !Array.isArray(data))) {
          // Wenn kein valides Format, aber wir haben bereits das Transkript geprüft
          // Verwende Standardwerte
          status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";
          fileName = file.name;
        } else {
          // Extrahiere status mit Validierung
          if (data && typeof data === "object") {
            if (typeof data.status === "string") {
              status = data.status;
            } else if (data.json && typeof data.json.status === "string") {
              status = data.json.status;
            }
          } else if (Array.isArray(data) && data.length > 0) {
            // Array-Response (n8n Standard-Format)
            const firstItem = data[0];
            if (firstItem?.json?.status && typeof firstItem.json.status === "string") {
              status = firstItem.json.status;
            } else if (firstItem?.status && typeof firstItem.status === "string") {
              status = firstItem.status;
            }
          }

          // Extrahiere fileName mit Validierung
          if (data && typeof data === "object") {
            if (typeof data.fileName === "string") {
              fileName = data.fileName;
            } else if (data.json && typeof data.json.fileName === "string") {
              fileName = data.json.fileName;
            }
          } else if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            if (firstItem?.json?.fileName && typeof firstItem.json.fileName === "string") {
              fileName = firstItem.json.fileName;
            } else if (firstItem?.fileName && typeof firstItem.fileName === "string") {
              fileName = firstItem.fileName;
            }
          }

          // Extrahiere transcript mit Validierung - erweiterte Suche
          const extractTranscript = (obj: any): string | undefined => {
            if (!obj || typeof obj !== "object") return undefined;

            // ElevenLabs spezifische Struktur: words Array
            if (Array.isArray(obj.words) && obj.words.length > 0) {
              // Versuche zuerst words[0].text (falls nur ein Wort vorhanden)
              const firstWord = obj.words[0];
              if (firstWord && typeof firstWord.text === "string" && firstWord.text.trim().length > 0) {
                // Wenn nur ein Wort, verwende es direkt
                if (obj.words.length === 1) {
                  return firstWord.text;
                }
                // Wenn mehrere Wörter, kombiniere alle
                const combinedText = obj.words
                  .map((w: any) => w?.text || "")
                  .filter((t: string) => t.trim().length > 0)
                  .join(" ");
                if (combinedText.trim().length > 0) {
                  return combinedText;
                }
              }
            }

            // Direkte Felder - explizite Checks
            const specificFields = ["transcript", "text", "content", "output", "result", "response", "transcription"];
            for (const field of specificFields) {
              if (typeof obj[field] === "string" && obj[field].trim().length > 0) {
                return obj[field];
              }
            }

            // Verschachtelte Felder - Rekursive Suche
            const nestedFields = ["json", "body", "data", "result", "output"];
            for (const field of nestedFields) {
              if (obj[field] && typeof obj[field] === "object") {
                const nested = extractTranscript(obj[field]);
                if (nested) return nested;
              }
            }

            // Heuristische Suche in allen String-Feldern
            // Suche nach Feldern, die relevante Schlüsselwörter enthalten
            for (const key in obj) {
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes("transcript") ||
                lowerKey.includes("text") ||
                lowerKey.includes("content") ||
                lowerKey.includes("out") ||
                lowerKey.includes("res")) {

                // Weniger strikte Längenprüfung (min 5 Zeichen statt 50)
                // Damit auch kurze Tests funktionieren
                if (typeof obj[key] === "string" && obj[key].trim().length > 5) {
                  return obj[key];
                }
              }
            }

            return undefined;
          };

          if (Array.isArray(data) && data.length > 0) {
            // Array-Response: Prüfe alle Items
            for (const item of data) {
              const extracted = extractTranscript(item);
              if (extracted) {
                transcript = extracted;
                break;
              }
            }
          } else if (data && typeof data === "object") {
            transcript = extractTranscript(data);
          }

          // Debug-Logging für Transkript - immer aktiv
          if (transcript) {
            console.log("[Upload API] ✅ Transkript gefunden, Länge:", transcript.length);
            console.log("[Upload API] Transkript (erste 200 Zeichen):", transcript.substring(0, 200));
          } else {
            console.warn("[Upload API] ⚠️ Kein Transkript in Response gefunden");
            console.log("[Upload API] Verfügbare Felder:", Object.keys(data).join(", "));
            if (Array.isArray(data) && data.length > 0) {
              console.log("[Upload API] Array-Item Felder:", Object.keys(data[0] || {}).join(", "));
            }
          }

          // Validierung: fileName sollte nicht leer sein
          if (!fileName || fileName.trim().length === 0) {
            fileName = file.name; // Fallback auf Original-Dateiname
          }
        }
      } catch (jsonError) {
        // Falls JSON-Parsing fehlschlägt, verwende Standardwerte
        if (process.env.NODE_ENV === "development") {
          console.warn("Konnte JSON-Response nicht parsen:", jsonError);
        }
        // Verwende Standardwerte - Upload war erfolgreich (Status 200)
        status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";
        fileName = file.name;
      }
    } else {
      // HTML-Response (Form-Trigger) - Upload war erfolgreich wenn Status 200/201
      console.log("[Upload API] HTML-Response erhalten (Form-Trigger)");
      const htmlText = await response.text();
      console.log("[Upload API] HTML-Response Länge:", htmlText.length);
      status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";

      // Versuche Transkript aus HTML zu extrahieren (falls n8n es dort einbettet)
      // Oft sendet n8n Form-Trigger das Ergebnis in einem <script> Tag oder data-Attribut
      const scriptMatch = htmlText.match(/<script[^>]*>[\s\S]*?transcript["\s:]+["']([^"']+)["']/i);
      if (scriptMatch && scriptMatch[1]) {
        transcript = scriptMatch[1];
        console.log("[Upload API] Transkript aus HTML extrahiert");
      }
    }

    // Finales Debug-Logging
    const responseData = {
      success: true,
      status,
      fileName,
      ...(transcript && { transcript }),
    };

    console.log("[Upload API] Finale Response:", {
      success: true,
      status,
      fileName,
      hasTranscript: !!transcript,
      transcriptLength: transcript?.length || 0,
      transcriptPreview: transcript ? transcript.substring(0, 100) : undefined
    });

    return NextResponse.json(responseData);
  } catch (error) {
    // Sende Fehler an Sentry
    Sentry.captureException(error, {
      tags: {
        api_route: "/api/upload",
      },
      extra: {
        endpoint: "/api/upload",
        method: "POST",
      },
    });

    // In Development auch in Console loggen
    if (process.env.NODE_ENV === "development") {
      console.error("Upload API Fehler:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler beim Upload",
      },
      { status: 500 }
    );
  }
}

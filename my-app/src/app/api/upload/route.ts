import { NextRequest, NextResponse } from "next/server";
import { validateRequiredEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // Validiere erforderliche Environment-Variablen
    const env = validateRequiredEnv();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Keine Datei bereitgestellt" },
        { status: 400 }
      );
    }

    // Erstelle neue FormData für n8n
    // n8n Form-Trigger erwartet das Feld "Audio/Video Datei"
    const n8nFormData = new FormData();
    n8nFormData.append("Audio/Video Datei", file);

    // Upload zu n8n Form-Webhook
    const response = await fetch(env.N8N_UPLOAD_WEBHOOK_URL, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Upload Fehler: ${response.status} - ${errorText}`);
    }

    // n8n Form-Trigger gibt HTML zurück, Webhooks geben JSON zurück
    const contentType = response.headers.get("content-type") || "";
    let status = "✅ Erfolgreich gespeichert";
    let fileName = file.name;

    if (contentType.includes("application/json")) {
      // JSON-Response (Webhook)
      try {
        const data = await response.json();
        
        // Validierung: Prüfe ob data existiert und ein valides Format hat
        if (!data || (typeof data !== "object" && !Array.isArray(data))) {
          throw new Error("Ungültiges Response-Format von n8n Upload Webhook");
        }

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

        // Validierung: fileName sollte nicht leer sein
        if (!fileName || fileName.trim().length === 0) {
          fileName = file.name; // Fallback auf Original-Dateiname
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
      status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";
    }

    return NextResponse.json({
      success: true,
      status,
      fileName,
    });
  } catch (error) {
    // In Production: Hier würde man zu einem Error-Tracking-Service loggen
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

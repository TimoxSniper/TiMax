import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { validateRequiredEnv } from "@/lib/env";
import { uploadSchema, validateFilename, validateFileType } from "@/lib/validation";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { extractOutputFromN8nResponse, extractMetadataFromN8nResponse } from "@/lib/n8n";

// Vercel-Konfiguration für größere Dateien
export const runtime = "nodejs";
export const maxDuration = 60; // 60 Sekunden Timeout für große Dateien

// Haupt-Handler mit CSRF-Schutz
async function uploadHandler(request: NextRequest) {
  logger.log("[Upload API] ===== Upload Request gestartet =====");
  try {
    // 1. CLERK AUTH - User ID holen
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert. Bitte melde dich an." },
        { status: 401 }
      );
    }

    // SICHERHEIT: User ID nur in Development loggen
    if (process.env.NODE_ENV === "development") {
      logger.log("[Upload API] User authentifiziert:", userId);
    }

    // 2. Supabase Client erstellen
    const supabase = await createClient();

    // Validiere erforderliche Environment-Variablen
    const env = validateRequiredEnv();
    // SICHERHEIT: Webhook URLs niemals loggen!
    // logger.log("[Upload API] N8N_UPLOAD_WEBHOOK_URL:", env.N8N_UPLOAD_WEBHOOK_URL);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    logger.log("[Upload API] Datei erhalten:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      logger.error("[Upload API] Keine Datei bereitgestellt");
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
          error:
            "Ungültiger Dateiname. Nur Buchstaben, Zahlen, Punkte, Unterstriche und Bindestriche erlaubt",
        },
        { status: 400 }
      );
    }

    // Validiere File mit Zod Schema
    const validationResult = uploadSchema.safeParse({ file });
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || "Ungültige Datei";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    // Zusätzliche Magic Bytes Validierung
    const isValidType = await validateFileType(file);
    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Dateityp konnte nicht verifiziert werden. Bitte verwenden Sie eine gültige Audio- oder Videodatei.",
        },
        { status: 400 }
      );
    }

    // 3. UPLOAD IN SUPABASE EINTRAG ERSTELLEN
    const { data: uploadRecord, error: uploadError } = await supabase
      .from("uploads")
      .insert({
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        status: "processing",
      })
      .select("id")
      .single();

    if (uploadError) {
      logger.error("[Upload API] Fehler beim Erstellen des Upload-Eintrags:", uploadError);
      throw new Error("Upload konnte nicht erstellt werden");
    }

    const uploadId = uploadRecord.id;
    logger.log("[Upload API] Upload-Eintrag erstellt:", uploadId);

    // Erstelle neue FormData für n8n
    // n8n Form-Trigger erwartet das Feld "Audio/Video Datei"
    const n8nFormData = new FormData();
    n8nFormData.append("Audio/Video Datei", file);

    // SICHERHEIT: Webhook URL niemals loggen!
    // logger.log("[Upload API] Sende Request an n8n:", env.N8N_UPLOAD_WEBHOOK_URL);

    // Upload zu n8n Form-Webhook mit Timeout
    // WICHTIG: X-Upload-ID wird gesendet, damit n8n den bestehenden Eintrag aktualisieren kann
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 Sekunden Timeout

    const response = await fetch(env.N8N_UPLOAD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "X-Request-Type": "upload",
        "X-User-ID": userId, // User ID für Multi-User Isolation
        "X-Upload-ID": uploadId, // Upload ID für Supabase Update
        "X-File-Name": file.name, // Original-Dateiname
      },
      body: n8nFormData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    logger.log("[Upload API] n8n Response erhalten:", {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      ok: response.ok,
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
    logger.log("[Upload API] Response Content-Type:", contentType);
    logger.log("[Upload API] Response Status:", response.status);

    if (
      contentType.includes("application/json") ||
      contentType.includes("text/plain") ||
      contentType.includes("text/")
    ) {
      // JSON-Response oder Text-Response (Webhook)
      try {
        const responseText = await response.text();
        logger.log(
          "[Upload API] Raw Response Text (erste 500 Zeichen):",
          responseText.substring(0, 500)
        );

        let data: unknown;

        // Versuche zuerst als JSON zu parsen
        try {
          data = JSON.parse(responseText);
          logger.log("[Upload API] Response als JSON geparst");
        } catch {
          // Wenn JSON-Parsing fehlschlägt, ist es wahrscheinlich reiner Text (Transkript)
          logger.log("[Upload API] Response ist kein JSON, behandele als reines Transkript");
          transcript = responseText.trim();
          if (transcript.length > 0) {
            logger.log(
              "[Upload API] ✅ Transkript als reiner Text erkannt, Länge:",
              transcript.length
            );
            return NextResponse.json({
              success: true,
              status: "✅ Erfolgreich transkribiert",
              fileName: file.name,
              transcript: transcript,
            });
          }
          data = null;
        }

        if (data) {
          // Extrahiere Transkript
          transcript = extractOutputFromN8nResponse(data, "transcript");

          // Extrahiere Metadaten
          const metadata = extractMetadataFromN8nResponse(data);
          if (metadata.status) status = metadata.status;
          if (metadata.fileName) fileName = metadata.fileName;

          // Debug-Logging für Transkript - immer aktiv
          if (transcript) {
            logger.log("[Upload API] ✅ Transkript gefunden, Länge:", transcript.length);
          } else {
            logger.warn("[Upload API] ⚠️ Kein Transkript in Response gefunden");
          }
        }
      } catch (jsonError) {
        // Falls Verarbeitung fehlschlägt, verwende Standardwerte
        logger.warn("Fehler bei n8n Response Verarbeitung:", jsonError);
        status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";
        fileName = file.name;
      }
    } else {
      // HTML-Response (Form-Trigger)
      logger.log("[Upload API] HTML-Response erhalten (Form-Trigger)");
      const htmlText = await response.text();
      status = "✅ Datei erfolgreich hochgeladen und wird verarbeitet";

      const scriptMatch = htmlText.match(/<script[^>]*>[\s\S]*?transcript["\s:]+["']([^"']+)["']/i);
      if (scriptMatch && scriptMatch[1]) {
        transcript = scriptMatch[1];
        logger.log("[Upload API] Transkript aus HTML extrahiert");
      }
    }

    // Finales Debug-Logging
    const responseData = {
      success: true,
      status,
      fileName,
      uploadId, // WICHTIG: Frontend kann damit den Status abfragen
      ...(transcript && { transcript }),
    };

    logger.log("[Upload API] Finale Response:", {
      success: true,
      status,
      fileName,
      uploadId,
      hasTranscript: !!transcript,
      transcriptLength: transcript?.length || 0,
      transcriptPreview: transcript ? transcript.substring(0, 100) : undefined,
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
      logger.error("Upload API Fehler:", error);
    }

    // Versuche den Upload-Status auf "failed" zu setzen
    // (nur wenn wir eine uploadId haben und supabase initialisiert wurde)
    try {
      const { userId } = await auth();
      if (userId) {
        const supabase = await createClient();
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";

        // Suche nach dem neuesten Upload dieses Users mit Status "processing"
        const { data: latestUpload } = await supabase
          .from("uploads")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "processing")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (latestUpload?.id) {
          await supabase
            .from("uploads")
            .update({
              status: "failed",
              error_message: errorMessage,
            })
            .eq("id", latestUpload.id);

          logger.log("[Upload API] Upload als fehlgeschlagen markiert:", latestUpload.id);
        }
      }
    } catch (updateError) {
      // Ignoriere Fehler beim Status-Update
      logger.error("[Upload API] Fehler beim Markieren als fehlgeschlagen:", updateError);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 }
    );
  }
}

// Export mit CSRF-Schutz
export const POST = withCsrfProtection(uploadHandler);

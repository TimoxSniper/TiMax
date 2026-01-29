import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { validateRequiredEnv } from "@/lib/env";
import { chatSchema, sanitizeString } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Validiere erforderliche Environment-Variablen
    const env = validateRequiredEnv();

    const body = await request.json();
    
    // Validiere Input mit Zod Schema
    const validationResult = chatSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message ||
        "Ungültige Eingabedaten";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { message, sessionId, chatHistory = [] } = validationResult.data;

    // Sanitize Message
    const sanitizedMessage = sanitizeString(message);

    // Request an n8n Webhook senden
    const response = await fetch(env.N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-Type": "chat", // Header zur Unterscheidung im n8n Workflow
      },
      body: JSON.stringify({
        body: {
          message: sanitizedMessage,
          sessionId,
          chatHistory: chatHistory.map((msg) => ({
            ...msg,
            content: sanitizeString(msg.content),
          })),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Webhook Fehler: ${response.status} - ${errorText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error("Ungültige JSON-Antwort von n8n Webhook");
    }

    // Validierung: Prüfe ob data existiert und ein valides Format hat
    if (!data || (typeof data !== "string" && typeof data !== "object")) {
      throw new Error("Ungültiges Response-Format von n8n Webhook");
    }

    // n8n gibt die Antwort in verschiedenen Formaten zurück
    // Wir müssen die Struktur anpassen und validieren
    let output = "";
    
    if (typeof data === "string") {
      // Direkter String-Output
      output = data.trim();
    } else if (data && typeof data === "object") {
      // Objekt-Response - verschiedene mögliche Strukturen
      if (typeof data.output === "string") {
        output = data.output.trim();
      } else if (data.body && typeof data.body.output === "string") {
        output = data.body.output.trim();
      } else if (Array.isArray(data) && data.length > 0) {
        // Array-Response (n8n Standard-Format)
        const firstItem = data[0];
        if (firstItem?.json?.output && typeof firstItem.json.output === "string") {
          output = firstItem.json.output.trim();
        } else if (firstItem?.output && typeof firstItem.output === "string") {
          output = firstItem.output.trim();
        }
      } else if (data.json && typeof data.json.output === "string") {
        output = data.json.output.trim();
      }
    }

    // Validierung: Output muss nicht leer sein
    if (!output || output.length === 0) {
      throw new Error("n8n Webhook hat leere Antwort zurückgegeben");
    }

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (error) {
    // Sende Fehler an Sentry
    Sentry.captureException(error, {
      tags: {
        api_route: "/api/chat",
      },
      extra: {
        endpoint: "/api/chat",
        method: "POST",
      },
    });

    // In Development auch in Console loggen
    if (process.env.NODE_ENV === "development") {
      console.error("Chat API Fehler:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler bei der Chat-Anfrage",
      },
      { status: 500 }
    );
  }
}

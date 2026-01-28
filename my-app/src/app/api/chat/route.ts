import { NextRequest, NextResponse } from "next/server";
import { validateRequiredEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // Validiere erforderliche Environment-Variablen
    const env = validateRequiredEnv();

    const body = await request.json();
    const { message, sessionId, chatHistory = [] } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: "message und sessionId sind erforderlich" },
        { status: 400 }
      );
    }

    // Request an n8n Webhook senden
    const response = await fetch(env.N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: {
          message,
          sessionId,
          chatHistory,
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
    // In Production: Hier würde man zu einem Error-Tracking-Service loggen
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

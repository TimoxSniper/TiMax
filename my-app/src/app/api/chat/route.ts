import { NextRequest, NextResponse } from "next/server";

const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL;

if (!N8N_CHAT_WEBHOOK_URL) {
  console.warn("WARNUNG: N8N_CHAT_WEBHOOK_URL nicht gesetzt!");
}

export async function POST(request: NextRequest) {
  try {
    if (!N8N_CHAT_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, error: "Chat-Webhook nicht konfiguriert" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, sessionId, chatHistory = [] } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: "message und sessionId sind erforderlich" },
        { status: 400 }
      );
    }

    // Request an n8n Webhook senden
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
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

    const data = await response.json();

    // n8n gibt die Antwort in verschiedenen Formaten zurück
    // Wir müssen die Struktur anpassen
    let output = "";
    
    if (typeof data === "string") {
      output = data;
    } else if (data.output) {
      output = data.output;
    } else if (data.body?.output) {
      output = data.body.output;
    } else if (Array.isArray(data) && data[0]?.json?.output) {
      output = data[0].json.output;
    } else if (data.json?.output) {
      output = data.json.output;
    } else {
      // Fallback: JSON stringify
      output = JSON.stringify(data);
    }

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (error) {
    console.error("Chat API Fehler:", error);
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

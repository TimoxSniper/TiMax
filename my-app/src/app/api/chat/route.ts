import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { validateRequiredEnv } from "@/lib/env";
import { chatSchema, sanitizeString } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. CLERK AUTH - User ID holen
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert. Bitte melde dich an." },
        { status: 401 }
      );
    }
    
    console.log("[Chat API] User authentifiziert:", userId);

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

    // Request an n8n Webhook senden MIT User ID
    const response = await fetch(env.N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId, // WICHTIG: User ID für Multi-User Isolation
        message: sanitizedMessage,
        sessionId,
        chatHistory: chatHistory.map((msg) => ({
          ...msg,
          content: sanitizeString(msg.content),
        })),
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
    let output = "";
    
    if (typeof data === "string") {
      output = data.trim();
    } else if (data && typeof data === "object") {
      if (typeof data.output === "string") {
        output = data.output.trim();
      } else if (data.body && typeof data.body.output === "string") {
        output = data.body.output.trim();
      } else if (Array.isArray(data) && data.length > 0) {
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

    if (!output || output.length === 0) {
      throw new Error("n8n Webhook hat leere Antwort zurückgegeben");
    }

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chat" },
      extra: { endpoint: "/api/chat", method: "POST" },
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Chat API Fehler:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler bei der Chat-Anfrage",
      },
      { status: 500 }
    );
  }
}

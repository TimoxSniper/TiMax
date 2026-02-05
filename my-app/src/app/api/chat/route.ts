import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateRequiredEnv } from "@/lib/env";
import { chatSchema, sanitizeString } from "@/lib/validation";
import { withCsrfProtection } from "@/lib/csrf";
import { logger } from "@/lib/logger";

// Haupt-Handler für Chat
async function chatHandler(request: NextRequest) {
  try {
    // 1. CLERK AUTH - User ID holen
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert. Bitte melde dich an." },
        { status: 401 }
      );
    }

    logger.log("[Chat API] User authentifiziert:", userId);

    // 2. Supabase Admin Client erstellen (bypassed RLS, Sicherheit durch Clerk-Auth)
    const supabase = createAdminClient();

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

    const { message, sessionId, chatHistory = [], chat_id } = validationResult.data;

    // Sanitize Message
    const sanitizedMessage = sanitizeString(message);

    // 3. CHAT IN SUPABASE ERSTELLEN/FINDEN
    let currentChatId = chat_id;

    if (!currentChatId) {
      // Neuen Chat erstellen
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          user_id: userId,
          session_id: sessionId,
          title: sanitizedMessage.substring(0, 50) + "...", // Erste Nachricht als Titel
        })
        .select("id")
        .single();

      if (chatError) {
        logger.error("[Chat API] Fehler beim Erstellen des Chats:", chatError);
        throw new Error("Chat konnte nicht erstellt werden");
      }

      currentChatId = newChat.id;
      logger.log("[Chat API] Neuer Chat erstellt:", currentChatId);
    }

    // 4. USER MESSAGE IN SUPABASE SPEICHERN
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        chat_id: currentChatId,
        role: "user",
        content: sanitizedMessage,
      });

    if (messageError) {
      logger.error("[Chat API] Fehler beim Speichern der Nachricht:", messageError);
    }

    // 5. REQUEST AN N8N SENDEN
    const response = await fetch(env.N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        chat_id: currentChatId, // WICHTIG: chat_id für n8n
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
      chat_id: currentChatId, // WICHTIG: Frontend braucht die chat_id
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/chat" },
      extra: { endpoint: "/api/chat", method: "POST" },
    });

    if (process.env.NODE_ENV === "development") {
      logger.error("Chat API Fehler:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 }
    );
  }
}

// Export POST mit CSRF-Schutz
export const POST = withCsrfProtection(chatHandler);

// GET Handler mit CSRF-Schutz
async function getChatsHandler(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chat_id");

    if (chatId) {
      // Einzelnen Chat mit Nachrichten laden
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .select(`
          *,
          messages (
            id,
            role,
            content,
            created_at
          )
        `)
        .eq("id", chatId)
        .eq("user_id", userId)
        .order("created_at", { foreignTable: "messages", ascending: true })
        .single();

      if (chatError) {
        logger.error("[Chat API] Fehler beim Laden des Chats:", chatError);
        return NextResponse.json(
          { success: false, error: "Chat nicht gefunden oder Zugriff verweigert" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, chat });
    } else {
      // Alle Chats des Users laden
      const { data: chats, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, chats });
    }
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Chats" },
      { status: 500 }
    );
  }
}

// Export GET mit CSRF-Schutz (für Idempotent-Operationen ist CSRF optional aber empfohlen)
export const GET = withCsrfProtection(getChatsHandler);
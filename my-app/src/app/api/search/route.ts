import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Rate limit: 30 searches per minute
const RATE_LIMIT_CONFIG = {
  maxRequests: 30,
  windowMs: 60 * 1000,
};

interface SearchResult {
  id: string;
  type: "chat" | "upload";
  title: string;
  preview: string;
  createdAt: string;
  relevance: number;
}

/**
 * GET /api/search
 * Search across chats and uploads for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(`search:${userId}`, RATE_LIMIT_CONFIG);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Zu viele Suchanfragen. Bitte warte einen Moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type"); // "chat", "upload", or null for all
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: "Suchanfrage muss mindestens 2 Zeichen lang sein" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const results: SearchResult[] = [];

    // Search pattern for ILIKE
    const searchPattern = `%${query}%`;

    // Search in chats (title and messages)
    if (!type || type === "chat") {
      // Search chat titles
      const { data: chatsByTitle, error: chatsTitleError } = await supabase
        .from("chats")
        .select("id, title, created_at")
        .eq("user_id", userId)
        .ilike("title", searchPattern)
        .limit(limit);

      if (chatsTitleError) {
        logger.error("[Search API] Fehler bei Chat-Titel-Suche:", chatsTitleError);
      } else if (chatsByTitle) {
        for (const chat of chatsByTitle) {
          results.push({
            id: chat.id,
            type: "chat",
            title: chat.title || "Neuer Chat",
            preview: `Chat vom ${new Date(chat.created_at).toLocaleDateString("de-DE")}`,
            createdAt: chat.created_at,
            relevance: calculateRelevance(chat.title || "", query, 2), // Higher weight for title match
          });
        }
      }

      // Search in message content
      const { data: messageMatches, error: messagesError } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          chat:chats!inner(id, title, user_id)
        `
        )
        .eq("chat.user_id", userId)
        .ilike("content", searchPattern)
        .limit(limit);

      if (messagesError) {
        logger.error("[Search API] Fehler bei Nachrichten-Suche:", messagesError);
      } else if (messageMatches) {
        const addedChatIds = new Set(results.filter((r) => r.type === "chat").map((r) => r.id));

        for (const msg of messageMatches) {
          const chat = msg.chat as unknown as { id: string; title: string };
          if (!addedChatIds.has(chat.id)) {
            addedChatIds.add(chat.id);
            results.push({
              id: chat.id,
              type: "chat",
              title: chat.title || "Neuer Chat",
              preview: truncateWithHighlight(msg.content, query, 100),
              createdAt: msg.created_at,
              relevance: calculateRelevance(msg.content, query, 1),
            });
          }
        }
      }
    }

    // Search in uploads (filename and transcript)
    if (!type || type === "upload") {
      // Search by filename
      const { data: uploadsByName, error: uploadsNameError } = await supabase
        .from("uploads")
        .select("id, file_name, transcript, created_at, status")
        .eq("user_id", userId)
        .ilike("file_name", searchPattern)
        .limit(limit);

      if (uploadsNameError) {
        logger.error("[Search API] Fehler bei Upload-Name-Suche:", uploadsNameError);
      } else if (uploadsByName) {
        for (const upload of uploadsByName) {
          results.push({
            id: upload.id,
            type: "upload",
            title: upload.file_name,
            preview: upload.transcript
              ? truncateWithHighlight(upload.transcript, query, 100)
              : `Status: ${upload.status}`,
            createdAt: upload.created_at,
            relevance: calculateRelevance(upload.file_name, query, 2),
          });
        }
      }

      // Search in transcripts
      const { data: uploadsByTranscript, error: uploadsTranscriptError } = await supabase
        .from("uploads")
        .select("id, file_name, transcript, created_at")
        .eq("user_id", userId)
        .not("transcript", "is", null)
        .ilike("transcript", searchPattern)
        .limit(limit);

      if (uploadsTranscriptError) {
        logger.error("[Search API] Fehler bei Transkript-Suche:", uploadsTranscriptError);
      } else if (uploadsByTranscript) {
        const addedUploadIds = new Set(results.filter((r) => r.type === "upload").map((r) => r.id));

        for (const upload of uploadsByTranscript) {
          if (!addedUploadIds.has(upload.id)) {
            results.push({
              id: upload.id,
              type: "upload",
              title: upload.file_name,
              preview: truncateWithHighlight(upload.transcript || "", query, 100),
              createdAt: upload.created_at,
              relevance: calculateRelevance(upload.transcript || "", query, 1),
            });
          }
        }
      }
    }

    // Sort by relevance and limit
    results.sort((a, b) => b.relevance - a.relevance);
    const limitedResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      query,
      results: limitedResults,
      total: results.length,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api_route: "/api/search" },
    });

    return NextResponse.json({ success: false, error: "Fehler bei der Suche" }, { status: 500 });
  }
}

/**
 * Calculate relevance score for search result
 */
function calculateRelevance(text: string, query: string, weight: number): number {
  if (!text || !query) return 0;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let score = 0;

  // Exact match gets highest score
  if (lowerText === lowerQuery) {
    score += 100 * weight;
  }
  // Starts with query
  else if (lowerText.startsWith(lowerQuery)) {
    score += 80 * weight;
  }
  // Contains query as word
  else if (new RegExp(`\\b${escapeRegExp(lowerQuery)}\\b`).test(lowerText)) {
    score += 60 * weight;
  }
  // Contains query
  else if (lowerText.includes(lowerQuery)) {
    score += 40 * weight;
  }

  // Count occurrences
  const occurrences = (lowerText.match(new RegExp(escapeRegExp(lowerQuery), "g")) || []).length;
  score += Math.min(occurrences * 5, 20) * weight;

  return score;
}

/**
 * Truncate text with highlighted query match
 */
function truncateWithHighlight(text: string, query: string, maxLength: number): string {
  if (!text) return "";

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  // Calculate start position to show context around match
  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + query.length + (maxLength - query.length - 20));

  let result = text.substring(start, end);
  if (start > 0) result = "..." + result;
  if (end < text.length) result = result + "...";

  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

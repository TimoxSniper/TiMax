/**
 * Standardized interface for n8n response items
 */
export interface N8nResponseItem {
  output?: string;
  transcript?: string;
  text?: string;
  content?: string;
  result?: string;
  response?: string;
  transcription?: string;
  status?: string;
  fileName?: string;
  upload_id?: string;
  chat_id?: string;
  json?: Record<string, unknown> & {
    output?: string;
    transcript?: string;
    status?: string;
    fileName?: string;
  };
  body?: N8nResponseItem;
  data?: N8nResponseItem;
  words?: Array<{ text?: string }>;
}

/**
 * Parses various n8n response formats into a standardized output string.
 * This helper is used in both Chat and Upload API routes to handle the
 * flexible (but fragile) response structure of n8n.
 */
export function extractOutputFromN8nResponse(
  data: unknown,
  fieldName: "output" | "transcript" = "output"
): string | undefined {
  if (!data) return undefined;

  // 1. Handle string response
  if (typeof data === "string" && data.trim().length > 0) {
    return data.trim();
  }

  // 2. Handle array response (n8n standard format)
  if (Array.isArray(data)) {
    for (const item of data) {
      const extracted = extractOutputFromN8nResponse(item, fieldName);
      if (extracted) return extracted;
    }
    return undefined;
  }

  // 3. Handle object response
  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    // Try explicit fields first
    const primaryFields = [fieldName, "text", "content", "response", "result", "transcription"];
    for (const field of primaryFields) {
      if (typeof record[field] === "string" && (record[field] as string).trim().length > 0) {
        return (record[field] as string).trim();
      }
    }

    // Try nested fields commonly used by n8n
    const nestedFields = ["json", "body", "data"];
    for (const field of nestedFields) {
      if (record[field] && typeof record[field] === "object") {
        const extracted = extractOutputFromN8nResponse(record[field], fieldName);
        if (extracted) return extracted;
      }
    }

    // Special case for ElevenLabs word arrays
    if (fieldName === "transcript" && Array.isArray(record.words)) {
      const combinedText = record.words
        .map((w: unknown) => {
          if (typeof w === "string") return w;
          if (w && typeof w === "object" && "text" in w) return (w as { text: string }).text;
          return "";
        })
        .join(" ")
        .trim();

      if (combinedText.length > 0) return combinedText;
    }

    // Heuristic: Search for keys containing the fieldName
    for (const key in record) {
      if (key.toLowerCase().includes(fieldName.toLowerCase())) {
        if (typeof record[key] === "string" && (record[key] as string).trim().length > 5) {
          return (record[key] as string).trim();
        }
      }
    }
  }

  return undefined;
}

/**
 * Extracts metadata (status, fileName, ids) from n8n response
 */
export function extractMetadataFromN8nResponse(data: unknown): {
  status?: string;
  fileName?: string;
  uploadId?: string;
  chatId?: string;
} {
  const result: { status?: string; fileName?: string; uploadId?: string; chatId?: string } = {};

  if (!data || typeof data !== "object") return result;

  const items = Array.isArray(data) ? data : [data];

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const json = (record.json || {}) as Record<string, unknown>;

    // Status
    result.status = result.status || (record.status as string) || (json.status as string);

    // File Name
    result.fileName =
      result.fileName ||
      (record.fileName as string) ||
      (json.fileName as string) ||
      (record.file_name as string);

    // IDs
    result.uploadId =
      result.uploadId ||
      (record.upload_id as string) ||
      (json.upload_id as string) ||
      (record.uploadId as string);
    result.chatId =
      result.chatId ||
      (record.chat_id as string) ||
      (json.chat_id as string) ||
      (record.chatId as string);
  }

  return result;
}

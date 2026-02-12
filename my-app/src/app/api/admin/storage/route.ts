import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createAdminClient();

    // Calculate total upload file sizes
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("file_size");

    if (uploadsError) throw uploadsError;

    const uploadsBytes = (uploads || []).reduce((sum, upload) => {
      return sum + (upload.file_size || 0);
    }, 0);

    // Estimate database size (rough approximation)
    // In production, you'd query actual database size
    const { count: chatCount } = await supabase
      .from("chats")
      .select("*", { count: "exact", head: true });

    const { count: messageCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true });

    // Rough estimate: 1KB per chat, 500 bytes per message
    const databaseBytes = ((chatCount || 0) * 1024) + ((messageCount || 0) * 500);

    // Other data (logs, cache, etc.) - estimated
    const otherBytes = 50 * 1024 * 1024; // 50MB estimate

    const usedBytes = uploadsBytes + databaseBytes + otherBytes;

    // Set total storage limit (adjust based on your plan)
    // For this example, 10GB = 10 * 1024 * 1024 * 1024
    const totalBytes = 10 * 1024 * 1024 * 1024; // 10GB

    const availableBytes = totalBytes - usedBytes;
    const percentageUsed = Math.min(100, Math.round((usedBytes / totalBytes) * 100));

    return NextResponse.json({
      success: true,
      storage: {
        totalBytes,
        usedBytes,
        availableBytes,
        percentageUsed,
        breakdown: {
          uploads: uploadsBytes,
          database: databaseBytes,
          other: otherBytes,
        },
      },
    });
  } catch (error) {
    logger.error("[Admin Storage API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Speicherinformationen" },
      { status: 500 }
    );
  }
}

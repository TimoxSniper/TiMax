import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = createAdminClient();

    const [
      { count: totalUsers },
      { count: totalChats },
      { count: totalMessages },
      { count: totalUploads },
      { data: uploadsByStatus },
      { data: uploadsByType },
      { count: activeUsers },
    ] = await Promise.all([
      supabase.from("chats").select("user_id", { count: "exact", head: true }),
      supabase.from("chats").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("uploads").select("*", { count: "exact", head: true }),
      supabase.from("uploads").select("status").not("status", "is", null),
      supabase.from("uploads").select("file_type").not("file_type", "is", null),
      supabase
        .from("chats")
        .select("user_id")
        .gte("updated_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .select("user_id", { count: "exact", head: true }),
    ]);

    const statusCounts: Record<string, number> = {};
    uploadsByStatus?.forEach((u: any) => {
      const status = u.status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const typeCounts: Record<string, number> = {};
    uploadsByType?.forEach((u: any) => {
      const type = u.file_type?.split("/")[0] || "unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const { data: storageData } = await supabase
      .from("uploads")
      .select("file_size")
      .eq("status", "completed")
      .not("file_size", "is", null);

    const totalStorageBytes =
      storageData?.reduce((sum: number, u: any) => sum + (u.file_size || 0), 0) || 0;

    const stats = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalChats: totalChats || 0,
      totalMessages: totalMessages || 0,
      totalUploads: totalUploads || 0,
      uploadsByStatus: statusCounts,
      uploadsByType: typeCounts,
      totalStorageBytes,
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    logger.error("[Admin Dashboard API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Statistiken" },
      { status: 500 }
    );
  }
}

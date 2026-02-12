import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    const days = range === "30d" ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const supabase = createAdminClient();

    // Generate array of dates for the range
    const dates: Date[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }

    // Fetch uploads grouped by date
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("created_at")
      .gte("created_at", startDate.toISOString());

    if (uploadsError) throw uploadsError;

    // Fetch chats grouped by date
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("created_at")
      .gte("created_at", startDate.toISOString());

    if (chatsError) throw chatsError;

    // Count uploads per day
    const uploadsByDate = (uploads || []).reduce((acc: Record<string, number>, upload) => {
      const date = new Date(upload.created_at);
      const dateKey = date.toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    // Count chats per day
    const chatsByDate = (chats || []).reduce((acc: Record<string, number>, chat) => {
      const date = new Date(chat.created_at);
      const dateKey = date.toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    // Build the data array
    const data = dates.map((date) => {
      const dateKey = date.toISOString().split("T")[0];
      return {
        date: dateKey,
        uploads: uploadsByDate[dateKey] || 0,
        chats: chatsByDate[dateKey] || 0,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error("[Admin Analytics API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Analytics" },
      { status: 500 }
    );
  }
}

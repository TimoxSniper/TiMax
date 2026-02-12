import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = createAdminClient();

    // Generate alerts from system data
    const alerts = [];

    // Check for failed uploads
    const { data: failedUploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("id, file_name, created_at")
      .eq("status", "failed")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(5);

    if (!uploadsError && failedUploads && failedUploads.length > 0) {
      alerts.push({
        id: `failed-uploads-${Date.now()}`,
        type: "error" as const,
        title: `${failedUploads.length} fehlgeschlagene Uploads`,
        message: `Es gab ${failedUploads.length} fehlgeschlagene Upload(s) in den letzten 24 Stunden.`,
        timestamp: failedUploads[0].created_at,
        read: false,
      });
    }

    // Check for system health
    const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      if (healthData.success && healthData.health) {
        const degradedServices = healthData.health.checks.filter(
          (c: { status: string }) => c.status === "degraded"
        );
        const downServices = healthData.health.checks.filter(
          (c: { status: string }) => c.status === "down"
        );

        if (downServices.length > 0) {
          alerts.push({
            id: `health-down-${Date.now()}`,
            type: "error" as const,
            title: "System-Services offline",
            message: `${downServices.length} Service(s) sind derzeit nicht verfügbar.`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        } else if (degradedServices.length > 0) {
          alerts.push({
            id: `health-degraded-${Date.now()}`,
            type: "warning" as const,
            title: "Eingeschränkte System-Verfügbarkeit",
            message: `${degradedServices.length} Service(s) laufen mit Einschränkungen.`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
      }
    }

    // Check for unusual activity (spike in uploads)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const { count: todayCount } = await supabase
      .from("uploads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString());

    const { count: yesterdayCount } = await supabase
      .from("uploads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoDaysAgo.toISOString())
      .lt("created_at", yesterday.toISOString());

    if (todayCount && yesterdayCount && todayCount > yesterdayCount * 2) {
      alerts.push({
        id: `activity-spike-${Date.now()}`,
        type: "info" as const,
        title: "Erhöhte Upload-Aktivität erkannt",
        message: `Uploads haben sich im Vergleich zu gestern verdoppelt (${todayCount} vs ${yesterdayCount}).`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Sort by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      alerts,
    });
  } catch (error) {
    logger.error("[Admin Alerts API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Benachrichtigungen" },
      { status: 500 }
    );
  }
}

/**
 * Admin Dashboard Page
 *
 * Overview page with stats, recent activity, and quick actions
 */

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { StatsCards } from "@/components/admin/dashboard/stats-cards";
import { ActivityTimeline } from "@/components/admin/dashboard/activity-timeline";
import { getAllClerkUsers } from "@/lib/admin/clerk-helpers";
import type { DashboardStats } from "@/types/admin";

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch from API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const { data } = await res.json();

    // Fetch total users from Clerk
    const { totalCount } = await getAllClerkUsers({ limit: 1 });
    data.totalUsers = totalCount;

    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return empty stats on error
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalChats: 0,
      totalMessages: 0,
      totalUploads: 0,
      uploadsByStatus: {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
      },
      recentActivity: [],
      systemHealth: {
        status: "down",
        databaseConnected: false,
        storageConnected: false,
        apiResponseTime: 0,
        activeUsers: 0,
        uptime: 0,
      },
    };
  }
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground font-sans">
          Übersicht über alle System-Metriken und Aktivitäten
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Activity and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <ActivityTimeline activities={stats.recentActivity} />

        {/* System Health */}
        <Card className="p-6 shadow-editorial-md">
          <h3 className="font-serif text-lg font-bold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-muted-foreground">Status</span>
              <span
                className={`text-sm font-semibold ${
                  stats.systemHealth.status === "healthy"
                    ? "text-accent"
                    : stats.systemHealth.status === "degraded"
                      ? "text-yellow-600"
                      : "text-destructive"
                }`}
              >
                {stats.systemHealth.status === "healthy"
                  ? "Healthy"
                  : stats.systemHealth.status === "degraded"
                    ? "Degraded"
                    : "Down"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-muted-foreground">Database</span>
              <span
                className={`text-sm font-semibold ${
                  stats.systemHealth.databaseConnected ? "text-accent" : "text-destructive"
                }`}
              >
                {stats.systemHealth.databaseConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-muted-foreground">Storage</span>
              <span
                className={`text-sm font-semibold ${
                  stats.systemHealth.storageConnected ? "text-accent" : "text-destructive"
                }`}
              >
                {stats.systemHealth.storageConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans text-muted-foreground">API Response</span>
              <span className="text-sm font-semibold font-mono">
                {stats.systemHealth.apiResponseTime}ms
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Status Distribution */}
      <Card className="p-6 shadow-editorial-md">
        <h3 className="font-serif text-lg font-bold mb-4">Upload Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.uploadsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <p className="text-2xl font-serif font-bold">{count}</p>
              <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mt-1">
                {status}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

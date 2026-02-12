"use client";

/**
 * Admin Dashboard - Editorial Modernism
 *
 * Overview page with real-time statistics and platform metrics.
 */

import { StatsCards } from "@/components/admin/StatsCards";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { SystemHealthWidget } from "@/components/admin/SystemHealthWidget";
import { AlertCenter } from "@/components/admin/AlertCenter";
import { StorageWidget } from "@/components/admin/StorageWidget";
import { QuickActions } from "@/components/admin/QuickActions";

export default function AdminDashboard() {
  return (
    <>
      {/* Page Header - Editorial style */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-foreground mb-2">
          Dashboard-Übersicht
        </h1>
        <p className="text-base text-muted-foreground">
          Plattform-Aktivität und Benutzermetriken in Echtzeit überwachen
        </p>
      </div>

      <div className="space-y-6">
        {/* Alert Center - Priority notifications */}
        <AlertCenter />

        {/* Stats Cards with auto-refresh */}
        <StatsCards />

        {/* Quick Actions and Storage in Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <StorageWidget />
        </div>

        {/* Recent Activity and System Health in Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <SystemHealthWidget />
        </div>
      </div>
    </>
  );
}

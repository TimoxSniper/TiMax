"use client";

/**
 * Admin Dashboard - Editorial Modernism
 *
 * Overview page with real-time statistics and platform metrics.
 */

import { StatsCards } from "@/components/admin/StatsCards";

export default function AdminDashboard() {
  return (
    <>
      {/* Page Header - Editorial style */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-foreground mb-2">
          Dashboard Overview
        </h1>
        <p className="text-base text-muted-foreground">
          Monitor platform activity and user metrics in real-time
        </p>
      </div>

      {/* Stats Cards with auto-refresh */}
      <StatsCards />
    </>
  );
}

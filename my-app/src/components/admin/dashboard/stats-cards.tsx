/**
 * Dashboard Stats Cards Component
 *
 * Grid of stat cards displaying key metrics
 */

import { StatCard } from "@/components/admin/shared/stat-card";
import { Users, MessageSquare, Upload, Activity } from "lucide-react";
import type { DashboardStats } from "@/types/admin";

export interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers || "-"}
        icon={<Users className="h-5 w-5" />}
      />

      <StatCard
        title="Active Users"
        value={stats.activeUsers}
        changeLabel="last 7 days"
        icon={<Activity className="h-5 w-5" />}
      />

      <StatCard
        title="Total Uploads"
        value={stats.totalUploads}
        icon={<Upload className="h-5 w-5" />}
      />

      <StatCard
        title="Total Chats"
        value={stats.totalChats}
        changeLabel={`${stats.totalMessages} messages`}
        icon={<MessageSquare className="h-5 w-5" />}
      />
    </div>
  );
}

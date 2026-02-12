"use client";

/**
 * Admin Stats Cards - Editorial Modernism Design
 *
 * Displays platform statistics with real-time updates:
 * - Total Users
 * - Total Chats
 * - Total Uploads
 * - Active Sessions
 *
 * Features:
 * - Auto-refresh every 30 seconds using useRealTimeData
 * - Trend indicators (up/down % from previous period)
 * - Brutalist shadows and bronze accents
 * - Loading states with skeletons
 * - Error handling with retry
 */

import { useRealTimeData } from "@/hooks/useRealTimeData";
import { Users, MessageSquare, Upload, BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  totalMessages: number;
  totalUploads: number;
  trends: {
    chats: {
      current: number;
      previous: number;
      percentageChange: number;
    };
    uploads: {
      current: number;
      previous: number;
      percentageChange: number;
    };
  };
}

interface ApiResponse {
  success: boolean;
  stats: Stats;
}

async function fetchStats(): Promise<Stats> {
  const response = await fetch("/api/admin/dashboard");

  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  if (!data.success) {
    throw new Error("API returned unsuccessful response");
  }

  return data.stats;
}

export function StatsCards() {
  const { data: stats, error, status, retry, isLoading } = useRealTimeData({
    fetchFn: fetchStats,
    refreshInterval: 30000, // 30 seconds
    enabled: true,
  });

  // Loading skeleton
  if (isLoading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse border border-border bg-card shadow-editorial-md"
          >
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-5 w-5 rounded bg-muted" />
              </div>
              <div className="mb-2 h-10 w-24 rounded bg-muted" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
            <div className="h-1 bg-primary/20" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Fehler beim Laden der Statistiken
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
            <Button
              onClick={retry}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Erneut versuchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: "Benutzer gesamt",
      value: stats.totalUsers,
      icon: Users,
      trend: null, // No trend data for users yet
      color: "text-primary",
    },
    {
      label: "Chats gesamt",
      value: stats.totalChats,
      icon: MessageSquare,
      trend: stats.trends.chats.percentageChange,
      color: "text-primary",
    },
    {
      label: "Uploads gesamt",
      value: stats.totalUploads,
      icon: Upload,
      trend: stats.trends.uploads.percentageChange,
      color: "text-primary",
    },
    {
      label: "Aktive Sitzungen",
      value: stats.activeUsers,
      icon: BarChart3,
      trend: null, // Could add trend for active users
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isPositiveTrend = card.trend !== null && card.trend > 0;
        const isNegativeTrend = card.trend !== null && card.trend < 0;

        return (
          <div
            key={card.label}
            className="border border-border bg-card shadow-editorial-md transition-all duration-300 hover:shadow-editorial-lift"
          >
            <div className="p-6">
              {/* Header with label and icon */}
              <div className="mb-4 flex items-start justify-between">
                <p className="text-uppercase-tracked text-xs text-muted-foreground">
                  {card.label}
                </p>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>

              {/* Main stat value */}
              <p className="mb-2 font-serif text-4xl font-semibold text-foreground">
                {card.value.toLocaleString('de-DE')}
              </p>

              {/* Trend indicator */}
              <div className="flex items-center gap-2">
                {card.trend !== null && (
                  <>
                    {isPositiveTrend && (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    )}
                    {isNegativeTrend && (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isPositiveTrend
                          ? "text-primary"
                          : isNegativeTrend
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {card.trend > 0 ? "+" : ""}
                      {card.trend.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs. letzten Monat
                    </span>
                  </>
                )}
                {card.trend === null && (
                  <span className="text-xs text-muted-foreground">
                    Letzte 7 Tage
                  </span>
                )}
              </div>
            </div>

            {/* Bronze accent line */}
            <div className="h-1 bg-primary/20" />
          </div>
        );
      })}

      {/* Connection status indicator (subtle) */}
      {status === "connected" && (
        <div className="col-span-full">
          <p className="text-center text-xs text-muted-foreground">
            Zuletzt aktualisiert: {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {" • Auto-Aktualisierung: 30s"}
          </p>
        </div>
      )}
    </div>
  );
}

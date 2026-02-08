"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, MessageSquare, FileAudio, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsChartProps {
  stats: {
    totalUsers: number;
    totalChats: number;
    totalMessages: number;
    totalUploads: number;
    uploadsByStatus: Record<string, number>;
    uploadsByType: Record<string, number>;
  } | null;
  isLoading: boolean;
}

export function AnalyticsChart({ stats, isLoading }: AnalyticsChartProps) {
  // Mock data for visualization - in production, fetch real time-series data
  const mockWeeklyData = {
    users: [12, 19, 15, 25, 22, 30, 28],
    chats: [45, 52, 48, 61, 58, 67, 64],
    uploads: [23, 28, 25, 34, 31, 38, 36],
  };

  const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const getMaxValue = (data: number[]) => Math.max(...data);
  const getPercentage = (value: number, max: number) => (value / max) * 100;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-editorial-md">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200/50 shadow-editorial-sm dark:border-blue-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
              Neue Benutzer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold">
                  {mockWeeklyData.users.reduce((a, b) => a + b, 0)}
                </span>
                <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +18%
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Diese Woche</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200/50 shadow-editorial-sm dark:border-purple-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
              <MessageSquare className="h-4 w-4" />
              Neue Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold">
                  {mockWeeklyData.chats.reduce((a, b) => a + b, 0)}
                </span>
                <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Diese Woche</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 shadow-editorial-sm dark:border-green-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
              <FileAudio className="h-4 w-4" />
              Neue Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold">
                  {mockWeeklyData.uploads.reduce((a, b) => a + b, 0)}
                </span>
                <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +24%
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">Diese Woche</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Visualization */}
      <Card className="shadow-editorial-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">Wachstumstrends</CardTitle>
              <CardDescription>Aktivitätsentwicklung der letzten 7 Tage</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Letzte 7 Tage
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Benutzer</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="uploads">Uploads</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <div className="space-y-4">
                {mockWeeklyData.users.map((value, index) => {
                  const maxValue = getMaxValue(mockWeeklyData.users);
                  const percentage = getPercentage(value, maxValue);

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-muted-foreground w-8 text-sm font-medium">
                        {days[index]}
                      </span>
                      <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-muted">
                        <div
                          className="bg-blue-500 dark:bg-blue-400 absolute inset-y-0 left-0 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="relative z-10 flex h-full items-center px-3 text-sm font-semibold">
                          {value} neue Benutzer
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="chats" className="mt-6">
              <div className="space-y-4">
                {mockWeeklyData.chats.map((value, index) => {
                  const maxValue = getMaxValue(mockWeeklyData.chats);
                  const percentage = getPercentage(value, maxValue);

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-muted-foreground w-8 text-sm font-medium">
                        {days[index]}
                      </span>
                      <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-muted">
                        <div
                          className="bg-purple-500 dark:bg-purple-400 absolute inset-y-0 left-0 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="relative z-10 flex h-full items-center px-3 text-sm font-semibold">
                          {value} neue Chats
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="mt-6">
              <div className="space-y-4">
                {mockWeeklyData.uploads.map((value, index) => {
                  const maxValue = getMaxValue(mockWeeklyData.uploads);
                  const percentage = getPercentage(value, maxValue);

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-muted-foreground w-8 text-sm font-medium">
                        {days[index]}
                      </span>
                      <div className="relative h-10 flex-1 overflow-hidden rounded-lg bg-muted">
                        <div
                          className="bg-green-500 dark:bg-green-400 absolute inset-y-0 left-0 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="relative z-10 flex h-full items-center px-3 text-sm font-semibold">
                          {value} neue Uploads
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-editorial-md">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Uploads nach Status</CardTitle>
            <CardDescription>Verteilung der Upload-Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && Object.entries(stats.uploadsByStatus).map(([status, count]) => {
                const total = stats.totalUploads;
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{status}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="bg-accent h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-editorial-md">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Uploads nach Typ</CardTitle>
            <CardDescription>Verteilung der Upload-Typen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && Object.entries(stats.uploadsByType).map(([type, count]) => {
                const total = stats.totalUploads;
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{type}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all dark:bg-green-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

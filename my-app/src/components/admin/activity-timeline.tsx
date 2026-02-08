"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileAudio, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface Upload {
  id: string;
  file_name: string;
  created_at: string;
  status: string;
}

interface ActivityTimelineProps {
  chats: Chat[];
  uploads: Upload[];
  isLoading: boolean;
  extended?: boolean;
}

export function ActivityTimeline({ chats, uploads, isLoading, extended = false }: ActivityTimelineProps) {
  // Group activities by date
  const activities = [
    ...chats.map((chat) => ({
      id: chat.id,
      type: "chat" as const,
      title: chat.title,
      timestamp: new Date(chat.created_at),
    })),
    ...uploads.map((upload) => ({
      id: upload.id,
      type: "upload" as const,
      title: upload.file_name,
      timestamp: new Date(upload.created_at),
      status: upload.status,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, extended ? 15 : 8);

  // Group by date
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const dateKey = activity.timestamp.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(activity);
      return acc;
    },
    {} as Record<string, typeof activities>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <Card className="shadow-editorial-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Aktivitäts-Timeline</CardTitle>
          <CardDescription>Chronologische Übersicht aller Aktivitäten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-editorial-md">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Aktivitäts-Timeline</CardTitle>
        <CardDescription>Chronologische Übersicht aller Aktivitäten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(groupedActivities).length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Noch keine Aktivitäten vorhanden
            </div>
          ) : (
            Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-accent h-2 w-2 rounded-full" />
                  <h4 className="text-muted-foreground text-sm font-semibold">{date}</h4>
                </div>
                <div className="ml-4 space-y-2 border-l-2 border-accent/20 pl-4">
                  {items.map((activity) => (
                    <div
                      key={`${activity.type}-${activity.id}`}
                      className="group relative space-y-1"
                    >
                      {/* Timeline dot */}
                      <div className="bg-accent absolute -left-[1.3rem] top-2 h-2 w-2 rounded-full" />

                      <div className="hover:bg-accent/5 rounded-lg border p-3 transition-colors">
                        <div className="flex items-start gap-3">
                          <div
                            className={`rounded-md p-1.5 ${
                              activity.type === "chat"
                                ? "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
                                : "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                            }`}
                          >
                            {activity.type === "chat" ? (
                              <MessageSquare className="h-3.5 w-3.5" />
                            ) : (
                              <FileAudio className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="truncate text-sm font-medium leading-tight">
                              {activity.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {formatTime(activity.timestamp)}
                              </span>
                              {activity.type === "upload" && activity.status && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    activity.status === "completed"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                      : activity.status === "processing"
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                                  }`}
                                >
                                  {activity.status === "completed"
                                    ? "✓"
                                    : activity.status === "processing"
                                      ? "..."
                                      : "✗"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileAudio, User, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

interface Upload {
  id: string;
  file_name: string;
  created_at: string;
  user_id: string;
  status: string;
}

interface RecentActivityProps {
  chats: Chat[];
  uploads: Upload[];
  isLoading: boolean;
  showAll?: boolean;
}

export function RecentActivity({ chats, uploads, isLoading, showAll = false }: RecentActivityProps) {
  // Combine and sort activities
  const activities = [
    ...chats.map((chat) => ({
      id: chat.id,
      type: "chat" as const,
      title: chat.title,
      timestamp: new Date(chat.created_at),
      userId: chat.user_id,
    })),
    ...uploads.map((upload) => ({
      id: upload.id,
      type: "upload" as const,
      title: upload.file_name,
      timestamp: new Date(upload.created_at),
      userId: upload.user_id,
      status: upload.status,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, showAll ? 10 : 6);

  const getActivityIcon = (type: "chat" | "upload") => {
    return type === "chat" ? MessageSquare : FileAudio;
  };

  const getActivityColor = (type: "chat" | "upload") => {
    return type === "chat"
      ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30"
      : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30";
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "processing":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "failed":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Gerade eben";
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std.`;
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  if (isLoading) {
    return (
      <Card className="shadow-editorial-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Letzte Aktivitäten</CardTitle>
          <CardDescription>Aktuelle Benutzeraktionen auf der Plattform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
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
        <CardTitle className="font-serif text-2xl">Letzte Aktivitäten</CardTitle>
        <CardDescription>Aktuelle Benutzeraktionen auf der Plattform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Noch keine Aktivitäten vorhanden
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);

              return (
                <Link
                  key={`${activity.type}-${activity.id}`}
                  href={
                    activity.type === "chat"
                      ? `/admin/chats/${activity.id}`
                      : `/admin/uploads`
                  }
                  className="group block"
                >
                  <div className="hover:bg-accent/5 flex items-start gap-4 rounded-lg border-2 border-transparent p-3 transition-all hover:border-accent/20 hover:shadow-sm">
                    <div className={`${colorClass} rounded-lg p-2`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold leading-tight">
                          {activity.title}
                        </p>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {activity.type === "chat" ? "Chat" : "Upload"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {activity.userId.slice(0, 8)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(activity.timestamp)}
                        </span>
                        {activity.type === "upload" && activity.status && (
                          <Badge className={`${getStatusColor(activity.status)} border-0 text-xs`}>
                            {activity.status === "completed"
                              ? "Abgeschlossen"
                              : activity.status === "processing"
                                ? "Verarbeitung"
                                : "Fehler"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

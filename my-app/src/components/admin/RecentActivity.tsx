"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  MessageSquare,
  UserPlus,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";
import Link from "next/link";

interface RecentUpload {
  id: string;
  file_name: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface RecentChat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

interface RecentUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface RecentActivityData {
  uploads: RecentUpload[];
  chats: RecentChat[];
  users: RecentUser[];
}

export function RecentActivity() {
  const [data, setData] = useState<RecentActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/recent-activity");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to load recent activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Neueste Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="uploads" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="space-y-3">
            {data.uploads.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Keine neuesten Uploads
              </p>
            ) : (
              data.uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/5"
                >
                  <Upload className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm truncate">{upload.file_name}</p>
                      <Badge
                        variant={
                          upload.status === "completed"
                            ? "default"
                            : upload.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {upload.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(upload.created_at)} • {upload.user_id.slice(0, 8)}...
                    </p>
                  </div>
                  <Link
                    href={`/admin/uploads`}
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-3">
            {data.chats.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Keine neuesten Chats
              </p>
            ) : (
              data.chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/5"
                >
                  <MessageSquare className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(chat.created_at)} • {chat.user_id.slice(0, 8)}...
                    </p>
                  </div>
                  <Link
                    href={`/admin/chats/${chat.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-3">
            {data.users.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Keine neuesten Benutzer
              </p>
            ) : (
              data.users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/5"
                >
                  <UserPlus className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.email} • {formatDateTime(user.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/users`}
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { logger } from "@/lib/logger";
import {
  ArrowLeft,
  MessageSquare,
  FileAudio,
  Activity,
  Calendar,
  Mail,
  User,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  formatDate,
  formatFileSize,
  uploadStatusColors,
  uploadStatusLabels,
} from "@/lib/admin/utils";

interface UserData {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  createdAt: number;
  lastActivity: string | null;
}

interface Stats {
  chatCount: number;
  uploadCount: number;
  messageCount: number;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

interface Upload {
  id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  status: string;
  created_at: string;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { showToast } = useToast();

  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStats(data.stats);
        setChats(data.chats || []);
        setUploads(data.uploads || []);
      } else if (res.status === 404) {
        showToast("Benutzer nicht gefunden", "error");
        router.push("/admin/users");
      } else {
        throw new Error("Fehler beim Laden");
      }
    } catch (error) {
      logger.error("Fehler beim Laden der Benutzerdaten:", error);
      showToast("Benutzerdaten konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  }, [userId, showToast, router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || "Unbekannter Benutzer";

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.push("/admin/users")}
        className="gap-2 text-sm md:text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Zurück zu Benutzer</span>
        <span className="sm:hidden">Zurück</span>
      </Button>

      {/* User Header */}
      <div className="flex flex-col items-start gap-4 sm:flex-row md:gap-6">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={displayName}
            width={80}
            height={80}
            className="h-16 w-16 rounded-full sm:h-20 sm:w-20"
          />
        ) : (
          <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-20 sm:w-20">
            <User className="text-muted-foreground h-8 w-8 sm:h-10 sm:w-10" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl font-bold break-words sm:text-3xl">{displayName}</h1>
          {user.email && (
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm md:text-base">
              <Mail className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
              <span className="truncate">{user.email}</span>
            </div>
          )}
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs md:text-sm">
              <Calendar className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
              <span>Registriert: {formatDate(user.createdAt)}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs md:text-sm">
              <Activity className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
              <span>Letzte Aktivität: {formatDate(user.lastActivity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="hover:shadow-editorial-md hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats</CardTitle>
              <MessageSquare className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chatCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {stats.messageCount} Nachrichten gesamt
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-editorial-md hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uploads</CardTitle>
              <FileAudio className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uploadCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">Dateien hochgeladen</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-editorial-md hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User ID</CardTitle>
              <User className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <code className="bg-muted block truncate rounded px-2 py-1 font-mono text-xs">
                {user.userId}
              </code>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chats */}
      <Card className="hover:shadow-editorial-md hover:translate-y-0">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Chats ({chats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Keine Chats vorhanden
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header - Desktop only */}
              <div className="text-muted-foreground border-border hidden grid-cols-[1fr_100px_140px_80px] gap-4 border-b px-4 py-2 text-sm font-medium md:grid">
                <div>Titel</div>
                <div className="text-center">Nachrichten</div>
                <div>Erstellt</div>
                <div className="text-center">Aktionen</div>
              </div>

              {/* Table Body */}
              <div className="divide-border divide-y">
                {chats.map((chat) => (
                  <div key={chat.id} className="hover:bg-muted/50 transition-colors">
                    {/* Mobile Card Layout */}
                    <div className="space-y-2 p-3 md:hidden">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 truncate text-sm font-medium" title={chat.title}>
                          {chat.title}
                        </div>
                        <Button variant="ghost" size="icon-xs" asChild title="Ansehen">
                          <Link href={`/admin/chats/${chat.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{chat.messageCount} Nachrichten</span>
                        </div>
                        <span>{formatDate(chat.created_at)}</span>
                      </div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="hidden grid-cols-[1fr_100px_140px_80px] items-center gap-4 px-4 py-3 md:grid">
                      <div className="truncate font-medium" title={chat.title}>
                        {chat.title}
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <MessageSquare className="text-muted-foreground h-4 w-4" />
                        <span>{chat.messageCount}</span>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(chat.created_at)}
                      </div>
                      <div className="flex items-center justify-center">
                        <Button variant="ghost" size="icon-xs" asChild title="Ansehen">
                          <Link href={`/admin/chats/${chat.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploads */}
      <Card className="hover:shadow-editorial-md hover:translate-y-0">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Uploads ({uploads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Keine Uploads vorhanden
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header - Desktop only */}
              <div className="text-muted-foreground border-border hidden grid-cols-[1fr_100px_120px_140px] gap-4 border-b px-4 py-2 text-sm font-medium md:grid">
                <div>Dateiname</div>
                <div>Größe</div>
                <div>Status</div>
                <div>Hochgeladen</div>
              </div>

              {/* Table Body */}
              <div className="divide-border divide-y">
                {uploads.map((upload) => (
                  <div key={upload.id} className="hover:bg-muted/50 transition-colors">
                    {/* Mobile Card Layout */}
                    <div className="space-y-2 p-3 md:hidden">
                      <div className="truncate text-sm font-medium" title={upload.file_name}>
                        {upload.file_name}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {formatFileSize(upload.file_size)}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${uploadStatusColors[upload.status] || uploadStatusColors.pending}`}
                          >
                            {uploadStatusLabels[upload.status] || upload.status}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {formatDate(upload.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Grid Layout */}
                    <div className="hidden grid-cols-[1fr_100px_120px_140px] items-center gap-4 px-4 py-3 md:grid">
                      <div className="truncate font-medium" title={upload.file_name}>
                        {upload.file_name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatFileSize(upload.file_size)}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${uploadStatusColors[upload.status] || uploadStatusColors.pending}`}
                        >
                          {uploadStatusLabels[upload.status] || upload.status}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(upload.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

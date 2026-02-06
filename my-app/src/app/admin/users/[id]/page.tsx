"use client";

import { useEffect, useState } from "react";
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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
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
  };

  const formatDate = (dateString: string | number | null) => {
    if (!dateString) return "Nie";
    const date = typeof dateString === "number" ? new Date(dateString) : new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Abgeschlossen";
      case "processing":
        return "Wird verarbeitet";
      case "failed":
        return "Fehlgeschlagen";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || "Unbekannter Benutzer";

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/admin/users")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Benutzer
      </Button>

      {/* User Header */}
      <div className="flex items-start gap-6">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={displayName}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div>
          <h1 className="font-serif text-3xl font-bold">{displayName}</h1>
          {user.email && (
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Registriert: {formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Letzte Aktivität: {formatDate(user.lastActivity)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:translate-y-0 hover:shadow-editorial-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chatCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.messageCount} Nachrichten gesamt
              </p>
            </CardContent>
          </Card>

          <Card className="hover:translate-y-0 hover:shadow-editorial-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uploads</CardTitle>
              <FileAudio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uploadCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Dateien hochgeladen</p>
            </CardContent>
          </Card>

          <Card className="hover:translate-y-0 hover:shadow-editorial-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User ID</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded block truncate">
                {user.userId}
              </code>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chats */}
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader>
          <CardTitle>Chats ({chats.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {chats.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Keine Chats vorhanden
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                <div>Titel</div>
                <div className="text-center">Nachrichten</div>
                <div>Erstellt</div>
                <div className="text-center">Aktionen</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="grid grid-cols-[1fr_100px_140px_80px] gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium truncate" title={chat.title}>
                      {chat.title}
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{chat.messageCount}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
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
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploads */}
      <Card className="hover:translate-y-0 hover:shadow-editorial-md">
        <CardHeader>
          <CardTitle>Uploads ({uploads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Keine Uploads vorhanden
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_100px_120px_140px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                <div>Dateiname</div>
                <div>Größe</div>
                <div>Status</div>
                <div>Hochgeladen</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="grid grid-cols-[1fr_100px_120px_140px] gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium truncate" title={upload.file_name}>
                      {upload.file_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(upload.file_size)}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                          upload.status
                        )}`}
                      >
                        {getStatusLabel(upload.status)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(upload.created_at)}
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

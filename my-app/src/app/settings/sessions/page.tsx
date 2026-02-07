"use client";

import { useState } from "react";
import { useUser, useSession, useSessionList } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Laptop, Smartphone, Monitor, Globe, LogOut, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SessionsSettingsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { session: currentSession } = useSession();
  const { sessions, isLoaded: isSessionsLoaded } = useSessionList();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const isLoaded = isUserLoaded && isSessionsLoaded;

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user || !sessions) {
    return null;
  }

  const getDeviceIcon = (deviceType?: string) => {
    if (!deviceType) return Monitor;
    const type = deviceType.toLowerCase();
    if (type.includes("mobile") || type.includes("phone")) return Smartphone;
    if (type.includes("tablet")) return Laptop;
    return Monitor;
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Gerade eben";
    if (diffMins < 60) return `Vor ${diffMins} Min.`;
    if (diffHours < 24) return `Vor ${diffHours} Std.`;
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    return date.toLocaleDateString("de-DE");
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      const res = await fetch("/api/settings/sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Revoke fehlgeschlagen");
      }
      toast.success("Sitzung wurde beendet");
    } catch {
      toast.error("Fehler beim Beenden der Sitzung");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    setIsRevokingAll(true);
    try {
      const otherSessions = sessions.filter((s) => s.id !== currentSession?.id);
      await Promise.all(
        otherSessions.map((s) =>
          fetch("/api/settings/sessions/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: s.id }),
          })
        )
      );
      toast.success(`${otherSessions.length} Sitzung(en) wurden beendet`);
      setShowRevokeAllDialog(false);
    } catch {
      toast.error("Fehler beim Beenden der Sitzungen");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const activeSessions = sessions.filter((s) => s.status === "active");
  const otherActiveSessions = activeSessions.filter((s) => s.id !== currentSession?.id);

  // Erweiterung für Anzeige (Clerk SessionResource hat diese Felder zur Laufzeit, Typen sind enger)
  type SessionForDisplay = (typeof sessions)[number] & {
    latestActivity?: { deviceType?: string; browserName?: string; city?: string };
    lastActiveAt?: number;
  };

  return (
    <div className="space-y-6">
      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Aktuelle Sitzung
          </CardTitle>
          <CardDescription>Das Gerät, mit dem du gerade angemeldet bist</CardDescription>
        </CardHeader>
        <CardContent>
          {currentSession && (
            <div className="bg-primary/5 border-primary/20 flex items-center gap-4 rounded-lg border p-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Monitor className="text-primary h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Dieses Gerät</p>
                  <Badge variant="default" className="text-xs">
                    Aktiv
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Sitzung seit: {formatLastActive(new Date(currentSession.createdAt))}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Andere aktive Sitzungen
              </CardTitle>
              <CardDescription>Geräte, auf denen du ebenfalls angemeldet bist</CardDescription>
            </div>
            {otherActiveSessions.length > 0 && (
              <Dialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Alle beenden
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive h-5 w-5" />
                      Alle anderen Sitzungen beenden?
                    </DialogTitle>
                    <DialogDescription>
                      Du wirst auf {otherActiveSessions.length} anderen Gerät(en) abgemeldet. Diese
                      Aktion kann nicht rückgängig gemacht werden.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRevokeAllDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRevokeAllOtherSessions}
                      disabled={isRevokingAll}
                      className="gap-2"
                    >
                      {isRevokingAll ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Wird beendet...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4" />
                          Alle beenden
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {otherActiveSessions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <Laptop className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Keine anderen aktiven Sitzungen</p>
              <p className="mt-1 text-sm">Du bist nur auf diesem Gerät angemeldet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherActiveSessions.map((session) => {
                const s = session as SessionForDisplay;
                const DeviceIcon = getDeviceIcon(s.latestActivity?.deviceType);
                const lastActive = s.lastActiveAt
                  ? formatLastActive(new Date(s.lastActiveAt))
                  : "Unbekannt";

                return (
                  <div
                    key={session.id}
                    className="bg-muted/50 hover:border-border flex items-center gap-4 rounded-lg border p-4 transition-colors"
                  >
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <DeviceIcon className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {s.latestActivity?.deviceType || "Unbekanntes Gerät"}
                      </p>
                      <p className="text-muted-foreground text-xs">Zuletzt aktiv: {lastActive}</p>
                      {s.latestActivity?.browserName && (
                        <p className="text-muted-foreground text-xs">
                          {s.latestActivity.browserName}
                          {s.latestActivity.city && ` • ${s.latestActivity.city}`}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                      {revokingId === session.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Beenden</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tip */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
              <AlertTriangle className="text-primary h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Sicherheitstipp</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Wenn du ein Gerät nicht erkennst oder vermutest, dass jemand auf dein Konto
                zugegriffen hat, beende die Sitzung sofort und ändere dein Passwort.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

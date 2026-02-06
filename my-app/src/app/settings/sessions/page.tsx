"use client";

import { useState, useEffect } from "react";
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
  const { sessions, isLoaded: isSessionsLoaded, setActive } = useSessionList();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const isLoaded = isUserLoaded && isSessionsLoaded;

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
      const sessionToRevoke = sessions.find((s) => s.id === sessionId);
      if (sessionToRevoke) {
        await sessionToRevoke.revoke();
        toast.success("Sitzung wurde beendet");
      }
    } catch (error) {
      toast.error("Fehler beim Beenden der Sitzung");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    setIsRevokingAll(true);
    try {
      const otherSessions = sessions.filter((s) => s.id !== currentSession?.id);
      await Promise.all(otherSessions.map((s) => s.revoke()));
      toast.success(`${otherSessions.length} Sitzung(en) wurden beendet`);
      setShowRevokeAllDialog(false);
    } catch (error) {
      toast.error("Fehler beim Beenden der Sitzungen");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const activeSessions = sessions.filter((s) => s.status === "active");
  const otherActiveSessions = activeSessions.filter((s) => s.id !== currentSession?.id);

  return (
    <div className="space-y-6">
      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Aktuelle Sitzung
          </CardTitle>
          <CardDescription>
            Das Gerät, mit dem du gerade angemeldet bist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentSession && (
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Dieses Gerät</p>
                  <Badge variant="default" className="text-xs">
                    Aktiv
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
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
              <CardDescription>
                Geräte, auf denen du ebenfalls angemeldet bist
              </CardDescription>
            </div>
            {otherActiveSessions.length > 0 && (
              <Dialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Alle beenden
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Alle anderen Sitzungen beenden?
                    </DialogTitle>
                    <DialogDescription>
                      Du wirst auf {otherActiveSessions.length} anderen Gerät(en) abgemeldet.
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowRevokeAllDialog(false)}
                    >
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
            <div className="text-center py-8 text-muted-foreground">
              <Laptop className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine anderen aktiven Sitzungen</p>
              <p className="text-sm mt-1">
                Du bist nur auf diesem Gerät angemeldet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherActiveSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.latestActivity?.deviceType);
                const lastActive = session.lastActiveAt
                  ? formatLastActive(new Date(session.lastActiveAt))
                  : "Unbekannt";

                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border hover:border-border transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {session.latestActivity?.deviceType || "Unbekanntes Gerät"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Zuletzt aktiv: {lastActive}
                      </p>
                      {session.latestActivity?.browserName && (
                        <p className="text-xs text-muted-foreground">
                          {session.latestActivity.browserName}
                          {session.latestActivity.city && ` • ${session.latestActivity.city}`}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Sicherheitstipp</p>
              <p className="text-xs text-muted-foreground mt-1">
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

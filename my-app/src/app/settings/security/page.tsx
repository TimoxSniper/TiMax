"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Key, Smartphone, AlertTriangle, Trash2, ExternalLink } from "lucide-react";
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
import { Input } from "@/components/ui/input";

export default function SecuritySettingsPage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const handleOpenClerkProfile = () => {
    openUserProfile();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "KONTO LÖSCHEN") {
      toast.error("Bitte gib 'KONTO LÖSCHEN' ein, um fortzufahren.");
      return;
    }

    setIsDeleting(true);
    try {
      await user.delete();
      toast.success("Dein Konto wurde gelöscht.");
      // Clerk will handle the redirect
    } catch (error) {
      toast.error("Fehler beim Löschen des Kontos. Bitte versuche es erneut.");
      setIsDeleting(false);
    }
  };

  const hasTwoFactor = user.twoFactorEnabled;
  const hasPassword = user.passwordEnabled;

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Passwort
          </CardTitle>
          <CardDescription>
            Verwalte dein Passwort für die Anmeldung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                {hasPassword ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Passwort ist gesetzt
                  </span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    Kein Passwort gesetzt (Social Login)
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Passwörter werden über Clerk verwaltet.
              </p>
            </div>
            <Button variant="outline" onClick={handleOpenClerkProfile} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Passwort ändern
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Zwei-Faktor-Authentifizierung (2FA)
          </CardTitle>
          <CardDescription>
            Füge eine zusätzliche Sicherheitsebene zu deinem Konto hinzu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                {hasTwoFactor ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    2FA ist aktiviert
                  </span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    2FA ist nicht aktiviert
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Verwende eine Authenticator-App für zusätzliche Sicherheit.
              </p>
            </div>
            <Button variant="outline" onClick={handleOpenClerkProfile} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {hasTwoFactor ? "2FA verwalten" : "2FA aktivieren"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Verknüpfte Konten</CardTitle>
          <CardDescription>
            Verwalte deine verknüpften Social-Login-Konten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {user.externalAccounts.length > 0 ? (
              user.externalAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                      {account.provider === "google" && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      {account.provider === "github" && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{account.provider}</p>
                      <p className="text-xs text-muted-foreground">{account.emailAddress}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Keine verknüpften Konten. Du verwendest E-Mail + Passwort zur Anmeldung.
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleOpenClerkProfile}
            className="mt-4 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Verknüpfungen verwalten
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Gefahrenzone
          </CardTitle>
          <CardDescription>
            Unwiderrufliche Aktionen für dein Konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div>
              <p className="font-medium text-destructive">Konto löschen</p>
              <p className="text-xs text-muted-foreground mt-1">
                Alle deine Daten werden unwiderruflich gelöscht.
              </p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Konto löschen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Konto unwiderruflich löschen?
                  </DialogTitle>
                  <DialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Chats,
                    Uploads und Einstellungen werden gelöscht.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm">
                    Gib <span className="font-mono font-bold">KONTO LÖSCHEN</span> ein, um fortzufahren:
                  </p>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="KONTO LÖSCHEN"
                    className="font-mono"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setDeleteConfirmation("");
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== "KONTO LÖSCHEN"}
                    className="gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Wird gelöscht...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Endgültig löschen
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

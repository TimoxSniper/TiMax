"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, User, Mail, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ProfileSettingsPage() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update state when user loads
  useState(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  });

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Profil erfolgreich aktualisiert");
    } catch {
      toast.error("Fehler beim Speichern. Bitte versuche es erneut.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unbekannt";

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profilbild
          </CardTitle>
          <CardDescription>Dein Profilbild wird bei Clerk verwaltet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profilbild"
                width={80}
                height={80}
                className="border-border h-20 w-20 rounded-full border-2 object-cover"
              />
            ) : (
              <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-8 w-8" />
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm">
                Um dein Profilbild zu ändern, klicke auf deinen Avatar in der Navigation und wähle
                &quot;Konto verwalten&quot;.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Persönliche Informationen</CardTitle>
          <CardDescription>Aktualisiere deinen Namen und andere Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                Vorname
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Max"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Nachname
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mustermann"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Änderungen speichern
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Section (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail-Adresse
          </CardTitle>
          <CardDescription>Deine E-Mail wird von Clerk verwaltet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex items-center gap-2 rounded-lg p-3">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">
              {user.primaryEmailAddress?.emailAddress || "Keine E-Mail hinterlegt"}
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Um deine E-Mail zu ändern, klicke auf deinen Avatar und wähle &quot;Konto
            verwalten&quot;.
          </p>
        </CardContent>
      </Card>

      {/* Account Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kontoinformationen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Konto erstellt am:</span>
              <span>{createdAt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Benutzer-ID:</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

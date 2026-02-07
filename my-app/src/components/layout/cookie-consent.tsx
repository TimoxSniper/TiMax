"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { X, Cookie, Settings } from "lucide-react";
import { logger } from "@/lib/logger";

type CookiePreferences = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Immer aktiv
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    // Prüfe, ob bereits eine Entscheidung getroffen wurde
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Lade gespeicherte Präferenzen
      const savedPrefs = localStorage.getItem("cookie_preferences");
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setPreferences((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          // Ignoriere Fehler beim Parsen
          if (process.env.NODE_ENV === "development") {
            logger.error("Failed to parse cookie preferences:", e);
          }
        }
      }
      setShowBanner(true);
    }
  }, []); // Leeres Dependency Array ist korrekt

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie_consent", "true");
    localStorage.setItem("cookie_preferences", JSON.stringify(prefs));
    localStorage.setItem("cookie_consent_date", new Date().toISOString());

    // Setze Cookies basierend auf Präferenzen
    if (prefs.functional) {
      // Functional cookies setzen
      document.cookie = "cookie_consent=functional; path=/; max-age=31536000"; // 1 Jahr
    }
    if (prefs.analytics) {
      // Analytics cookies setzen
      document.cookie = "_analytics=1; path=/; max-age=63072000"; // 2 Jahre
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6">
      <Card className="mx-auto max-w-4xl border-2 border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-black">
        <div className="p-6 sm:p-8">
          {!showSettings ? (
            <>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Cookie className="text-foreground h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Cookie-Einstellungen
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Technisch notwendige
                    Cookies sind immer aktiv. Sie können Ihre Präferenzen jederzeit anpassen.
                  </p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    Weitere Informationen finden Sie in unserer{" "}
                    <Link href="/cookies" className="text-primary hover:underline">
                      Cookie-Richtlinie
                    </Link>{" "}
                    und{" "}
                    <Link href="/datenschutz" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={acceptAll}
                  className="flex-1 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Alle akzeptieren
                </Button>
                <Button onClick={acceptNecessary} variant="outline" className="flex-1">
                  Nur notwendige
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="ghost" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Einstellungen
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    Cookie-Einstellungen anpassen
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Wählen Sie, welche Cookies Sie zulassen möchten.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-start justify-between rounded-lg bg-black/5 p-4 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1 font-semibold">
                      Technisch notwendige Cookies
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und können
                      nicht deaktiviert werden.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label htmlFor="necessary-cookies" className="sr-only">
                      Technisch notwendige Cookies (immer aktiv)
                    </label>
                    <input
                      id="necessary-cookies"
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="h-5 w-5"
                      aria-label="Technisch notwendige Cookies (immer aktiv)"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-lg bg-black/5 p-4 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1 font-semibold">Funktionale Cookies</h4>
                    <p className="text-muted-foreground text-sm">
                      Diese Cookies speichern Ihre Präferenzen (z.B. Dark Mode) und verbessern die
                      Funktionalität.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label htmlFor="functional-cookies" className="sr-only">
                      Funktionale Cookies aktivieren
                    </label>
                    <input
                      id="functional-cookies"
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          functional: e.target.checked,
                        })
                      }
                      className="h-5 w-5"
                      aria-label="Funktionale Cookies aktivieren"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between rounded-lg bg-black/5 p-4 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1 font-semibold">Analytics Cookies</h4>
                    <p className="text-muted-foreground text-sm">
                      Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label htmlFor="analytics-cookies" className="sr-only">
                      Analytics Cookies aktivieren
                    </label>
                    <input
                      id="analytics-cookies"
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          analytics: e.target.checked,
                        })
                      }
                      className="h-5 w-5"
                      aria-label="Analytics Cookies aktivieren"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  onClick={saveCustomPreferences}
                  className="flex-1 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Präferenzen speichern
                </Button>
                <Button onClick={() => setShowSettings(false)} variant="outline" className="flex-1">
                  Abbrechen
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

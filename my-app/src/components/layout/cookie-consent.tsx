"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { X, Cookie, Settings } from "lucide-react";

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
          setPreferences(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          // Ignoriere Fehler beim Parsen
          if (process.env.NODE_ENV === "development") {
            console.error("Failed to parse cookie preferences:", e);
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2 bg-white dark:bg-black border-black/10 dark:border-white/10">
        <div className="p-6 sm:p-8">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <Cookie className="h-6 w-6 text-black dark:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    Cookie-Einstellungen
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                    Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Technisch notwendige Cookies sind immer aktiv. Sie können Ihre Präferenzen jederzeit anpassen.
                  </p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    Weitere Informationen finden Sie in unserer{" "}
                    <Link
                      href="/cookies"
                      className="text-primary hover:underline"
                    >
                      Cookie-Richtlinie
                    </Link>{" "}
                    und{" "}
                    <Link
                      href="/datenschutz"
                      className="text-primary hover:underline"
                    >
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={acceptAll}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                >
                  Alle akzeptieren
                </Button>
                <Button
                  onClick={acceptNecessary}
                  variant="outline"
                  className="flex-1"
                >
                  Nur notwendige
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="ghost"
                  className="flex-1"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Einstellungen
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    Cookie-Einstellungen anpassen
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
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

              <div className="space-y-4 mb-6">
                <div className="flex items-start justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-black dark:text-white">
                      Technisch notwendige Cookies
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
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
                      className="w-5 h-5"
                      aria-label="Technisch notwendige Cookies (immer aktiv)"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-black dark:text-white">
                      Funktionale Cookies
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70">
                      Diese Cookies speichern Ihre Präferenzen (z.B. Dark Mode) und verbessern die Funktionalität.
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
                      className="w-5 h-5"
                      aria-label="Funktionale Cookies aktivieren"
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-black dark:text-white">
                      Analytics Cookies
                    </h4>
                    <p className="text-sm text-black/70 dark:text-white/70">
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
                      className="w-5 h-5"
                      aria-label="Analytics Cookies aktivieren"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={saveCustomPreferences}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                >
                  Präferenzen speichern
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="flex-1"
                >
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


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { useToast } from "@/components/ui/toast";
import { Loader2, ArrowRight } from "lucide-react";
import { logger } from "@/lib/logger";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Bitte gib eine gültige E-Mail-Adresse ein.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: "homepage",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message || "Erfolgreich angemeldet!", "success");
        setEmail("");
      } else if (response.status === 409) {
        showToast(
          "Du bist bereits angemeldet! Wir informieren dich, sobald TiMax verfügbar ist.",
          "success"
        );
        setEmail("");
      } else if (response.status === 429) {
        showToast("Zu viele Anfragen. Bitte versuche es später erneut.", "error");
      } else if (response.status === 400) {
        showToast(data.error || "Ungültige E-Mail-Adresse.", "error");
      } else {
        throw new Error(data.error || "Unbekannter Fehler");
      }
    } catch (error) {
      showToast("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.", "error");
      if (process.env.NODE_ENV === "development") {
        logger.error("Email-Submit Fehler:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-border relative z-10 border-t px-4 py-12 sm:py-20 lg:py-28" id="cta">
      <div className="container mx-auto max-w-2xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-16">
            <div className="space-y-6 text-center sm:space-y-8">
              <div>
                <h2 className="text-foreground mb-3 font-serif text-3xl font-bold sm:mb-4 sm:text-5xl lg:text-6xl">
                  Bereit loszulegen?
                </h2>
                <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
                <p className="text-muted-foreground px-2 text-base sm:text-lg">
                  Melde dich an und sei einer der Ersten, die Zugang erhalten.
                </p>
              </div>

              {/* Editorial Modernism Form */}
              <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-muted-foreground block text-left text-xs font-medium tracking-wider uppercase sm:tracking-widest"
                  >
                    E-Mail-Adresse
                  </label>
                  {/* Bottom-border only input - Editorial Modernism */}
                  <input
                    id="email"
                    type="email"
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border placeholder:text-muted-foreground/50 focus:border-accent h-11 w-full border-0 border-b-2 bg-transparent px-0 text-base transition-all duration-300 outline-none sm:h-12"
                    aria-label="E-Mail-Adresse für Anmeldung"
                  />
                </div>

                {/* Bronze submit button - Editorial Modernism */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group min-h-12 w-full sm:min-h-14"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      Jetzt anmelden
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}

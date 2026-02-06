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
        showToast("Du bist bereits angemeldet! Wir informieren dich, sobald TiMax verfügbar ist.", "success");
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
    <section className="relative px-4 py-12 sm:py-20 lg:py-28 z-10 border-t border-border" id="cta">
      <div className="container mx-auto max-w-2xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-16">
            <div className="space-y-6 sm:space-y-8 text-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-foreground">
                  Bereit loszulegen?
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mx-auto mb-4 sm:mb-6" />
                <p className="text-base sm:text-lg text-muted-foreground px-2">
                  Melde dich an und sei einer der Ersten, die Zugang erhalten.
                </p>
              </div>
              
              {/* Editorial Modernism Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="block text-xs font-medium uppercase tracking-wider sm:tracking-widest text-muted-foreground text-left"
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
                    className="w-full h-11 sm:h-12 bg-transparent border-0 border-b-2 border-border px-0 text-base transition-all duration-300 outline-none placeholder:text-muted-foreground/50 focus:border-accent"
                    aria-label="E-Mail-Adresse für Anmeldung"
                  />
                </div>
                
                {/* Bronze submit button - Editorial Modernism */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full min-h-12 sm:min-h-14 group"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      Jetzt anmelden
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
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

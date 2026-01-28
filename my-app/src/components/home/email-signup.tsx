"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

// Konstanten
const EMAIL_SUBMIT_DELAY = 1000;

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
      // TODO (Phase 2): Backend-Integration implementieren
      // - Email-API-Route erstellen (/api/email/subscribe)
      // - Email-Service integrieren (z.B. Resend, SendGrid)
      // - Email in Datenbank speichern (Supabase)
      await new Promise((resolve) => setTimeout(resolve, EMAIL_SUBMIT_DELAY));
      
      showToast("Vielen Dank für dein Interesse! Die Anmeldung ist aktuell noch in Entwicklung.", "success");
      setEmail("");
    } catch (error) {
      showToast("Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.", "error");
      if (process.env.NODE_ENV === "development") {
        console.error("Email-Submit Fehler:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10" id="cta">
      <div className="container mx-auto max-w-2xl">
        <AnimatedSection direction="up">
          <GlassCard variant="elevated" className="p-10 sm:p-12">
            <div className="space-y-8 text-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
                  Bereit loszulegen?
                </h2>
                <p className="text-xl text-black/70 dark:text-white/70">
                  Melde dich an und sei einer der Ersten, die Zugang erhalten.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    E-Mail-Adresse
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/70 dark:bg-black/70 backdrop-blur-md sm:backdrop-blur-lg border border-black/10 dark:border-white/10 focus:border-black/20 dark:focus:border-white/20 rounded-full px-6 py-4 text-base transition-all shadow-lg focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2"
                    aria-label="E-Mail-Adresse für Anmeldung"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] rounded-full px-8 py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2" 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    "Jetzt anmelden"
                  )}
                </Button>
              </form>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}


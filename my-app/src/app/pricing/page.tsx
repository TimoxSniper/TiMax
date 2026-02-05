"use client";

import { useState } from "react";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Zap, 
  ArrowRight,
  Sparkles,
  Upload,
  MessageSquare,
  FileText,
  Clock,
  Shield,
  Headphones
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Konstanten - Editorial Modernism Spacing
const SECTION_SPACING = "py-16 sm:py-24 lg:py-32";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Preise
const MONTHLY_PRICE = 29;
const YEARLY_PRICE = 290;
const YEARLY_MONTHLY_EQUIVALENT = Math.round(YEARLY_PRICE / 12);
const SAVINGS_MONTHS = 2;

// Features die im Preis enthalten sind
const INCLUDED_FEATURES = [
  { icon: Upload, text: "Unbegrenzte Video & Audio Uploads" },
  { icon: Sparkles, text: "KI-gestützte Transkription (Whisper)" },
  { icon: MessageSquare, text: "Unbegrenzte KI-Chat Anfragen" },
  { icon: FileText, text: "Alle Textformate generieren" },
  { icon: Clock, text: "Schnelle Verarbeitung" },
  { icon: Shield, text: "Sichere Datenspeicherung" },
  { icon: Headphones, text: "Persönlicher Support" },
] as const;

// FAQ
const FAQ_ITEMS = [
  {
    question: "Warum muss ich bezahlen, um einen Account zu erstellen?",
    answer: "timax ist ein professionelles Tool für Marketing-Agenturen und Content-Teams. Wir bieten keine eingeschränkte Gratis-Version, sondern von Anfang an das volle Erlebnis. So können wir dir den besten Service und Support bieten."
  },
  {
    question: "Kann ich jederzeit kündigen?",
    answer: "Ja, du kannst dein Abo jederzeit zum Ende der Laufzeit kündigen. Bei monatlicher Zahlung endet es zum Monatsende, bei jährlicher Zahlung zum Jahresende."
  },
  {
    question: "Gibt es eine Geld-zurück-Garantie?",
    answer: "Ja! Wenn du in den ersten 14 Tagen nicht zufrieden bist, erstatten wir dir den vollen Betrag – ohne Fragen."
  },
  {
    question: "Welche Dateiformate werden unterstützt?",
    answer: "Wir unterstützen alle gängigen Video- und Audioformate: MP4, MOV, AVI, MP3, WAV, M4A und viele mehr."
  },
] as const;

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const currentPrice = isYearly ? YEARLY_PRICE : MONTHLY_PRICE;
  const pricePerMonth = isYearly ? YEARLY_MONTHLY_EQUIVALENT : MONTHLY_PRICE;
  const billingPeriod = isYearly ? "Jahr" : "Monat";

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <MainNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection direction="up">
              <div className="text-center mb-12 sm:mb-16">
                <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                  <Zap className="w-4 h-4 mr-2 text-accent" />
                  Einfache Preisgestaltung
                </Badge>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
                  Ein Preis.
                  <br />
                  <span className="text-accent">Alles inklusive.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Kein Freemium, keine versteckten Kosten. Starte sofort mit vollem Zugang zu allen Features.
                </p>
              </div>
            </AnimatedSection>

            {/* Billing Toggle */}
            <AnimatedSection direction="up" delay={100}>
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center gap-3 p-1.5 bg-secondary rounded-[6px] border border-border">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={cn(
                      "px-5 py-2.5 rounded-[4px] text-sm font-medium transition-all duration-300 uppercase tracking-wide",
                      !isYearly 
                        ? "bg-accent text-accent-foreground shadow-editorial-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Monatlich
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={cn(
                      "px-5 py-2.5 rounded-[4px] text-sm font-medium transition-all duration-300 uppercase tracking-wide flex items-center gap-2",
                      isYearly 
                        ? "bg-accent text-accent-foreground shadow-editorial-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Jährlich
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-background/50">
                      {SAVINGS_MONTHS} Monate gratis
                    </Badge>
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Pricing Card */}
            <AnimatedSection direction="up" delay={200}>
              <Card variant="accent" className="p-8 sm:p-12 max-w-xl mx-auto">
                <div className="text-center">
                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="font-serif text-6xl sm:text-7xl font-bold text-foreground">
                        {currentPrice}€
                      </span>
                      <span className="text-xl text-muted-foreground">
                        /{billingPeriod}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-2">
                        entspricht <span className="text-accent font-medium">{pricePerMonth}€/Monat</span>
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full mb-8 min-h-14 text-base group"
                  >
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <p className="text-xs text-muted-foreground mb-8">
                    14 Tage Geld-zurück-Garantie • Jederzeit kündbar
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-border mb-8" />

                  {/* Features */}
                  <div className="text-left">
                    <h3 className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground mb-6">
                      Alles inklusive:
                    </h3>
                    <ul className="space-y-4">
                      {INCLUDED_FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <li key={feature.text} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-[4px] bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-4 h-4 text-accent" />
                            </div>
                            <span className="text-foreground">{feature.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            {/* Trust Indicators */}
            <AnimatedSection direction="up" delay={300}>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Sichere Zahlung via Kreditkarte, PayPal oder SEPA-Lastschrift
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10 border-t border-border`}>
          <div className="container mx-auto max-w-3xl">
            <AnimatedSection direction="up">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Häufige Fragen
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mx-auto" />
              </div>
            </AnimatedSection>

            <div className="space-y-6">
              {FAQ_ITEMS.map((item, index) => (
                <AnimatedSection key={item.question} direction="up" delay={index * 100}>
                  <Card variant="subtle" className="p-6 sm:p-8">
                    <h3 className="font-serif text-lg sm:text-xl font-semibold mb-3 text-foreground">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`relative ${SECTION_PADDING} py-16 sm:py-20 z-10`}>
          <div className="container mx-auto max-w-2xl">
            <AnimatedSection direction="up">
              <Card variant="default" className="p-8 sm:p-12 text-center">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Bereit loszulegen?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Starte jetzt und transformiere deine Videos und Audios in kraftvolle Texte.
                </p>
                <Button
                  size="lg"
                  className="min-h-14 px-10 text-base group"
                >
                  {isYearly ? `Jetzt für ${YEARLY_PRICE}€/Jahr starten` : `Jetzt für ${MONTHLY_PRICE}€/Monat starten`}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

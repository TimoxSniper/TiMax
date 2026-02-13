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
  ArrowRight,
  Zap,
  Crown,
  Building,
  Clock,
  ShieldCheck,
  Headphones,
  MessageSquare,
  Upload,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Konstanten - Editorial Modernism Spacing
const SECTION_SPACING = "py-16 sm:py-24 lg:py-32";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Pricing Tiers
const PRICING_TIERS = [
  {
    name: "Starter",
    icon: User,
    description: "Perfekt für den Einstieg",
    monthlyPrice: 29,
    yearlyPrice: 290,
    regularMonthlyPrice: 39,
    regularYearlyPrice: 390,
    popular: false,
    features: [
      { text: "10 Uploads pro Monat", highlight: false },
      { text: "2 Stunden Transkription", highlight: false },
      { text: "100 KI-Chat Anfragen", highlight: false },
      { text: "E-Mail Support", highlight: false },
    ],
    cta: "Starter wählen",
  },
  {
    name: "Pro",
    icon: Crown,
    description: "Für aktive Creator",
    monthlyPrice: 49,
    yearlyPrice: 490,
    regularMonthlyPrice: 59,
    regularYearlyPrice: 590,
    popular: true,
    features: [
      { text: "50 Uploads pro Monat", highlight: true },
      { text: "10 Stunden Transkription", highlight: true },
      { text: "500 KI-Chat Anfragen", highlight: true },
      { text: "Prioritäts-Support", highlight: true },
    ],
    cta: "Pro wählen",
  },
  {
    name: "Business",
    icon: Building,
    description: "Für Profis",
    monthlyPrice: 79,
    yearlyPrice: 790,
    regularMonthlyPrice: 89,
    regularYearlyPrice: 890,
    popular: false,
    features: [
      { text: "Unbegrenzte Uploads", highlight: true },
      { text: "30 Stunden Transkription", highlight: true },
      { text: "Unbegrenzte KI-Chat Anfragen", highlight: true },
      { text: "Persönlicher Support", highlight: true },
    ],
    cta: "Business wählen",
  },
] as const;

// FAQ
const FAQ_ITEMS = [
  {
    question: "Warum muss ich bezahlen, um einen Account zu erstellen?",
    answer:
      "timax ist für Creator und Experten, die ihre Zeit effizient nutzen wollen. Wir bieten keine eingeschränkte Gratis-Version, sondern von Anfang an ein vollwertiges Erlebnis. So können wir dir den besten Service und Support bieten.",
  },
  {
    question: "Was passiert, wenn ich mein Limit erreiche?",
    answer:
      "Du erhältst eine Benachrichtigung, wenn du 80% deines Limits erreicht hast. Du kannst jederzeit auf eine höhere Stufe upgraden. Ungenutzte Kapazität wird nicht übertragen.",
  },
  {
    question: "Kann ich jederzeit wechseln oder kündigen?",
    answer:
      "Ja! Du kannst jederzeit upgraden (sofort wirksam) oder downgraden (zum nächsten Abrechnungszeitraum). Kündigung ist jederzeit möglich.",
  },
  {
    question: "Gibt es eine Geld-zurück-Garantie?",
    answer:
      "Ja! Wenn du in den ersten 14 Tagen nicht zufrieden bist, erstatten wir dir den vollen Betrag – ohne Fragen.",
  },
] as const;

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <MainNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative ${SECTION_PADDING} z-10 pt-16 pb-8 sm:pt-24 sm:pb-12`}>
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection direction="up">
              <div className="mb-12 text-center sm:mb-16">
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                  <Zap className="text-accent mr-2 h-4 w-4" />
                  Transparente Preise
                </Badge>
                <h1 className="text-foreground mb-6 font-serif text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                  Wähle deinen Plan
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
                  Keine versteckten Kosten. Upgrade oder downgrade jederzeit.
                </p>
              </div>
            </AnimatedSection>

            {/* Billing Toggle */}
            <AnimatedSection direction="up" delay={100}>
              <div className="mb-12 flex justify-center">
                <div className="bg-secondary border-border inline-flex items-center gap-3 rounded-[6px] border p-1.5">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={cn(
                      "rounded-[4px] px-5 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-300",
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
                      "flex items-center gap-2 rounded-[4px] px-5 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-300",
                      isYearly
                        ? "bg-accent text-accent-foreground shadow-editorial-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Jährlich
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className={`relative ${SECTION_PADDING} z-10 pb-16 sm:pb-24`}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3 lg:gap-8">
              {PRICING_TIERS.map((tier, index) => {
                const Icon = tier.icon;
                const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
                const regularPrice = isYearly ? tier.regularYearlyPrice : tier.regularMonthlyPrice;
                const billingPeriod = isYearly ? "Jahr" : "Monat";

                return (
                  <AnimatedSection key={tier.name} direction="up" delay={index * 100}>
                    <Card
                      variant="accent"
                      hover={false}
                      overflow={tier.popular ? "visible" : "hidden"}
                      className={cn(
                        "relative flex h-[600px] flex-col p-6 sm:p-8",
                        tier.popular && "ring-accent ring-2"
                      )}
                    >
                      {/* Popular Badge */}
                      {tier.popular && (
                        <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                          <Badge className="bg-accent text-accent-foreground px-4 py-1.5 text-xs tracking-wide whitespace-nowrap uppercase shadow-lg">
                            Beliebt
                          </Badge>
                        </div>
                      )}

                      {/* Header */}
                      <div className="mb-5 flex-shrink-0 text-center">
                        <div className="bg-secondary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[6px]">
                          <Icon className="text-accent h-7 w-7" />
                        </div>
                        <h3 className="text-foreground mb-1 font-serif text-2xl font-bold">
                          {tier.name}
                        </h3>
                        <p className="text-muted-foreground h-5 text-sm">{tier.description}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-5 flex-shrink-0 text-center">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-muted-foreground text-xl line-through">
                            {regularPrice}€
                          </span>
                          <span className="text-foreground font-serif text-4xl font-bold">
                            {price}€
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm">/{billingPeriod}</span>
                      </div>

                      {/* Features */}
                      <ul className="flex-grow space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature.text} className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[4px]",
                                feature.highlight ? "bg-accent/20" : "bg-secondary"
                              )}
                            >
                              <Check
                                className={cn(
                                  "h-3.5 w-3.5",
                                  feature.highlight ? "text-accent" : "text-muted-foreground"
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-sm",
                                feature.highlight
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Button
                        size="lg"
                        variant={tier.popular ? "default" : "outline"}
                        className="h-14 w-full flex-shrink-0"
                      >
                        {tier.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <AnimatedSection direction="up" delay={400}>
              <div className="mt-12 space-y-3 text-center">
                <p className="text-muted-foreground text-sm">
                  14 Tage Geld-zurück-Garantie • Jederzeit kündbar
                </p>
                <p className="text-muted-foreground/70 text-xs">
                  Sichere Zahlung via Kreditkarte, PayPal oder SEPA-Lastschrift
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Comparison Table - Mobile friendly */}
        <section
          className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
        >
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection direction="up">
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
                  Alle Features im Vergleich
                </h2>
                <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={100}>
              <Card variant="subtle" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-border border-b">
                        <th className="text-muted-foreground p-4 text-left font-medium">Feature</th>
                        <th className="text-foreground p-4 text-center font-medium">Starter</th>
                        <th className="text-accent p-4 text-center font-medium">Pro</th>
                        <th className="text-foreground p-4 text-center font-medium">Business</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      <tr>
                        <td className="text-muted-foreground flex items-center gap-2 p-4">
                          <Upload className="h-4 w-4" /> Uploads/Monat
                        </td>
                        <td className="text-foreground p-4 text-center">10</td>
                        <td className="text-accent p-4 text-center font-medium">50</td>
                        <td className="text-foreground p-4 text-center">∞</td>
                      </tr>
                      <tr>
                        <td className="text-muted-foreground flex items-center gap-2 p-4">
                          <Clock className="h-4 w-4" /> Transkription
                        </td>
                        <td className="text-foreground p-4 text-center">2h</td>
                        <td className="text-accent p-4 text-center font-medium">10h</td>
                        <td className="text-foreground p-4 text-center">30h</td>
                      </tr>
                      <tr>
                        <td className="text-muted-foreground flex items-center gap-2 p-4">
                          <MessageSquare className="h-4 w-4" /> KI-Chat
                        </td>
                        <td className="text-foreground p-4 text-center">100</td>
                        <td className="text-accent p-4 text-center font-medium">500</td>
                        <td className="text-foreground p-4 text-center">∞</td>
                      </tr>
                      <tr>
                        <td className="text-muted-foreground flex items-center gap-2 p-4">
                          <ShieldCheck className="h-4 w-4" /> Datenspeicherung
                        </td>
                        <td className="text-foreground p-4 text-center">90 Tage</td>
                        <td className="text-accent p-4 text-center font-medium">1 Jahr</td>
                        <td className="text-foreground p-4 text-center">∞</td>
                      </tr>
                      <tr>
                        <td className="text-muted-foreground flex items-center gap-2 p-4">
                          <Headphones className="h-4 w-4" /> Support
                        </td>
                        <td className="text-foreground p-4 text-center">E-Mail</td>
                        <td className="text-accent p-4 text-center font-medium">Priorität</td>
                        <td className="text-foreground p-4 text-center">Persönlich</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
        >
          <div className="container mx-auto max-w-3xl">
            <AnimatedSection direction="up">
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
                  Häufige Fragen
                </h2>
                <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
              </div>
            </AnimatedSection>

            <div className="space-y-6">
              {FAQ_ITEMS.map((item, index) => (
                <AnimatedSection key={item.question} direction="up" delay={index * 100}>
                  <Card variant="subtle" className="p-6 sm:p-8">
                    <h3 className="text-foreground mb-3 font-serif text-lg font-semibold sm:text-xl">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`relative ${SECTION_PADDING} z-10 py-16 sm:py-20`}>
          <div className="container mx-auto max-w-2xl">
            <AnimatedSection direction="up">
              <Card variant="default" className="p-8 text-center sm:p-12">
                <h2 className="text-foreground mb-4 font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
                  Noch unsicher?
                </h2>
                <p className="text-muted-foreground mx-auto mb-8 max-w-md">
                  Starte mit dem Starter-Plan und upgrade jederzeit, wenn du mehr brauchst.
                </p>
                <Button size="lg" className="group min-h-14 px-10 text-base">
                  Mit Starter beginnen
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

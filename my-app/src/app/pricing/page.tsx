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
  Clock,
  Shield,
  Headphones,
  Star,
  Building2,
  User
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
    description: "Perfekt für Einsteiger und Solopreneure",
    monthlyPrice: 29,
    yearlyPrice: 290,
    popular: false,
    features: [
      { text: "10 Uploads pro Monat", highlight: false },
      { text: "2 Stunden Transkription", highlight: false },
      { text: "100 KI-Chat Anfragen", highlight: false },
      { text: "Alle Textformate", highlight: false },
      { text: "E-Mail Support", highlight: false },
    ],
    cta: "Starter wählen",
  },
  {
    name: "Pro",
    icon: Star,
    description: "Für Content-Creator und kleine Teams",
    monthlyPrice: 49,
    yearlyPrice: 490,
    popular: true,
    features: [
      { text: "50 Uploads pro Monat", highlight: true },
      { text: "10 Stunden Transkription", highlight: true },
      { text: "500 KI-Chat Anfragen", highlight: true },
      { text: "Alle Textformate", highlight: false },
      { text: "Prioritäts-Support", highlight: true },
    ],
    cta: "Pro wählen",
  },
  {
    name: "Business",
    icon: Building2,
    description: "Für Agenturen und große Teams",
    monthlyPrice: 79,
    yearlyPrice: 790,
    popular: false,
    features: [
      { text: "Unbegrenzte Uploads", highlight: true },
      { text: "30 Stunden Transkription", highlight: true },
      { text: "Unbegrenzte KI-Chat Anfragen", highlight: true },
      { text: "Alle Textformate", highlight: false },
      { text: "Persönlicher Support", highlight: true },
    ],
    cta: "Business wählen",
  },
] as const;

// FAQ
const FAQ_ITEMS = [
  {
    question: "Warum muss ich bezahlen, um einen Account zu erstellen?",
    answer: "timax ist ein professionelles Tool für Marketing-Agenturen und Content-Teams. Wir bieten keine eingeschränkte Gratis-Version, sondern von Anfang an ein vollwertiges Erlebnis. So können wir dir den besten Service und Support bieten."
  },
  {
    question: "Was passiert, wenn ich mein Limit erreiche?",
    answer: "Du erhältst eine Benachrichtigung, wenn du 80% deines Limits erreicht hast. Du kannst jederzeit auf eine höhere Stufe upgraden. Ungenutzte Kapazität wird nicht übertragen."
  },
  {
    question: "Kann ich jederzeit wechseln oder kündigen?",
    answer: "Ja! Du kannst jederzeit upgraden (sofort wirksam) oder downgraden (zum nächsten Abrechnungszeitraum). Kündigung ist jederzeit möglich."
  },
  {
    question: "Gibt es eine Geld-zurück-Garantie?",
    answer: "Ja! Wenn du in den ersten 14 Tagen nicht zufrieden bist, erstatten wir dir den vollen Betrag – ohne Fragen."
  },
] as const;

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <MainNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative ${SECTION_PADDING} pt-16 sm:pt-24 pb-8 sm:pb-12 z-10`}>
          <div className="container mx-auto max-w-6xl">
            <AnimatedSection direction="up">
              <div className="text-center mb-12 sm:mb-16">
                <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                  <Zap className="w-4 h-4 mr-2 text-accent" />
                  Transparente Preise
                </Badge>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
                  Wähle deinen Plan
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Keine versteckten Kosten. Upgrade oder downgrade jederzeit.
                </p>
              </div>
            </AnimatedSection>

            {/* Billing Toggle */}
            <AnimatedSection direction="up" delay={100}>
              <div className="flex justify-center mb-12">
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
                      2 Monate gratis
                    </Badge>
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className={`relative ${SECTION_PADDING} pb-16 sm:pb-24 z-10`}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {PRICING_TIERS.map((tier, index) => {
                const Icon = tier.icon;
                const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
                const monthlyEquivalent = isYearly ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice;
                const billingPeriod = isYearly ? "Jahr" : "Monat";

                return (
                  <AnimatedSection key={tier.name} direction="up" delay={index * 100}>
                    <Card 
                      variant={tier.popular ? "accent" : "default"} 
                      className={cn(
                        "p-6 sm:p-8 h-full flex flex-col relative",
                        tier.popular && "ring-2 ring-accent"
                      )}
                    >
                      {/* Popular Badge */}
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-accent text-accent-foreground px-4 py-1 text-xs uppercase tracking-wide">
                            Beliebt
                          </Badge>
                        </div>
                      )}

                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-[6px] bg-secondary flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tier.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-serif text-5xl font-bold text-foreground">
                            {price}€
                          </span>
                          <span className="text-muted-foreground">
                            /{billingPeriod}
                          </span>
                        </div>
                        {isYearly && (
                          <p className="text-sm text-muted-foreground mt-1">
                            entspricht <span className="text-accent font-medium">{monthlyEquivalent}€/Monat</span>
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <Button
                        size="lg"
                        variant={tier.popular ? "default" : "outline"}
                        className="w-full mb-6 group"
                      >
                        {tier.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>

                      {/* Divider */}
                      <div className="w-full h-px bg-border mb-6" />

                      {/* Features */}
                      <ul className="space-y-3 flex-grow">
                        {tier.features.map((feature) => (
                          <li key={feature.text} className="flex items-start gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-[4px] flex items-center justify-center flex-shrink-0 mt-0.5",
                              feature.highlight ? "bg-accent/20" : "bg-secondary"
                            )}>
                              <Check className={cn(
                                "w-3.5 h-3.5",
                                feature.highlight ? "text-accent" : "text-muted-foreground"
                              )} />
                            </div>
                            <span className={cn(
                              "text-sm",
                              feature.highlight ? "text-foreground font-medium" : "text-muted-foreground"
                            )}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <AnimatedSection direction="up" delay={400}>
              <div className="mt-12 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  14 Tage Geld-zurück-Garantie • Jederzeit kündbar
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Sichere Zahlung via Kreditkarte, PayPal oder SEPA-Lastschrift
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Comparison Table - Mobile friendly */}
        <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10 border-t border-border`}>
          <div className="container mx-auto max-w-4xl">
            <AnimatedSection direction="up">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Alle Features im Vergleich
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mx-auto" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={100}>
              <Card variant="subtle" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                        <th className="text-center p-4 font-medium text-foreground">Starter</th>
                        <th className="text-center p-4 font-medium text-accent">Pro</th>
                        <th className="text-center p-4 font-medium text-foreground">Business</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Uploads/Monat
                        </td>
                        <td className="p-4 text-center text-foreground">10</td>
                        <td className="p-4 text-center text-accent font-medium">50</td>
                        <td className="p-4 text-center text-foreground">∞</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Transkription
                        </td>
                        <td className="p-4 text-center text-foreground">2h</td>
                        <td className="p-4 text-center text-accent font-medium">10h</td>
                        <td className="p-4 text-center text-foreground">30h</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> KI-Chat
                        </td>
                        <td className="p-4 text-center text-foreground">100</td>
                        <td className="p-4 text-center text-accent font-medium">500</td>
                        <td className="p-4 text-center text-foreground">∞</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Textformate
                        </td>
                        <td className="p-4 text-center text-foreground">Alle</td>
                        <td className="p-4 text-center text-accent font-medium">Alle</td>
                        <td className="p-4 text-center text-foreground">Alle</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Datenspeicherung
                        </td>
                        <td className="p-4 text-center text-foreground">90 Tage</td>
                        <td className="p-4 text-center text-accent font-medium">1 Jahr</td>
                        <td className="p-4 text-center text-foreground">∞</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Headphones className="w-4 h-4" /> Support
                        </td>
                        <td className="p-4 text-center text-foreground">E-Mail</td>
                        <td className="p-4 text-center text-accent font-medium">Priorität</td>
                        <td className="p-4 text-center text-foreground">Persönlich</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
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
                  Noch unsicher?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Starte mit dem Starter-Plan und upgrade jederzeit, wenn du mehr brauchst.
                </p>
                <Button
                  size="lg"
                  className="min-h-14 px-10 text-base group"
                >
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

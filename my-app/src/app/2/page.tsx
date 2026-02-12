"use client";

import { memo, useMemo } from "react";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailSignup } from "@/components/home/email-signup";
import {
  Upload,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Konstanten
const SECTION_SPACING = "py-12 sm:py-20 lg:py-28";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Split-Screen Hero - Asymmetrisch
const HeroSectionV3 = memo(function HeroSectionV3() {
  return (
    <section className={`relative ${SECTION_PADDING} pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-48 lg:pb-32 z-10`}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left: Headline + CTA */}
          <AnimatedSection direction="up">
            <div className="flex flex-col justify-center space-y-10 lg:space-y-12">
              <div className="space-y-6">
                <Badge variant="default" className="w-fit px-4 py-2 text-sm">
                  BETA — KOSTENLOS
                </Badge>
                <h1 className="text-foreground font-serif text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                  Dein Content verstaubt
                </h1>
                <div className="bg-accent h-1 w-24 sm:w-32" />
                <p className="text-muted-foreground max-w-xl text-lg leading-relaxed sm:text-xl lg:text-2xl">
                  Podcasts, Videos, Workshops — alles da. Aber keine LinkedIn-Posts, keine
                  Newsletter. Warum? Zu viel Arbeit.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Button
                  size="lg"
                  className="group min-h-14 w-full px-10 sm:w-auto"
                  asChild
                >
                  <Link href="/upload">
                    Erste Datei hochladen
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-14 w-full px-10 sm:w-auto"
                  asChild
                >
                  <a href="#how">Wie funktioniert's?</a>
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Impact Stats */}
          <AnimatedSection delay={200} direction="up">
            <div className="flex flex-col justify-center space-y-8 sm:space-y-10 lg:space-y-12">
              <div className="space-y-8 sm:space-y-10">
                <div className="space-y-3">
                  <div className="text-accent font-serif text-6xl font-bold leading-none sm:text-7xl lg:text-8xl">
                    7,5h
                  </div>
                  <p className="text-foreground max-w-md text-base leading-relaxed sm:text-lg lg:text-xl">
                    durchschnittliche Zeit für manuelles Transkribieren + Texterstellung
                  </p>
                </div>

                <div className="border-border border-t pt-8 sm:pt-10">
                  <div className="space-y-3">
                    <div className="text-accent font-serif text-6xl font-bold leading-none sm:text-7xl lg:text-8xl">
                      25min
                    </div>
                    <p className="text-foreground max-w-md text-base leading-relaxed sm:text-lg lg:text-xl">
                      mit TiMax — Upload, Transkript, KI-Chat, fertig
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

// Problem Agitation - Sehr direkt
const ProblemAgitationSection = memo(function ProblemAgitationSection() {
  const painPoints = useMemo(
    () => [
      "Transkription dauert Stunden oder kostet viel",
      "ChatGPT kennt deinen Content nicht",
      "Copy-Paste zwischen Tools nervt",
      "Am Ende klingt's generisch",
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} py-16 sm:py-24 lg:py-32 border-border z-10 border-t`}>
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-12 text-center sm:space-y-16">
          <AnimatedSection direction="up">
            <div className="space-y-4">
              <h2 className="text-foreground font-serif text-4xl font-bold sm:text-6xl lg:text-7xl">
                Kennst du das?
              </h2>
              <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
            </div>
          </AnimatedSection>

          <div className="space-y-6 text-left sm:space-y-8">
            {painPoints.map((point, index) => (
              <AnimatedSection key={index} delay={index * 100} direction="up">
                <div className="flex items-start gap-6 sm:gap-8">
                  <div className="bg-destructive/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[4px] sm:h-14 sm:w-14">
                    <X className="text-destructive h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                  </div>
                  <p className="text-foreground flex-1 pt-2.5 text-lg leading-relaxed sm:text-xl lg:text-2xl">
                    {point}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// Solution - Das ändert sich
const SolutionSection = memo(function SolutionSection() {
  const benefits = useMemo(
    () => [
      {
        icon: Upload,
        before: "Mehrere Tools",
        after: "Ein Workflow",
      },
      {
        icon: Clock,
        before: "Stunden Arbeit",
        after: "Minuten Setup",
      },
      {
        icon: Zap,
        before: "Generische Texte",
        after: "Deine Stimme",
      },
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} py-16 sm:py-24 lg:py-32 z-10`}>
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-16 text-center sm:mb-20">
            <h2 className="text-foreground mb-6 font-serif text-4xl font-bold sm:text-6xl lg:text-7xl">
              Das ändert sich
            </h2>
            <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <AnimatedSection key={index} delay={index * 100} direction="up">
                <div className="bg-secondary/50 h-full rounded-[6px] border-border border p-8 shadow-editorial-sm transition-all hover:shadow-editorial-md sm:p-10">
                  <Icon
                    className="text-accent mb-8 h-12 w-12"
                    aria-hidden="true"
                  />
                  <div className="space-y-6">
                    <div>
                      <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-widest">
                        Vorher
                      </div>
                      <p className="text-foreground/60 text-lg line-through sm:text-xl">
                        {benefit.before}
                      </p>
                    </div>
                    <div className="border-border border-t pt-6">
                      <div className="text-accent mb-2 text-xs font-medium uppercase tracking-widest">
                        Nachher
                      </div>
                      <p className="text-foreground text-lg font-semibold sm:text-xl">
                        {benefit.after}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// How it Works - Simple List
const HowItWorksSection = memo(function HowItWorksSection() {
  const steps = useMemo(
    () => [
      {
        number: "01",
        icon: Upload,
        title: "Hochladen",
        description: "Datei hochladen. MP4, MP3, M4A — egal.",
      },
      {
        number: "02",
        icon: FileText,
        title: "Transkribieren",
        description: "Automatisch. Kein Warten, kein Tippen.",
      },
      {
        number: "03",
        icon: MessageSquare,
        title: "KI fragen",
        description: "Sie kennt deinen Content. Stell Fragen.",
      },
      {
        number: "04",
        icon: Sparkles,
        title: "Text generieren",
        description: "Post, Newsletter, Blog — was du willst.",
      },
    ],
    []
  );

  return (
    <section
      className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
      id="how"
    >
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection direction="up">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="text-foreground mb-4 font-serif text-4xl font-bold sm:mb-6 sm:text-6xl lg:text-7xl">
              So geht's
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
              Vier Schritte. Ein Workflow. Fertig.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.number} delay={index * 100} direction="up">
                <div className="bg-card rounded-[6px] border-border border p-6 shadow-editorial-md transition-all hover:shadow-editorial-lg sm:p-8 lg:p-10">
                  <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
                    {/* Number + Icon */}
                    <div className="flex flex-shrink-0 items-center gap-4 sm:gap-6">
                      <div className="text-accent font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
                        {step.number}
                      </div>
                      <div className="bg-secondary flex h-14 w-14 items-center justify-center rounded-[6px] sm:h-16 sm:w-16">
                        <Icon className="text-accent h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-foreground font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed sm:text-lg lg:text-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Social Proof - Simple
const SocialProofSection = memo(function SocialProofSection() {
  const stats = useMemo(
    () => [
      { value: "98%", label: "Genauigkeit", sublabel: "bei deutscher Sprache" },
      { value: "<15min", label: "Bearbeitung", sublabel: "durchschnittlich" },
      { value: "∞", label: "Formate", sublabel: "Post, Newsletter, Blog..." },
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.label} delay={index * 100} direction="up">
              <div className="text-center">
                <div className="text-accent mb-2 font-serif text-6xl font-bold sm:mb-4 sm:text-7xl lg:text-8xl">
                  {stat.value}
                </div>
                <div className="text-foreground mb-1 text-base font-medium uppercase tracking-wide sm:text-lg">
                  {stat.label}
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">{stat.sublabel}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
});

// Who is this for - Direct
const WhoSection = memo(function WhoSection() {
  const personas = useMemo(
    () => [
      "Du machst Podcasts",
      "Du hältst Workshops",
      "Du drehst Videos",
      "Du willst mehr Content",
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}>
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <div className="space-y-8 text-center">
            <div>
              <h2 className="text-foreground mb-4 font-serif text-4xl font-bold sm:mb-6 sm:text-6xl lg:text-7xl">
                Für wen ist das?
              </h2>
              <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
            </div>

            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 sm:gap-6">
              {personas.map((persona, index) => (
                <AnimatedSection key={index} delay={index * 100} direction="up">
                  <div className="bg-secondary/30 flex items-center gap-4 rounded-[6px] border-border border p-4 sm:p-6">
                    <CheckCircle2
                      className="text-accent h-6 w-6 flex-shrink-0 sm:h-7 sm:w-7"
                      aria-hidden="true"
                    />
                    <p className="text-foreground text-base sm:text-lg lg:text-xl">{persona}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Final CTA - Big and Bold
const FinalCTASection = memo(function FinalCTASection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection direction="up">
          <div className="bg-accent/10 rounded-[6px] border-accent border-l-4 p-8 shadow-editorial-lg sm:p-12 lg:p-16">
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <Badge variant="default" className="px-4 py-2 text-sm">
                  BETA — JETZT KOSTENLOS
                </Badge>
                <h2 className="text-foreground font-serif text-4xl font-bold sm:text-6xl lg:text-7xl">
                  Bereit?
                </h2>
                <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
                <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg lg:text-xl">
                  Erste Datei hochladen. In Minuten zum Transkript. Kostenlos testen.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
                <Button
                  size="lg"
                  className="group min-h-14 w-full max-w-xs px-10 sm:w-auto"
                  asChild
                >
                  <Link href="/upload">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-14 w-full max-w-xs px-10 sm:w-auto"
                  asChild
                >
                  <Link href="/chat">Zum Chat</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Main Page Component
export default function LandingPageV3() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="focus:bg-accent focus:text-accent-foreground focus:ring-accent sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[4px] focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2"
      >
        Zum Hauptinhalt springen
      </a>

      <MainNavigation />

      <main id="main-content" role="main">
        {/* Hero - Split Screen Asymmetrisch */}
        <HeroSectionV3 />

        {/* Problem Agitation - Direkt */}
        <ProblemAgitationSection />

        {/* Solution - Vorher/Nachher */}
        <SolutionSection />

        {/* How it Works - Simple List */}
        <HowItWorksSection />

        {/* Social Proof - Zahlen */}
        <SocialProofSection />

        {/* Who - Personas */}
        <WhoSection />

        {/* Final CTA - Big */}
        <FinalCTASection />

        {/* Email Signup */}
        <EmailSignup />
      </main>

      <Footer />
    </div>
  );
}

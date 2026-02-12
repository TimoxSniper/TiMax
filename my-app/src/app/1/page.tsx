"use client";

import { memo, useMemo } from "react";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hero } from "@/components/magic-ui/hero";
import { StatsSection } from "@/components/home/stats-section";
import { DemoVideoSection } from "@/components/home/demo-video-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { EmailSignup } from "@/components/home/email-signup";
import {
  Upload,
  FileText,
  MessageSquare,
  Sparkles,
  Brain,
  Zap,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Konstanten - Editorial Modernism Spacing (mobile-optimized)
const SECTION_SPACING = "py-12 sm:py-20 lg:py-28";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Hero Section Component - Pain-First Approach
const HeroSectionV2 = memo(function HeroSectionV2() {
  return (
    <section className={`relative ${SECTION_PADDING} pt-20 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 z-10`}>
      <div className="container mx-auto max-w-5xl">
        <AnimatedSection direction="up">
          <div className="flex flex-col items-center space-y-6 text-center sm:space-y-8">
            {/* Beta Badge */}
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              BETA
            </Badge>

            {/* Hero Content */}
            <div className="w-full">
              <Hero
                heading="Von Audio zu Text. Fertig."
                subheading="Lade Videos oder Audios hoch. Wir transkribieren, du chattest mit der KI und generierst Texte. Ein Tool, ein Workflow."
                align="center"
              />
            </div>

            {/* CTAs */}
            <div className="flex w-full flex-col items-center justify-center gap-4 pt-4 sm:flex-row sm:gap-6 sm:pt-8">
              <Button
                size="lg"
                className="group min-h-12 w-full max-w-xs px-8 sm:min-h-14 sm:w-auto sm:px-10"
                asChild
              >
                <Link href="/upload">
                  Datei hochladen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-12 w-full max-w-xs px-8 sm:min-h-14 sm:w-auto sm:px-10"
                asChild
              >
                <a href="#workflow">Wie funktioniert's?</a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Stats Section - Reuse with custom copy handled in parent

// Problem Section - "Das Problem"
const ProblemSectionV2 = memo(function ProblemSectionV2() {
  const checkPoints = useMemo(
    () => [
      "Automatische Transkription",
      "KI kennt deinen Content",
      "Ein Tool, ein Workflow",
      "Von Upload zu fertigem Text",
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="problem">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="accent" className="p-6 sm:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-foreground mb-3 font-serif text-3xl font-bold sm:mb-4 sm:text-5xl lg:text-6xl">
                  Das Problem
                </h2>
                <div className="bg-accent mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-foreground text-base leading-relaxed sm:text-lg lg:text-xl">
                  Du hast Content. Podcasts, Videos, Workshops. Aber keine Zeit, daraus Posts oder
                  Artikel zu machen.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg">
                  Transkription dauert lang. KI-Tools sind generisch. Du brauchst mehrere Tools. Am
                  Ende machst du's nicht.
                </p>

                {/* Check Points */}
                <ul className="text-foreground space-y-3 pt-2 sm:space-y-4 sm:pt-4">
                  {checkPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4">
                      <CheckCircle2
                        className="text-accent mt-0.5 h-4 w-4 flex-shrink-0 sm:mt-1 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                      <span className="text-sm sm:text-base lg:text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Workflow Comparison Section - "Vorher vs. Nachher"
const WorkflowComparisonSection = memo(function WorkflowComparisonSection() {
  const beforeSteps = useMemo(
    () => [
      "Transkription (manuell oder teuer)",
      "ChatGPT Copy-Paste",
      "Überarbeiten (klingt generisch)",
      "Mehrere Tools",
    ],
    []
  );

  const afterSteps = useMemo(
    () => ["Upload → Transkript ✓", "KI-Chat → Dein Ton ✓", "Fertig ✓", "Ein Workflow ✓"],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* VORHER */}
          <AnimatedSection direction="up" delay={0}>
            <Card variant="subtle" className="h-full p-6 sm:p-8 lg:p-10">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-widest sm:mb-3">
                    Vorher
                  </div>
                  <h3 className="text-foreground font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                    Der alte Weg
                  </h3>
                </div>
                <ul className="text-muted-foreground space-y-3">
                  {beforeSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-destructive mt-0.5 text-base">✗</span>
                      <span className="text-sm leading-relaxed sm:text-base">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </AnimatedSection>

          {/* NACHHER */}
          <AnimatedSection direction="up" delay={100}>
            <Card variant="default" className="h-full p-6 sm:p-8 lg:p-10">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="text-accent mb-2 text-xs font-medium uppercase tracking-widest sm:mb-3">
                    Nachher
                  </div>
                  <h3 className="text-foreground font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                    Mit TiMax
                  </h3>
                </div>
                <ul className="text-foreground space-y-3">
                  {afterSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2
                        className="text-accent mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed sm:text-base">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

// Workflow Steps Section - "So funktioniert's"
const WorkflowStepsSection = memo(function WorkflowStepsSection() {
  const steps = useMemo(
    () => [
      {
        number: "01",
        icon: Upload,
        title: "UPLOAD",
        description: "Datei hochladen. MP4, MP3, M4A.",
      },
      {
        number: "02",
        icon: FileText,
        title: "TRANSKRIPT",
        description: "Automatisch transkribiert. In Minuten.",
      },
      {
        number: "03",
        icon: MessageSquare,
        title: "KI-CHAT",
        description: "Frag die KI. Sie kennt deinen Content.",
      },
      {
        number: "04",
        icon: Sparkles,
        title: "TEXT GENERIEREN",
        description: "LinkedIn-Post? Newsletter? Blog? Fertig.",
      },
    ],
    []
  );

  return (
    <section
      className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
      id="workflow"
    >
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-10 text-center sm:mb-16 lg:mb-20">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              So funktioniert's
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg lg:text-xl">
              Vier einfache Schritte von Upload zu fertigem Text
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.number} delay={index * 100} direction="up">
                <div className="flex h-full flex-col text-center">
                  {/* Bronze step number */}
                  <div className="text-accent mb-2 font-serif text-4xl font-bold sm:mb-4 sm:text-5xl lg:text-7xl">
                    {step.number}
                  </div>
                  <h3 className="text-foreground mb-2 font-sans text-sm font-medium uppercase tracking-wide sm:mb-3 sm:text-base lg:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-2 hidden flex-grow text-xs leading-relaxed sm:mb-4 sm:block sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Features Section - "Features"
const FeaturesSectionV2 = memo(function FeaturesSectionV2() {
  const features = useMemo(
    () => [
      {
        icon: Brain,
        title: "KI mit Kontext",
        description: "Die KI kennt deine Uploads. Versteht deinen Stil.",
      },
      {
        icon: Zap,
        title: "Ein Workflow",
        description: "Upload, Transkript, Chat, Text. Alles hier.",
      },
      {
        icon: MessageSquare,
        title: "Verschiedene Formate",
        description: "Posts, Newsletter, Artikel. Aus einem Transkript.",
      },
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="features">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-10 text-center sm:mb-16 lg:mb-20">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Features
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                <Card variant="default" className="h-full p-6 sm:p-8 lg:p-10">
                  <div className="flex h-full flex-col">
                    <Icon
                      className="text-accent mb-4 h-10 w-10 sm:mb-6 sm:h-12 sm:w-12"
                      aria-hidden="true"
                    />
                    <h3 className="text-foreground mb-2 font-serif text-xl font-semibold sm:mb-4 sm:text-2xl lg:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Use Cases Section - "Für wen?"
const UseCasesSection = memo(function UseCasesSection() {
  const personas = useMemo(
    () => ["Podcaster", "Workshop-Leiter", "Video-Creator", "Content-Ersteller"],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="use-cases">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6 text-center sm:space-y-8">
          <AnimatedSection direction="up">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Für wen?
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
          </AnimatedSection>

          <AnimatedSection delay={100} direction="up">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {personas.map((persona) => (
                <Badge key={persona} variant="secondary" className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base">
                  {persona}
                </Badge>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} direction="up">
            <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-base leading-relaxed sm:text-lg lg:text-xl">
              Du erstellst Audio oder Video Content. Du willst daraus Texte machen. Ohne viel Zeit.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

// Beta Notice Section
const BetaNoticeSection = memo(function BetaNoticeSection() {
  return (
    <section
      className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
    >
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="accent" className="p-6 sm:p-10 lg:p-12">
            <div className="space-y-6 text-center sm:space-y-8">
              <div className="flex justify-center">
                <Badge variant="default" className="px-4 py-2 text-sm">
                  BETA
                </Badge>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-foreground font-serif text-3xl font-bold sm:text-5xl lg:text-6xl">
                  TiMax ist in der Beta
                </h2>
                <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg lg:text-xl">
                  Aktuell kostenlos. Features werden noch entwickelt.
                </p>
              </div>

              <Button
                size="lg"
                className="group min-h-12 w-full px-8 sm:min-h-14 sm:w-auto sm:px-10"
                asChild
              >
                <Link href="/upload">
                  Jetzt testen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Final CTA Section
const FinalCTASection = memo(function FinalCTASection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <div className="space-y-8 text-center sm:space-y-12">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-foreground font-serif text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                Bereit?
              </h2>
              <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
              <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-base leading-relaxed sm:text-lg lg:text-xl">
                Erste Datei hochladen. Transkript in Minuten. Kostenlos in der Beta.
              </p>
            </div>

            <Button
              size="lg"
              className="group min-h-12 w-full px-8 sm:min-h-14 sm:w-auto sm:px-10"
              asChild
            >
              <Link href="/upload">
                Datei hochladen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Custom Stats Section with new copy
const StatsSectionV2 = memo(function StatsSectionV2() {
  // Using the existing StatsSection component but note: we'd need to update copy
  // For now we'll inline a custom version matching the plan

  const stats = [
    { value: "98%", label: "Transkriptions-Genauigkeit" },
    { value: "< 15 Min", label: "Durchschn. Bearbeitungszeit" },
    { value: "10+", label: "Text-Formate möglich" },
    { value: "1", label: "Workflow für alles" },
  ];

  return (
    <section
      id="stats-section"
      className="border-border relative z-10 border-b border-t px-4 py-12 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="divide-border grid grid-cols-2 gap-4 sm:gap-0 md:grid-cols-4 md:divide-x">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 50} direction="up">
                <div className="flex flex-col items-center px-2 py-3 text-center sm:px-8 sm:py-6 md:py-0 lg:px-16">
                  <div className="text-accent mb-1 font-serif text-3xl font-bold leading-none sm:mb-3 sm:text-5xl lg:text-7xl">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider sm:text-xs sm:tracking-widest lg:text-sm">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Main Page Component
export default function LandingPageV2() {
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
        {/* 1. Hero - Direkt auf den Punkt */}
        <HeroSectionV2 />

        {/* 2. Stats - Konkrete Zahlen */}
        <StatsSectionV2 />

        {/* 3. Problem - Warum das existiert */}
        <ProblemSectionV2 />

        {/* 4. Workflow Vergleich - Vorher/Nachher */}
        <WorkflowComparisonSection />

        {/* 5. Workflow - So funktioniert's */}
        <WorkflowStepsSection />

        {/* 6. Features */}
        <FeaturesSectionV2 />

        {/* 7. Demo Video */}
        <DemoVideoSection />

        {/* 8. Use Cases */}
        <UseCasesSection />

        {/* 9. Testimonials (placeholder) */}
        <TestimonialsSection />

        {/* 10. Beta Notice */}
        <BetaNoticeSection />

        {/* 11. Final CTA + Email Signup */}
        <FinalCTASection />
        <EmailSignup />
      </main>

      <Footer />
    </div>
  );
}

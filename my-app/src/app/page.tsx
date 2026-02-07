"use client";

import { memo, useMemo } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { EmailSignup } from "@/components/home/email-signup";

import { TestimonialsSection } from "@/components/home/testimonials-section";
import { DemoVideoSection } from "@/components/home/demo-video-section";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Sparkles,
  MessageSquare,
  Zap,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Network,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Konstanten - Editorial Modernism Spacing (mobile-optimized)
const SECTION_SPACING = "py-12 sm:py-20 lg:py-28";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Features als Konstante
const FEATURES = [
  {
    icon: Upload,
    title: "Nahtloser Upload",
    description: "Lade Videos und Audios einfach hoch – ohne Umwege",
  },
  {
    icon: Network,
    title: "Intelligente Strukturierung",
    description: "Deine Inhalte werden automatisch organisiert und durchsuchbar",
  },
  {
    icon: MessageSquare,
    title: "KI-Dialog",
    description: "Generiere Texte im Dialog mit der KI – schnell und präzise",
  },
  {
    icon: Zap,
    title: "Alles in einem",
    description: "Ein Workflow für alles – keine Tool-Wechsel mehr",
  },
] as const;

// Workflow Steps
const WORKFLOW_STEPS = [
  {
    step: "1",
    icon: Upload,
    title: "Upload",
    desc: "Lade Videos oder Audios hoch",
    href: "/upload",
    action: "Upload starten",
  },
  {
    step: "2",
    icon: FileText,
    title: "Transkription",
    desc: "Automatische Umwandlung in Text",
    href: "/upload",
    action: "Transkript ansehen",
  },
  {
    step: "3",
    icon: Network,
    title: "Strukturierung",
    desc: "Intelligente Organisation",
    href: "/chat",
    action: "Strukturierung sehen",
  },
  {
    step: "4",
    icon: Sparkles,
    title: "Text generieren",
    desc: "KI-Dialog für deine Formate",
    href: "/chat",
    action: "Text generieren",
  },
] as const;

// Target Audiences - Was Nutzer haben
const TARGET_AUDIENCES = [
  "Podcasts",
  "Videos",
  "Vorträge & Workshops",
  "Sprachmemos & Ideen",
] as const;

// Workflow Section Component - Editorial Modernism with bronze step numbers
const WorkflowSection = memo(function WorkflowSection() {
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
              Ein einfacher Workflow in vier Schritten
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4 lg:gap-12">
          {WORKFLOW_STEPS.map((item, index) => (
            <AnimatedSection key={item.step} delay={index * 100} direction="up">
              <Link href={item.href} className="group block h-full">
                <div className="flex h-full flex-col text-center">
                  {/* Bronze step number - Editorial Modernism style */}
                  <div className="text-accent mb-2 font-serif text-4xl font-bold sm:mb-4 sm:text-5xl lg:text-7xl">
                    0{item.step}
                  </div>
                  <h3 className="text-foreground group-hover:text-accent mb-2 font-sans text-sm font-medium tracking-wide uppercase transition-colors sm:mb-3 sm:text-base lg:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-2 hidden flex-grow text-xs leading-relaxed sm:mb-4 sm:block sm:text-sm">
                    {item.desc}
                  </p>
                  <div className="mt-auto">
                    <span className="text-muted-foreground group-hover:text-accent text-[10px] font-medium tracking-wide uppercase transition-colors sm:text-xs">
                      {item.action} →
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
});

// Features Section Component - Editorial Modernism
const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="features">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-8 text-center sm:mb-12 lg:mb-20">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Alles was du brauchst
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg lg:text-xl">
              Eine Plattform, die den gesamten Prozess nahtlos verbindet
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                <Card hover variant="subtle" className="h-full p-5 sm:p-8">
                  <div className="flex h-full flex-col">
                    {/* Square icon container - Editorial Modernism */}
                    <div className="bg-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-[6px] sm:mb-6 sm:h-14 sm:w-14">
                      <Icon className="text-accent h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                    </div>
                    <h3 className="text-foreground mb-2 font-serif text-lg font-semibold sm:mb-3 sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
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

// Problem Section Component - Editorial Modernism
const ProblemSection = memo(function ProblemSection() {
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
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg lg:text-xl">
                  Du hast Podcasts aufgenommen, Videos gedreht oder Workshops gehalten – aber dein
                  Wissen liegt ungenutzt auf der Festplatte.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg">
                  Der Aufwand, daraus LinkedIn-Posts, Newsletter oder Blog-Artikel zu machen, ist
                  riesig. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine
                  Textgenerierung – nichts verbindet beides nahtlos. So bleibt dein bester Content
                  ungenutzt.
                </p>
                <div className="flex flex-wrap gap-2 pt-3 sm:gap-3 sm:pt-4">
                  {TARGET_AUDIENCES.map((audience) => (
                    <Badge
                      key={audience}
                      variant="secondary"
                      className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Solution Section Component
const SolutionSection = memo(function SolutionSection() {
  const solutionPoints = useMemo(
    () => [
      "Nahtloser Upload von Videos und Audios",
      "Automatische Transkription deiner Inhalte",
      "KI-Dialog für authentische Textgenerierung",
      "Von Podcast zu LinkedIn-Post in Minuten",
    ],
    []
  );

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="solution">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-foreground mb-3 font-serif text-3xl font-bold sm:mb-4 sm:text-5xl lg:text-6xl">
                  Die Lösung
                </h2>
                <div className="bg-accent mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg lg:text-xl">
                  Verwandle deine Videos und Audios in authentischen Content.
                </p>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg">
                  Kein Ghostwriting, sondern deine echten Worte – nur schneller formatiert. Unsere
                  Plattform vereint Upload, Transkription und KI-Dialog in einem einzigen Workflow.
                  So wird aus deinem Podcast ein LinkedIn-Post, aus deinem Workshop ein Newsletter –
                  authentisch und in deiner Stimme.
                </p>
                <ul className="text-foreground/70 space-y-3 sm:space-y-4">
                  {solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4">
                      <CheckCircle2
                        className="text-foreground mt-0.5 h-4 w-4 flex-shrink-0 sm:mt-1 sm:h-5 sm:w-5"
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

// Benefits Section Component - Editorial Modernism
const BenefitsSection = memo(function BenefitsSection() {
  const benefits = useMemo(
    () => [
      {
        icon: Clock,
        title: "Zeit sparen",
        description:
          "Keine Tool-Wechsel mehr. Alles in einem Workflow – von Upload bis fertigem Text.",
      },
      {
        icon: TrendingUp,
        title: "Wissen skalieren",
        description:
          "Nutze deine bestehenden Inhalte effizient und generiere neues Material im Handumdrehen.",
      },
      {
        icon: Users,
        title: "Für alle Formate",
        description:
          "Social Media Posts, Blog-Artikel, Newsletter – generiere alles aus einem Transkript.",
      },
    ],
    []
  );

  return (
    <section
      className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
    >
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-10 text-center sm:mb-16 lg:mb-20">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Warum timax?
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg lg:text-xl">
              Die Vorteile auf einen Blick
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <AnimatedSection key={benefit.title} delay={index * 100} direction="up">
                <Card variant="default" className="h-full p-5 sm:p-8 lg:p-10">
                  {/* Bronze icon - Editorial Modernism */}
                  <Icon
                    className="text-accent mb-4 h-8 w-8 sm:mb-6 sm:h-10 sm:w-10"
                    aria-hidden="true"
                  />
                  <h3 className="text-foreground mb-2 font-serif text-xl font-semibold sm:mb-4 sm:text-2xl lg:text-3xl">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base lg:text-lg">
                    {benefit.description}
                  </p>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Demo Section Component - Editorial Modernism style
const DemoSection = memo(function DemoSection() {
  return (
    <section
      className={`relative ${SECTION_PADDING} ${SECTION_SPACING} border-border z-10 border-t`}
      id="demo"
    >
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-12">
            <div className="space-y-6 text-center sm:space-y-10">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-foreground font-serif text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                  Probiere es aus
                </h2>
                <div className="bg-accent mx-auto h-1 w-16 sm:w-24" />
                <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg lg:text-xl">
                  Lade deine Audio- oder Videodatei hoch und lass die KI das Transkript erstellen.
                </p>
              </div>
              {/* Bronze CTA - Editorial Modernism, NO scale, NO rounded-full */}
              <Button
                size="lg"
                className="group min-h-12 w-full px-6 sm:min-h-14 sm:w-auto sm:px-10"
                asChild
              >
                <Link href="/upload">
                  Datei hochladen
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

// Main Page Component
export default function Home() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="focus:bg-accent focus:text-accent-foreground focus:ring-accent sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[4px] focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2"
      >
        Zum Hauptinhalt springen
      </a>

      <MainNavigation />

      <main id="main-content" role="main">
        <HeroSection />
        <StatsSection />
        <WorkflowSection />
        <FeaturesSection />
        <ProblemSection />
        <SolutionSection />
        <DemoVideoSection />
        <TestimonialsSection />
        <BenefitsSection />
        <DemoSection />
        <EmailSignup />
      </main>

      <Footer />
    </div>
  );
}

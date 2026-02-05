"use client";

import { memo, useMemo } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { EmailSignup } from "@/components/home/email-signup";
import { GridBackground } from "@/components/home/grid-background";
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
  CheckCircle2
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
  { step: "1", icon: Upload, title: "Upload", desc: "Lade Videos oder Audios hoch", href: "/upload", action: "Upload starten" },
  { step: "2", icon: FileText, title: "Transkription", desc: "Automatische Umwandlung in Text", href: "/upload", action: "Transkript ansehen" },
  { step: "3", icon: Network, title: "Strukturierung", desc: "Intelligente Organisation", href: "/chat", action: "Strukturierung sehen" },
  { step: "4", icon: Sparkles, title: "Text generieren", desc: "KI-Dialog für deine Formate", href: "/chat", action: "Text generieren" },
] as const;

// Target Audiences
const TARGET_AUDIENCES = [
  "LinkedIn-Posts",
  "Newsletter",
  "Blog-Artikel",
  "Social Media Content",
] as const;

// Workflow Section Component - Editorial Modernism with bronze step numbers
const WorkflowSection = memo(function WorkflowSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10 border-t border-border`} id="workflow">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground">
              So funktioniert's
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Ein einfacher Workflow in vier Schritten
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {WORKFLOW_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.step} delay={index * 100} direction="up">
                <Link href={item.href} className="block h-full group">
                  <div className="text-center h-full flex flex-col">
                    {/* Bronze step number - Editorial Modernism style */}
                    <div className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-accent mb-2 sm:mb-4">
                      0{item.step}
                    </div>
                    <h3 className="font-sans text-sm sm:text-base lg:text-lg font-medium uppercase tracking-wide mb-2 sm:mb-3 text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-grow mb-2 sm:mb-4 hidden sm:block">
                      {item.desc}
                    </p>
                    <div className="mt-auto">
                      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors uppercase tracking-wide">
                        {item.action} →
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
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
          <div className="text-center mb-8 sm:mb-12 lg:mb-20">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground">
              Alles was du brauchst
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Eine Plattform, die den gesamten Prozess nahtlos verbindet
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                <Card hover variant="subtle" className="p-5 sm:p-8 h-full">
                  <div className="flex flex-col h-full">
                    {/* Square icon container - Editorial Modernism */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[6px] bg-secondary flex items-center justify-center mb-4 sm:mb-6">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-accent" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-foreground">
                  Das Problem
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mb-4 sm:mb-6" />
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Du hast Podcasts aufgenommen, Videos gedreht oder Workshops gehalten – aber dein Wissen liegt ungenutzt auf der Festplatte.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Der Aufwand, daraus LinkedIn-Posts, Newsletter oder Blog-Artikel zu machen, ist riesig. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine Textgenerierung – nichts verbindet beides nahtlos. So bleibt dein bester Content ungenutzt.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4">
                  {TARGET_AUDIENCES.map((audience) => (
                    <Badge
                      key={audience}
                      variant="secondary"
                      className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
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
  const solutionPoints = useMemo(() => [
    "Nahtloser Upload von Videos und Audios",
    "Automatische Transkription deiner Inhalte",
    "KI-Dialog für authentische Textgenerierung",
    "Von Podcast zu LinkedIn-Post in Minuten",
  ], []);

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="solution">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-foreground">
                  Die Lösung
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mb-4 sm:mb-6" />
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Verwandle deine Videos und Audios in authentischen Content.
                </p>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Kein Ghostwriting, sondern deine echten Worte – nur schneller formatiert. Unsere Plattform vereint Upload, Transkription und KI-Dialog in einem einzigen Workflow. So wird aus deinem Podcast ein LinkedIn-Post, aus deinem Workshop ein Newsletter – authentisch und in deiner Stimme.
                </p>
                <ul className="space-y-3 sm:space-y-4 text-foreground/70">
                  {solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 sm:gap-4">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground flex-shrink-0 mt-0.5 sm:mt-1" aria-hidden="true" />
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
  const benefits = useMemo(() => [
    {
      icon: Clock,
      title: "Zeit sparen",
      description: "Keine Tool-Wechsel mehr. Alles in einem Workflow – von Upload bis fertigem Text.",
    },
    {
      icon: TrendingUp,
      title: "Wissen skalieren",
      description: "Nutze deine bestehenden Inhalte effizient und generiere neues Material im Handumdrehen.",
    },
    {
      icon: Users,
      title: "Für alle Formate",
      description: "Social Media Posts, Blog-Artikel, Newsletter – generiere alles aus einem Transkript.",
    },
  ], []);

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10 border-t border-border`}>
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground">
              Warum timax?
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Die Vorteile auf einen Blick
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <AnimatedSection key={benefit.title} delay={index * 100} direction="up">
                <Card variant="default" className="p-5 sm:p-8 lg:p-10 h-full">
                  {/* Bronze icon - Editorial Modernism */}
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent mb-4 sm:mb-6" aria-hidden="true" />
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
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
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10 border-t border-border`} id="demo">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <Card variant="default" className="p-6 sm:p-10 lg:p-12">
            <div className="text-center space-y-6 sm:space-y-10">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
                  Probiere es aus
                </h2>
                <div className="w-16 sm:w-24 h-1 bg-accent mx-auto" />
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                  Lade deine Audio- oder Videodatei hoch und lass die KI das Transkript erstellen.
                </p>
              </div>
              {/* Bronze CTA - Editorial Modernism, NO scale, NO rounded-full */}
              <Button
                size="lg"
                className="group min-h-12 sm:min-h-14 px-6 sm:px-10 w-full sm:w-auto"
                asChild
              >
                <Link href="/upload">
                  Datei hochladen
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
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
    <div className="flex min-h-screen flex-col bg-background relative">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-[4px] focus:ring-2 focus:ring-accent focus:ring-offset-2"
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
    </div >
  );
}

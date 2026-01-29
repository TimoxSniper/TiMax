"use client";

import { memo, useMemo } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { DarkModeToggle } from "@/components/home/dark-mode-toggle";
import { EmailSignup } from "@/components/home/email-signup";
import { GridBackground } from "@/components/home/grid-background";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { DemoVideoSection } from "@/components/home/demo-video-section";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles, MessageSquare, Zap, Clock, TrendingUp, Users, ChevronRight, FileText, Network, ArrowRight } from "lucide-react";
import Link from "next/link";

// Konstanten
const SECTION_SPACING = "py-16 sm:py-20 lg:py-24";
const SECTION_PADDING = "px-4 sm:px-6 lg:px-8";

// Features als Konstante
const FEATURES = [
  {
    icon: Upload,
    title: "Nahtloser Upload",
    description: "Lade Videos und Audios einfach hoch – ohne Umwege",
  },
  {
    icon: Sparkles,
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

// Workflow Steps - Jetzt mit Links
const WORKFLOW_STEPS = [
  { step: "1", icon: Upload, title: "Upload", desc: "Lade Videos oder Audios hoch", href: "/text-generator", action: "Upload starten" },
  { step: "2", icon: FileText, title: "Transkription", desc: "Automatische Umwandlung in Text", href: "/text-generator", action: "Transkript ansehen" },
  { step: "3", icon: Network, title: "Strukturierung", desc: "Intelligente Organisation", href: "/text-generator", action: "Strukturierung sehen" },
  { step: "4", icon: Sparkles, title: "Text generieren", desc: "KI-Dialog für deine Formate", href: "/text-generator", action: "Text generieren" },
] as const;

// Target Audiences
const TARGET_AUDIENCES = [
  "Content-Creator",
  "Freelance Social-Media-Manager",
  "Business- und Life-Coaches",
  "Solopreneure",
  "Kleine Businesses",
] as const;

// Workflow Section Component
const WorkflowSection = memo(function WorkflowSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              So funktioniert's
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Ein einfacher Workflow in vier Schritten
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-black/10 via-black/20 to-black/10 dark:from-white/10 dark:via-white/20 dark:to-white/10 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-20">
            {WORKFLOW_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.step} delay={index * 150} direction="up">
                  <Link href={item.href} className="block h-full">
                    <GlassCard 
                      variant="subtle" 
                      hover
                      className="p-6 text-center relative h-full flex flex-col focus-within:ring-2 focus-within:ring-black/20 dark:focus-within:ring-white/20 cursor-pointer group transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-4 font-bold text-lg transition-transform group-hover:scale-110">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-black/70 dark:text-white/70 flex-grow mb-3">
                        {item.desc}
                      </p>
                      <div className="mt-auto pt-3 border-t border-black/10 dark:border-white/10">
                        <span className="text-xs font-medium text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors">
                          {item.action} →
                        </span>
                      </div>
                      {index < 3 && (
                        <ChevronRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-black/20 dark:text-white/20 w-6 h-6 group-hover:text-black/40 dark:group-hover:text-white/40 transition-colors" aria-hidden="true" />
                      )}
                    </GlassCard>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

// Features Section Component
const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="features">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Alles was du brauchst
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Eine Plattform, die den gesamten Prozess nahtlos verbindet
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                <GlassCard hover variant="subtle" className="p-8 h-full focus-within:ring-2 focus-within:ring-black/20 dark:focus-within:ring-white/20">
                  <div className="flex flex-col h-full">
                    <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10">
                      <Icon className="h-7 w-7 text-black dark:text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-black/70 dark:text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Problem Section Component
const ProblemSection = memo(function ProblemSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="problem">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <GlassCard variant="elevated" className="p-10 sm:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
                  Das Problem
                </h2>
                <p className="text-xl text-black/70 dark:text-white/70 leading-relaxed">
                  Content-Creator und Coaches kämpfen damit, aus bestehenden Videos und Audios schnell neues, passendes Textmaterial zu erstellen.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  Ihre Inhalte sind unstrukturiert verteilt und kaum durchsuchbar. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine Textgenerierung und verbinden Upload, Strukturierung und Dialog mit der KI kaum nahtlos. Dadurch verlieren die Nutzer Zeit, Ideen und Reichweite und können ihr Wissen nur begrenzt skalieren.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {TARGET_AUDIENCES.map((audience) => (
                    <Badge 
                      key={audience}
                      variant="secondary" 
                      className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0"
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Solution Section Component
const SolutionSection = memo(function SolutionSection() {
  const solutionPoints = useMemo(() => [
    "Nahtloser Upload von Videos und Audios",
    "Intelligente Strukturierung deiner Inhalte",
    "KI-Dialog für schnelle Textgenerierung",
    "Alles in einem Workflow – keine Tool-Wechsel mehr",
  ], []);

  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="solution">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <GlassCard variant="elevated" className="p-10 sm:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
                  Die Lösung
                </h2>
                <p className="text-xl text-black/70 dark:text-white/70 leading-relaxed">
                  Eine Plattform, die den gesamten Prozess nahtlos verbindet.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                  Nutze deine Video- und Audio-Bibliotheken, um schnell neues Textmaterial zu generieren. Unsere Plattform vereint Upload, intelligente Strukturierung und KI-Dialog in einem einzigen Workflow. So kannst du dein Wissen effizient skalieren, ohne zwischen verschiedenen Tools wechseln zu müssen.
                </p>
                <ul className="space-y-4 text-black/70 dark:text-white/70">
                  {solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" aria-hidden="true" />
                      <span className="text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Benefits Section Component
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
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`}>
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Warum timax?
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Die Vorteile auf einen Blick
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <AnimatedSection key={benefit.title} delay={index * 100} direction="up">
                <GlassCard variant="subtle" className="p-8 h-full focus-within:ring-2 focus-within:ring-black/20 dark:focus-within:ring-white/20">
                  <Icon className="h-10 w-10 text-black dark:text-white mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-black/70 dark:text-white/70">
                    {benefit.description}
                  </p>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// Demo Section Component
const DemoSection = memo(function DemoSection() {
  return (
    <section className={`relative ${SECTION_PADDING} ${SECTION_SPACING} z-10`} id="demo">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <GlassCard variant="elevated" className="p-10 sm:p-12">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white">
                  Probiere es aus
                </h2>
                <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
                  Erlebe den Text Generator in Aktion. Generiere verschiedene Content-Formate aus einem Beispiel-Transkript.
                </p>
              </div>
              <Button 
                size="lg" 
                className="group bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-base font-medium focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2"
                asChild
              >
                <Link href="/text-generator">
                  Zum Text Generator
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
});

// Main Page Component
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black relative">
      <DarkModeToggle />
      <GridBackground />
      
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

      <footer className="relative mt-auto border-t border-black/5 dark:border-white/5 py-12 z-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-black/50 dark:text-white/50">© 2026 timax. Coming Soon.</p>
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                href="/impressum"
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
              <Link
                href="/agb"
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
              >
                AGB
              </Link>
              <Link
                href="/widerruf"
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
              >
                Widerruf
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

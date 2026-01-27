"use client";

import { Hero } from "@/components/magic-ui/hero";
import { GlowEffect } from "@/components/magic-ui/glow-effect";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ArrowRight, Upload, Sparkles, MessageSquare, Zap, Clock, TrendingUp, Users, Star, ChevronRight, Play, FileText, Network, Moon, Sun } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const [countedStats, setCountedStats] = useState({ speed: 0, seamless: 0, scalable: 0, workflow: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const html = document.documentElement;
    const isDarkMode = html.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDark(!isDark);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => {
      if (statsElement) observer.unobserve(statsElement);
    };
  }, []);

  useEffect(() => {
    if (!statsVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Für scalable: von 0 hochzählen bis 100, dann zu ∞
      let scalableValue: number | string = 0;
      if (progress < 0.9) {
        // Zähle von 0 bis 100
        scalableValue = Math.floor(100 * (progress / 0.9));
      } else {
        // Bei 90% zu ∞ wechseln
        scalableValue = Infinity;
      }

      setCountedStats({
        speed: Math.min(Math.floor(10 * progress), 10),
        seamless: Math.min(Math.floor(100 * progress), 100),
        scalable: scalableValue,
        workflow: 1,
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend integration
    console.log("Email submitted:", email);
    alert("Vielen Dank für dein Interesse! Wir melden uns bald bei dir.");
    setEmail("");
  };

  const features = [
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
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-[40px] border border-black/10 dark:border-white/10 hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-300 shadow-lg"
        aria-label="Dark Mode umschalten"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-black dark:text-white" />
        ) : (
          <Moon className="w-5 h-5 text-black dark:text-white" />
        )}
      </button>

      {/* Grid Background Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          color: 'currentColor'
        }}
      />
      
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 overflow-hidden z-10">
        {/* Enhanced Glow-Effekte */}
        <GlowEffect 
          size="xl" 
          variant="subtle"
          className="top-1/4 -left-1/4" 
        />
        <GlowEffect 
          size="lg" 
          variant="soft"
          className="bottom-1/4 -right-1/4" 
        />
        <GlowEffect 
          size="md" 
          variant="subtle"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
        />
        
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-white/5 pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <Hero
            heading="Transformiere deine Videos und Audios in kraftvolle Texte"
            subheading="Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen."
          />
          
          <AnimatedSection delay={600} direction="up">
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-base font-medium"
                asChild
              >
                <a href="/text-generator">
                  Jetzt ausprobieren
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group border-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-base font-medium"
                asChild
              >
                <a href="#solution">
                  Mehr erfahren
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section id="stats-section" className="relative px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <GlassCard variant="subtle" className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                  {countedStats.speed}x
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">Schneller</div>
              </GlassCard>
              <GlassCard variant="subtle" className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                  {countedStats.seamless}%
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">Nahtlos</div>
              </GlassCard>
              <GlassCard variant="subtle" className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                  {countedStats.scalable === Infinity ? "∞" : countedStats.scalable}
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">Skalierbar</div>
              </GlassCard>
              <GlassCard variant="subtle" className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                  {countedStats.workflow}
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">Workflow</div>
              </GlassCard>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
                So funktioniert's
              </h2>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                Ein einfacher Workflow in vier Schritten
              </p>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Connection lines - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-black/10 via-black/20 to-black/10 dark:from-white/10 dark:via-white/20 dark:to-white/10 transform -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {[
                { step: "1", icon: Upload, title: "Upload", desc: "Lade Videos oder Audios hoch" },
                { step: "2", icon: FileText, title: "Transkription", desc: "Automatische Umwandlung in Text" },
                { step: "3", icon: Network, title: "Strukturierung", desc: "Intelligente Organisation" },
                { step: "4", icon: Sparkles, title: "Text generieren", desc: "KI-Dialog für deine Formate" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.step} delay={index * 150} direction="up">
                    <GlassCard variant="subtle" className="p-6 text-center relative h-full flex flex-col">
                      <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-black/60 dark:text-white/60 flex-grow">
                        {item.desc}
                      </p>
                      {index < 3 && (
                        <ChevronRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-black/20 dark:text-white/20 w-6 h-6" />
                      )}
                    </GlassCard>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10" id="features">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
                Alles was du brauchst
              </h2>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                Eine Plattform, die den gesamten Prozess nahtlos verbindet
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                  <GlassCard hover variant="subtle" className="p-8 h-full">
                    <div className="flex flex-col h-full">
                      <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10">
                        <Icon className="h-7 w-7 text-black dark:text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-black/60 dark:text-white/60 leading-relaxed">
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

      {/* Problem Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10" id="problem">
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
                  <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                    Ihre Inhalte sind unstrukturiert verteilt und kaum durchsuchbar. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine Textgenerierung und verbinden Upload, Strukturierung und Dialog mit der KI kaum nahtlos. Dadurch verlieren die Nutzer Zeit, Ideen und Reichweite und können ihr Wissen nur begrenzt skalieren.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0">
                      Content-Creator
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0">
                      Freelance Social-Media-Manager
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0">
                      Business- und Life-Coaches
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0">
                      Solopreneure
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-0">
                      Kleine Businesses
                    </Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10" id="solution">
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
                  <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                    Nutze deine Video- und Audio-Bibliotheken, um schnell neues Textmaterial zu generieren. Unsere Plattform vereint Upload, intelligente Strukturierung und KI-Dialog in einem einzigen Workflow. So kannst du dein Wissen effizient skalieren, ohne zwischen verschiedenen Tools wechseln zu müssen.
                  </p>
                  <ul className="space-y-4 text-black/60 dark:text-white/60">
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" />
                      <span className="text-lg">Nahtloser Upload von Videos und Audios</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" />
                      <span className="text-lg">Intelligente Strukturierung deiner Inhalte</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" />
                      <span className="text-lg">KI-Dialog für schnelle Textgenerierung</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" />
                      <span className="text-lg">Alles in einem Workflow – keine Tool-Wechsel mehr</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Screenshot/Mockup Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
                Sieh es in Aktion
              </h2>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                Eine Vorschau der Plattform
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200} direction="up">
            <GlassCard variant="elevated" className="p-4 sm:p-6 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Play className="w-16 h-16 mx-auto text-black/40 dark:text-white/40" />
                  <p className="text-black/50 dark:text-white/50 text-sm">
                    Demo-Video kommt bald
                  </p>
                </div>
                {/* Subtle grid overlay */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px',
                  }}
                />
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
                Was Nutzer sagen
              </h2>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                Echte Erfahrungen von Beta-Nutzern
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                role: "Content Creator",
                text: "Endlich muss ich nicht mehr zwischen fünf verschiedenen Tools wechseln. TiMax hat meinen Workflow komplett revolutioniert.",
                rating: 5,
              },
              {
                name: "Michael K.",
                role: "Business Coach",
                text: "Die Zeitersparnis ist enorm. Aus einem Video-Transkript generiere ich jetzt Posts, Newsletter und Blog-Artikel.",
                rating: 5,
              },
              {
                name: "Lisa T.",
                role: "Social Media Manager",
                text: "Die KI-Dialog-Funktion ist genial. Ich kann genau die Formate generieren, die ich brauche – schnell und präzise.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 100} direction="up">
                <GlassCard variant="subtle" className="p-8 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-black/70 dark:text-white/70 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-black dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-black/50 dark:text-white/50">
                      {testimonial.role}
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
                Warum TiMax?
              </h2>
              <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                Die Vorteile auf einen Blick
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedSection delay={0} direction="up">
              <GlassCard variant="subtle" className="p-8 h-full">
                <Clock className="h-10 w-10 text-black dark:text-white mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                  Zeit sparen
                </h3>
                <p className="text-black/60 dark:text-white/60">
                  Keine Tool-Wechsel mehr. Alles in einem Workflow – von Upload bis fertigem Text.
                </p>
              </GlassCard>
            </AnimatedSection>
            <AnimatedSection delay={100} direction="up">
              <GlassCard variant="subtle" className="p-8 h-full">
                <TrendingUp className="h-10 w-10 text-black dark:text-white mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                  Wissen skalieren
                </h3>
                <p className="text-black/60 dark:text-white/60">
                  Nutze deine bestehenden Inhalte effizient und generiere neues Material im Handumdrehen.
                </p>
              </GlassCard>
            </AnimatedSection>
            <AnimatedSection delay={200} direction="up">
              <GlassCard variant="subtle" className="p-8 h-full">
                <Users className="h-10 w-10 text-black dark:text-white mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                  Für alle Formate
                </h3>
                <p className="text-black/60 dark:text-white/60">
                  Social Media Posts, Blog-Artikel, Newsletter – generiere alles aus einem Transkript.
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Additional Glow Effects */}
      <GlowEffect 
        size="md" 
        variant="soft"
        className="fixed top-1/3 right-1/4 z-0" 
      />

      {/* Demo Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10" id="demo">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection direction="up">
            <GlassCard variant="elevated" className="p-10 sm:p-12">
              <div className="text-center space-y-10">
                <div className="space-y-6">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white">
                    Probiere es aus
                  </h2>
                  <p className="text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
                    Erlebe den Text Generator in Aktion. Generiere verschiedene Content-Formate aus einem Beispiel-Transkript.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="group bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-base font-medium"
                  asChild
                >
                  <a href="/text-generator">
                    Zum Text Generator
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Call to Action Section */}
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
                      className="w-full bg-white/70 dark:bg-black/70 backdrop-blur-[40px] border border-black/10 dark:border-white/10 focus:border-black/20 dark:focus:border-white/20 rounded-full px-6 py-4 text-base transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
                      style={{
                        backdropFilter: "blur(40px) saturate(180%)",
                        WebkitBackdropFilter: "blur(40px) saturate(180%)",
                      }}
                      aria-label="E-Mail-Adresse für Anmeldung"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] rounded-full px-8 py-6 text-base font-medium" 
                    size="lg"
                  >
                    Jetzt anmelden
                  </Button>
                </form>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-black/5 dark:border-white/5 py-12 z-10">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-black/50 dark:text-white/50">© 2024 TiMax. Coming Soon.</p>
        </div>
      </footer>
    </div>
  );
}

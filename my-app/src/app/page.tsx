"use client";

import { Hero } from "@/components/magic-ui/hero";
import { GlowEffect } from "@/components/magic-ui/glow-effect";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ArrowRight, Upload, Sparkles, MessageSquare, Zap } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");

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
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Glow-Effekte */}
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

      {/* Features Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="features">
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
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="problem">
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
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="solution">
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

      {/* Demo Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="demo">
        <div className="container mx-auto max-w-4xl">
          <AnimatedSection direction="up">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="cta">
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
      <footer className="mt-auto border-t border-black/5 dark:border-white/5 py-12">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-black/50 dark:text-white/50">© 2024 TiMax. Coming Soon.</p>
        </div>
      </footer>
    </div>
  );
}

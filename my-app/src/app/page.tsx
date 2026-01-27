"use client";

import { Hero } from "@/components/magic-ui/hero";
import { GlowEffect } from "@/components/magic-ui/glow-effect";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section mit Linear-ähnlichem Start-Effekt */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow-Effekte im Hintergrund */}
        <GlowEffect 
          size="xl" 
          color="primary" 
          className="top-1/4 -left-1/4 blur-[120px]" 
        />
        <GlowEffect 
          size="lg" 
          color="accent" 
          className="bottom-1/4 -right-1/4 blur-[100px]" 
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
                className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105"
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
                className="group border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="#solution">
                  Mehr erfahren
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <AnimatedSection delay={1000} direction="fade">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="features">
        <div className="container mx-auto max-w-6xl">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Alles was du brauchst
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Eine Plattform, die den gesamten Prozess nahtlos verbindet
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={feature.title} delay={index * 100} direction="up">
                  <GlassCard hover>
                    <Card className="border-0 bg-transparent shadow-none">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </GlassCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-muted/20" id="problem">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection direction="up">
            <GlassCard>
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-3xl sm:text-4xl mb-2">Das Problem</CardTitle>
                  <CardDescription className="text-lg">
                    Content-Creator und Coaches kämpfen damit, aus bestehenden Videos und Audios schnell neues, passendes Textmaterial zu erstellen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Ihre Inhalte sind unstrukturiert verteilt und kaum durchsuchbar. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine Textgenerierung und verbinden Upload, Strukturierung und Dialog mit der KI kaum nahtlos. Dadurch verlieren die Nutzer Zeit, Ideen und Reichweite und können ihr Wissen nur begrenzt skalieren.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Badge variant="secondary" className="text-sm px-3 py-1">Content-Creator</Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Freelance Social-Media-Manager</Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Business- und Life-Coaches</Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Solopreneure</Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">Kleine Businesses</Badge>
                  </div>
                </CardContent>
              </Card>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8" id="solution">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection direction="up">
            <GlassCard>
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-3xl sm:text-4xl mb-2">Die Lösung</CardTitle>
                  <CardDescription className="text-lg">
                    Eine Plattform, die den gesamten Prozess nahtlos verbindet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Nutze deine Video- und Audio-Bibliotheken, um schnell neues Textmaterial zu generieren. Unsere Plattform vereint Upload, intelligente Strukturierung und KI-Dialog in einem einzigen Workflow. So kannst du dein Wissen effizient skalieren, ohne zwischen verschiedenen Tools wechseln zu müssen.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Nahtloser Upload von Videos und Audios</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Intelligente Strukturierung deiner Inhalte</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>KI-Dialog für schnelle Textgenerierung</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Alles in einem Workflow – keine Tool-Wechsel mehr</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-muted/20" id="demo">
        <div className="container mx-auto max-w-5xl">
          <AnimatedSection direction="up">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Probiere es aus</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Erlebe den Text Generator in Aktion. Generiere verschiedene Content-Formate aus einem Beispiel-Transkript.
                </p>
              </div>
              <Button 
                size="lg" 
                className="group bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105"
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
            <GlassCard>
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl sm:text-4xl mb-2">Bereit loszulegen?</CardTitle>
                  <CardDescription className="text-lg">
                    Melde dich an und sei einer der Ersten, die Zugang erhalten.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
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
                        className="w-full bg-background/50 backdrop-blur-sm border-2 focus:border-primary transition-colors"
                        aria-label="E-Mail-Adresse für Anmeldung"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]" 
                      size="lg"
                    >
                      Jetzt anmelden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/50 py-12">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2024 TiMax. Coming Soon.</p>
        </div>
      </footer>
    </div>
  );
}

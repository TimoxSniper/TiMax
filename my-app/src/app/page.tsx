"use client";

import { Hero } from "@/components/magic-ui/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Backend integration
    console.log("Email submitted:", email);
    alert("Vielen Dank für dein Interesse! Wir melden uns bald bei dir.");
    setEmail("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <Hero
            heading="Transformiere deine Videos und Audios in kraftvolle Texte"
            subheading="Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen."
          />
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild>
              <a href="/text-generator">
                Jetzt ausprobieren →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-5xl" />

      {/* Problem & Audience Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" id="problem">
        <div className="container mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Das Problem</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Content-Creator und Coaches kämpfen damit, aus bestehenden Videos und Audios schnell neues, passendes Textmaterial zu erstellen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ihre Inhalte sind unstrukturiert verteilt und kaum durchsuchbar. Aktuelle Tools fokussieren entweder nur auf Transkription oder reine Textgenerierung und verbinden Upload, Strukturierung und Dialog mit der KI kaum nahtlos. Dadurch verlieren die Nutzer Zeit, Ideen und Reichweite und können ihr Wissen nur begrenzt skalieren.
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                <Badge variant="secondary">Content-Creator</Badge>
                <Badge variant="secondary">Freelance Social-Media-Manager</Badge>
                <Badge variant="secondary">Business- und Life-Coaches</Badge>
                <Badge variant="secondary">Solopreneure</Badge>
                <Badge variant="secondary">Kleine Businesses</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" id="solution">
        <div className="container mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Die Lösung</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Eine Plattform, die den gesamten Prozess nahtlos verbindet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Nutze deine Video- und Audio-Bibliotheken, um schnell neues Textmaterial zu generieren. Unsere Plattform vereint Upload, intelligente Strukturierung und KI-Dialog in einem einzigen Workflow. So kannst du dein Wissen effizient skalieren, ohne zwischen verschiedenen Tools wechseln zu müssen.
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Nahtloser Upload von Videos und Audios</li>
                <li>Intelligente Strukturierung deiner Inhalte</li>
                <li>KI-Dialog für schnelle Textgenerierung</li>
                <li>Alles in einem Workflow – keine Tool-Wechsel mehr</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30" id="demo">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Probiere es aus</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Erlebe den Text Generator in Aktion. Generiere verschiedene Content-Formate aus einem Beispiel-Transkript.
              </p>
            </div>
            <Button size="lg" asChild>
              <a href="/text-generator">
                Zum Text Generator →
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8" id="cta">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">Bereit loszulegen?</CardTitle>
              <CardDescription className="text-base sm:text-lg">
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
                    className="w-full"
                    aria-label="E-Mail-Adresse für Anmeldung"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Jetzt anmelden
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 TiMax. Coming Soon.</p>
        </div>
      </footer>
    </div>
  );
}

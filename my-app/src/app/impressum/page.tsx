import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getLegalPageSchema } from "@/lib/schema";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum und rechtliche Angaben zu timax - Angaben gemäß § 5 TMG. Firmensitz, Kontaktdaten und Handelsregistereintrag.",
  alternates: {
    canonical: "/impressum",
  },
  openGraph: {
    title: "Impressum - timax",
    description: "Impressum und rechtliche Angaben zu timax gemäß § 5 TMG",
    type: "website",
    locale: "de_DE",
  },
};

export default function ImpressumPage() {
  return (
    <main className="bg-background min-h-screen">
      <JsonLd data={getLegalPageSchema("impressum")} />
      <div className="container mx-auto max-w-3xl px-4 py-16 lg:py-24">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-accent mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>

        <article className="max-w-none">
          <header className="mb-16">
            <h1 className="text-foreground mb-6 font-serif text-5xl font-bold lg:text-6xl">
              Impressum
            </h1>
            <div className="bg-accent mb-8 h-1 w-24" />
            <p className="text-muted-foreground font-sans text-xs font-medium tracking-wide uppercase">
              Angaben gemäß § 5 TMG
            </p>
          </header>

          <section className="text-foreground space-y-12 font-sans text-base leading-relaxed lg:text-lg">
            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="mb-2">
                <strong>timax</strong>
              </p>
              <p className="mb-2">
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [FIRMENNAME HIER EINTRAGEN]
                </span>
                <br />
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [VOLLSTÄNDIGE ANSCHRIFT - KEIN POSTFACH!]
                </span>
                <br />
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [PLZ ORT LAND]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Kontakt</h3>
              <p className="mb-2">
                E-Mail:{" "}
                <a href="mailto:info@timax.app" className="text-primary hover:underline">
                  info@timax.app
                </a>
              </p>
              <p className="mb-2">Telefon: +49 176 5569211</p>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Vertretungsberechtigte Person(en)
              </h3>
              <p>
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [NAME DES GESCHÄFTSFÜHRERS / VERTRETUNGSBERECHTIGTEN]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Handelsregister</h3>
              <p className="mb-2">
                Registergericht:{" "}
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [z.B. Amtsgericht München - falls GmbH/UG]
                </span>
              </p>
              <p>
                Registernummer:{" "}
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [z.B. HRB 123456 - falls GmbH/UG]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Umsatzsteuer-ID</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:{" "}
                <span className="rounded bg-red-100 px-2 py-1 font-bold text-red-600 dark:bg-red-900/30">
                  [DE123456789 - falls vorhanden]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Aufsichtsbehörde</h3>
              <p>
                <span className="text-gray-500 italic dark:text-gray-400">
                  [Falls relevant für bestimmte Branchen, sonst leer lassen]
                </span>
              </p>
            </div>

            <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
              <p className="text-sm text-black/60 dark:text-white/60">
                Stand:{" "}
                {new Date().toLocaleDateString("de-DE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

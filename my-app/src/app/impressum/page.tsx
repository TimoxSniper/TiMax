import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Impressum - timax",
  description: "Impressum und rechtliche Angaben zu timax",
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-16 lg:py-24">
        <Button
          variant="ghost"
          asChild
          className="mb-8 text-muted-foreground hover:text-accent"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>

        <article className="max-w-none">
          <header className="mb-16">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Impressum
            </h1>
            <div className="w-24 h-1 bg-accent mb-8" />
            <p className="font-sans text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Angaben gemäß § 5 TMG
            </p>
          </header>

          <section className="space-y-12 font-sans text-base lg:text-lg leading-relaxed text-foreground">
            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="mb-2">
                <strong>timax</strong>
              </p>
              <p className="mb-2">
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [FIRMENNAME HIER EINTRAGEN]
                </span>
                <br />
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [VOLLSTÄNDIGE ANSCHRIFT - KEIN POSTFACH!]
                </span>
                <br />
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [PLZ ORT LAND]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Kontakt
              </h3>
              <p className="mb-2">
                E-Mail: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
              <p className="mb-2">
                Telefon: <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">[+49 XXX XXXXXXX]</span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Vertretungsberechtigte Person(en)
              </h3>
              <p>
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [NAME DES GESCHÄFTSFÜHRERS / VERTRETUNGSBERECHTIGTEN]
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Handelsregister
              </h3>
              <p className="mb-2">
                Registergericht: <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">[z.B. Amtsgericht München - falls GmbH/UG]</span>
              </p>
              <p>
                Registernummer: <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">[z.B. HRB 123456 - falls GmbH/UG]</span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Umsatzsteuer-ID
              </h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">[DE123456789 - falls vorhanden]</span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Aufsichtsbehörde
              </h3>
              <p>
                <span className="text-gray-500 dark:text-gray-400 italic">
                  [Falls relevant für bestimmte Branchen, sonst leer lassen]
                </span>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
              <p className="text-sm text-black/60 dark:text-white/60">
                Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}


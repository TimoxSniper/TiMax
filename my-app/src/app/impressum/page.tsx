import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Impressum - timax",
  description: "Impressum und rechtliche Angaben zu timax",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <Button
          variant="ghost"
          asChild
          className="mb-8 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Link>
        </Button>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
            Impressum
          </h1>

          <section className="space-y-6 text-black/80 dark:text-white/80">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="mb-2">
                <strong>timax</strong>
              </p>
              <p className="mb-2">
                {/* TODO: Hier die tatsächlichen Firmendaten eintragen */}
                [Firmenname / Name]
                <br />
                [Vollständige Anschrift - kein Postfach!]
                <br />
                [PLZ Ort]
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Kontakt
              </h3>
              <p className="mb-2">
                E-Mail: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
              <p className="mb-2">
                Telefon: {/* TODO: Telefonnummer eintragen */}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Vertretungsberechtigte Person(en)
              </h3>
              <p>
                {/* TODO: Name der vertretungsberechtigten Person(en) */}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Handelsregister
              </h3>
              <p className="mb-2">
                Registergericht: {/* TODO: Falls vorhanden */}
              </p>
              <p>
                Registernummer: {/* TODO: Falls vorhanden */}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Umsatzsteuer-ID
              </h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: {/* TODO: Falls vorhanden */}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Aufsichtsbehörde
              </h3>
              <p>
                {/* TODO: Falls relevant, z.B. für bestimmte Branchen */}
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
    </div>
  );
}


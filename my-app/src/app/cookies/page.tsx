import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getLegalPageSchema } from "@/lib/schema";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie",
  description: "Cookie-Richtlinie von timax - Welche Cookies wir verwenden und wie Sie Ihre Einstellungen verwalten können. DSGVO-konform.",
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: "Cookie-Richtlinie - timax",
    description: "Informationen über die Verwendung von Cookies auf timax",
    type: "website",
    locale: "de_DE",
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={getLegalPageSchema('cookies')} />
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
              Cookie-Richtlinie
            </h1>
            <div className="w-24 h-1 bg-accent mb-8" />
            <p className="font-sans text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Informationen über Cookies
            </p>
          </header>

          <section className="space-y-12 font-sans text-base lg:text-lg leading-relaxed text-foreground">
            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Was sind Cookies?
              </h2>
              <p className="mb-4">
                Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen es der Website, sich an Ihre Präferenzen zu erinnern und Ihr Nutzererlebnis zu verbessern.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Wie verwenden wir Cookies?
              </h2>
              <p className="mb-4">
                timax verwendet Cookies für folgende Zwecke:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Technisch notwendige Cookies:</strong> Diese sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</li>
                <li><strong>Funktionale Cookies:</strong> Diese speichern Ihre Präferenzen (z.B. Dark Mode) und verbessern die Funktionalität.</li>
                <li><strong>Analytics Cookies:</strong> Diese helfen uns zu verstehen, wie Besucher unsere Website nutzen (nur mit Ihrer Einwilligung).</li>
              </ul>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Cookie-Liste
              </h2>
              
              <div className="space-y-6">
                <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Technisch notwendige Cookies
                  </h3>
                  <table className="w-full text-sm mt-4">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="text-left py-2 font-semibold">Name</th>
                        <th className="text-left py-2 font-semibold">Zweck</th>
                        <th className="text-left py-2 font-semibold">Laufzeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-2">session_id</td>
                        <td className="py-2">Session-Verwaltung</td>
                        <td className="py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Funktionale Cookies
                  </h3>
                  <table className="w-full text-sm mt-4">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="text-left py-2 font-semibold">Name</th>
                        <th className="text-left py-2 font-semibold">Zweck</th>
                        <th className="text-left py-2 font-semibold">Laufzeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-2">theme</td>
                        <td className="py-2">Dark Mode Präferenz</td>
                        <td className="py-2">1 Jahr</td>
                      </tr>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-2">cookie_consent</td>
                        <td className="py-2">Cookie-Einstellungen speichern</td>
                        <td className="py-2">1 Jahr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    Analytics Cookies (optional)
                  </h3>
                  <p className="mb-4 text-sm">
                    Diese Cookies werden nur mit Ihrer Einwilligung gesetzt.
                  </p>
                  <table className="w-full text-sm mt-4">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="text-left py-2 font-semibold">Name</th>
                        <th className="text-left py-2 font-semibold">Zweck</th>
                        <th className="text-left py-2 font-semibold">Laufzeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-2">_analytics</td>
                        <td className="py-2">Nutzungsstatistiken</td>
                        <td className="py-2">2 Jahre</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Cookie-Einstellungen verwalten
              </h2>
              <p className="mb-4">
                Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner oder in den Einstellungen ändern. Technisch notwendige Cookies können nicht deaktiviert werden, da sie für die Grundfunktionen der Website erforderlich sind.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Drittanbieter-Cookies
              </h2>
              <p className="mb-4">
                Wir verwenden derzeit keine Drittanbieter-Cookies für Werbung oder Tracking. Sollte sich dies ändern, werden wir Sie darüber informieren und Ihre Einwilligung einholen.
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


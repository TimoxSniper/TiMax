import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getLegalPageSchema } from "@/lib/schema";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie",
  description:
    "Cookie-Richtlinie von timax - Welche Cookies wir verwenden und wie Sie Ihre Einstellungen verwalten können. DSGVO-konform.",
  alternates: {
    canonical: "/cookies",
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
    <main className="bg-background min-h-screen">
      <JsonLd data={getLegalPageSchema("cookies")} />
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
              Cookie-Richtlinie
            </h1>
            <div className="bg-accent mb-8 h-1 w-24" />
            <p className="text-muted-foreground font-sans text-xs font-medium tracking-wide uppercase">
              Informationen über Cookies
            </p>
          </header>

          <section className="text-foreground space-y-12 font-sans text-base leading-relaxed lg:text-lg">
            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Was sind Cookies?
              </h2>
              <p className="mb-4">
                Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden, wenn Sie
                eine Website besuchen. Sie ermöglichen es der Website, sich an Ihre Präferenzen zu
                erinnern und Ihr Nutzererlebnis zu verbessern.
              </p>
            </div>

            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Wie verwenden wir Cookies?
              </h2>
              <p className="mb-4">timax verwendet Cookies für folgende Zwecke:</p>
              <ul className="mb-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Technisch notwendige Cookies:</strong> Diese sind für die Grundfunktionen
                  der Website erforderlich und können nicht deaktiviert werden.
                </li>
                <li>
                  <strong>Funktionale Cookies:</strong> Diese speichern Ihre Präferenzen (z.B. Dark
                  Mode) und verbessern die Funktionalität.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Diese helfen uns zu verstehen, wie Besucher
                  unsere Website nutzen (nur mit Ihrer Einwilligung).
                </li>
              </ul>
            </div>

            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Cookie-Liste
              </h2>

              <div className="space-y-6">
                <div className="rounded-lg bg-black/5 p-6 dark:bg-white/5">
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    Technisch notwendige Cookies
                  </h3>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="py-2 text-left font-semibold">Name</th>
                        <th className="py-2 text-left font-semibold">Zweck</th>
                        <th className="py-2 text-left font-semibold">Laufzeit</th>
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

                <div className="rounded-lg bg-black/5 p-6 dark:bg-white/5">
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    Funktionale Cookies
                  </h3>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="py-2 text-left font-semibold">Name</th>
                        <th className="py-2 text-left font-semibold">Zweck</th>
                        <th className="py-2 text-left font-semibold">Laufzeit</th>
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

                <div className="rounded-lg bg-black/5 p-6 dark:bg-white/5">
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    Analytics Cookies (optional)
                  </h3>
                  <p className="mb-4 text-sm">
                    Diese Cookies werden nur mit Ihrer Einwilligung gesetzt.
                  </p>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10">
                        <th className="py-2 text-left font-semibold">Name</th>
                        <th className="py-2 text-left font-semibold">Zweck</th>
                        <th className="py-2 text-left font-semibold">Laufzeit</th>
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

            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Cookie-Einstellungen verwalten
              </h2>
              <p className="mb-4">
                Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner oder in den
                Einstellungen ändern. Technisch notwendige Cookies können nicht deaktiviert werden,
                da sie für die Grundfunktionen der Website erforderlich sind.
              </p>
            </div>

            <div className="border-border border-t pt-8">
              <h2 className="text-foreground mb-4 font-serif text-3xl font-semibold">
                Drittanbieter-Cookies
              </h2>
              <p className="mb-4">
                Wir verwenden derzeit keine Drittanbieter-Cookies für Werbung oder Tracking. Sollte
                sich dies ändern, werden wir Sie darüber informieren und Ihre Einwilligung einholen.
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

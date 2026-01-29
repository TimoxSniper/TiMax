import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Cookie-Richtlinie - timax",
  description: "Informationen über die Verwendung von Cookies",
};

export default function CookiesPage() {
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
            Cookie-Richtlinie
          </h1>

          <section className="space-y-8 text-black/80 dark:text-white/80">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Was sind Cookies?
              </h2>
              <p className="mb-4">
                Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen es der Website, sich an Ihre Präferenzen zu erinnern und Ihr Nutzererlebnis zu verbessern.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
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

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Cookie-Liste
              </h2>
              
              <div className="space-y-6">
                <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
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
                  <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
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
                  <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
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

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Cookie-Einstellungen verwalten
              </h2>
              <p className="mb-4">
                Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner oder in den Einstellungen ändern. Technisch notwendige Cookies können nicht deaktiviert werden, da sie für die Grundfunktionen der Website erforderlich sind.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
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
    </div>
  );
}


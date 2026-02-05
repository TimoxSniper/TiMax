import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getLegalPageSchema } from "@/lib/schema";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung für Verbraucher - 14-tägiges Widerrufsrecht bei timax. Muster-Widerrufsformular und Fristen.",
  alternates: {
    canonical: '/widerruf',
  },
  openGraph: {
    title: "Widerrufsbelehrung - timax",
    description: "14-tägiges Widerrufsrecht für Verbraucher bei timax",
    type: "website",
    locale: "de_DE",
  },
};

export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={getLegalPageSchema('widerruf')} />
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
              Widerrufsbelehrung
            </h1>
            <div className="w-24 h-1 bg-accent mb-8" />
            <p className="font-sans text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Ihre Widerrufsrechte
            </p>
          </header>

          <section className="space-y-12 font-sans text-base lg:text-lg leading-relaxed text-foreground">
            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Widerrufsrecht
              </h2>
              <p className="mb-4">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p className="mb-4">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p>
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
              </p>
              <p className="mb-2 mt-4">
                <strong>
                  <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                    [FIRMENNAME HIER EINTRAGEN]
                  </span>
                </strong>
                <br />
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [VOLLSTÄNDIGE ANSCHRIFT]
                </span>
                <br />
                <span className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                  [PLZ ORT]
                </span>
                <br />
                E-Mail: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
              <p className="mb-4">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür auch das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Folgen des Widerrufs
              </h2>
              <p className="mb-4">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Ausschluss des Widerrufsrechts
              </h2>
              <p className="mb-4">
                Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung von digitalen Inhalten, wenn timax mit der Ausführung des Vertrags begonnen hat und Sie ausdrücklich zugestimmt haben, dass timax mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt und Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
              </p>
              <p>
                Das bedeutet: Wenn Sie unseren Service bereits genutzt haben (z.B. Transkription oder Textgenerierung durchgeführt wurde), erlischt das Widerrufsrecht, da es sich um eine bereits erbrachte digitale Dienstleistung handelt.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                Muster-Widerrufsformular
              </h2>
              <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg mb-4">
                <p className="mb-4">
                  (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
                </p>
                <p className="mb-2">
                  An: timax, [Anschrift], E-Mail: info@timax.app
                </p>
                <p className="mb-4">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/ die Erbringung der folgenden Dienstleistung (*)
                </p>
                <p className="mb-2">
                  Bestellt am (*)/erhalten am (*): _________________
                </p>
                <p className="mb-2">
                  Name des/der Verbraucher(s): _________________
                </p>
                <p className="mb-2">
                  Anschrift des/der Verbraucher(s): _________________
                </p>
                <p className="mb-2">
                  Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________
                </p>
                <p className="mb-2">
                  Datum: _________________
                </p>
                <p className="text-sm mt-4">
                  (*) Unzutreffendes streichen.
                </p>
              </div>
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


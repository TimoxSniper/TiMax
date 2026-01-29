import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Widerrufsbelehrung - timax",
  description: "Widerrufsbelehrung für Verbraucher",
};

export default function WiderrufPage() {
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
            Widerrufsbelehrung
          </h1>

          <section className="space-y-8 text-black/80 dark:text-white/80">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
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
                <strong>timax</strong>
                <br />
                {/* TODO: Firmendaten eintragen */}
                [Anschrift]
                <br />
                E-Mail: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
              <p className="mb-4">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür auch das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Folgen des Widerrufs
              </h2>
              <p className="mb-4">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Ausschluss des Widerrufsrechts
              </h2>
              <p className="mb-4">
                Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung von digitalen Inhalten, wenn timax mit der Ausführung des Vertrags begonnen hat und Sie ausdrücklich zugestimmt haben, dass timax mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt und Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
              </p>
              <p>
                Das bedeutet: Wenn Sie unseren Service bereits genutzt haben (z.B. Transkription oder Textgenerierung durchgeführt wurde), erlischt das Widerrufsrecht, da es sich um eine bereits erbrachte digitale Dienstleistung handelt.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
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
    </div>
  );
}


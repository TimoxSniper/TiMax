import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Allgemeine Geschäftsbedingungen - timax",
  description: "AGB von timax",
};

export default function AGBPage() {
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
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <section className="space-y-8 text-black/80 dark:text-white/80">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                1. Geltungsbereich
              </h2>
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen der timax Plattform (nachfolgend "timax" oder "wir") zur automatischen Transkription von Videos und Audios sowie zur KI-gestützten Textgenerierung.
              </p>
              <p>
                Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                2. Leistungsumfang
              </h2>
              <p className="mb-4">
                timax bietet folgende Leistungen an:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Upload und Speicherung von Video- und Audio-Dateien</li>
                <li>Automatische Transkription von Videos und Audios mittels KI (Whisper API)</li>
                <li>KI-gestützte Textgenerierung aus Transkripten in verschiedenen Formaten (Social Media Posts, Blog-Artikel, Newsletter, etc.)</li>
                <li>Chat-Interface für Dialog mit der KI</li>
                <li>Verwaltung und Organisation von Transkripten und generierten Texten</li>
              </ul>
              <p>
                Der genaue Leistungsumfang richtet sich nach dem gewählten Tarif. timax behält sich vor, die Leistungen zu erweitern, zu ändern oder einzustellen, soweit dies technisch erforderlich ist oder gesetzlichen Bestimmungen entspricht.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                3. Vertragsschluss
              </h2>
              <p className="mb-4">
                Der Vertrag kommt durch die Registrierung des Nutzers und die Annahme dieser AGB zustande. Mit der Registrierung erklärt der Nutzer, dass er die AGB gelesen, verstanden und akzeptiert hat.
              </p>
              <p>
                timax behält sich vor, Registrierungen ohne Angabe von Gründen abzulehnen.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                4. Preise und Zahlungsbedingungen
              </h2>
              <p className="mb-4">
                {/* TODO: Preise eintragen, falls kostenpflichtig */}
                Die Preise für die Nutzung von timax richten sich nach dem gewählten Tarif. Alle Preise verstehen sich in Euro und enthalten die gesetzliche Mehrwertsteuer.
              </p>
              <p className="mb-4">
                Zahlungen sind sofort fällig. Bei Zahlungsverzug behält sich timax vor, den Zugang zum Service zu sperren.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                5. Nutzungsrechte
              </h2>
              <h3 className="text-xl font-semibold mb-2 mt-4 text-black dark:text-white">
                5.1 Rechte an hochgeladenen Inhalten
              </h3>
              <p className="mb-4">
                Der Nutzer behält alle Rechte an den von ihm hochgeladenen Videos und Audios. Mit dem Upload räumt der Nutzer timax das Recht ein, die Dateien zur Erbringung der Dienstleistung (Transkription, Textgenerierung) zu verwenden.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-black dark:text-white">
                5.2 Rechte an generierten Inhalten
              </h3>
              <p className="mb-4">
                Alle durch timax generierten Transkripte und Texte stehen dem Nutzer zur freien Verwendung zur Verfügung. timax erhebt keine Rechte an generierten Inhalten. Der Nutzer kann die generierten Inhalte für beliebige Zwecke nutzen, verändern und verbreiten.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                6. Haftungsbeschränkung für KI-Inhalte
              </h2>
              <p className="mb-4">
                <strong>WICHTIG:</strong> KI-generierte Transkripte und Texte können Fehler, Ungenauigkeiten oder Halluzinationen enthalten. Der Nutzer ist verpflichtet, alle generierten Inhalte vor Veröffentlichung oder Verwendung sorgfältig zu überprüfen.
              </p>
              <p className="mb-4">
                timax haftet nicht für:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Fehlerhafte oder unvollständige Transkriptionen</li>
                <li>Ungenauigkeiten in generierten Texten</li>
                <li>Halluzinationen oder falsche Informationen in KI-generierten Inhalten</li>
                <li>Schäden, die durch die Verwendung fehlerhafter KI-Generierungen entstehen</li>
                <li>Urheberrechtsverletzungen durch KI-generierte Inhalte (der Nutzer ist für die Prüfung verantwortlich)</li>
              </ul>
              <p>
                Der Nutzer trägt die alleinige Verantwortung für die Verwendung der generierten Inhalte.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                7. Upload-Beschränkungen
              </h2>
              <p className="mb-4">
                Der Nutzer verpflichtet sich, nur Dateien hochzuladen, die:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>den geltenden Gesetzen entsprechen</li>
                <li>keine Urheberrechtsverletzungen enthalten</li>
                <li>keine illegalen, beleidigenden oder diffamierenden Inhalte enthalten</li>
                <li>keine Malware oder schädlichen Code enthalten</li>
                <li>die maximal erlaubte Dateigröße nicht überschreiten (aktuell: 100MB pro Datei)</li>
                <li>in den erlaubten Formaten vorliegen (MP3, MP4, WAV, M4A, WebM)</li>
              </ul>
              <p>
                timax behält sich vor, Inhalte zu löschen, die gegen diese Bestimmungen verstoßen, und den Zugang des Nutzers zu sperren.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                8. Verfügbarkeit und Störungen
              </h2>
              <p className="mb-4">
                timax bemüht sich um eine hohe Verfügbarkeit des Services. Eine 100%ige Verfügbarkeit kann jedoch nicht garantiert werden. Geplante Wartungsarbeiten werden, soweit möglich, vorher angekündigt.
              </p>
              <p>
                timax haftet nicht für Ausfälle oder Störungen, die auf höhere Gewalt, technische Probleme bei Drittanbietern (z.B. OpenAI, Anthropic) oder andere Umstände zurückzuführen sind, die außerhalb des Einflussbereichs von timax liegen.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                9. Kündigung und Account-Löschung
              </h2>
              <p className="mb-4">
                Der Nutzer kann seinen Account jederzeit ohne Angabe von Gründen kündigen. Die Kündigung erfolgt über die Account-Einstellungen oder per E-Mail an info@timax.app.
              </p>
              <p className="mb-4">
                timax kann den Account des Nutzers mit sofortiger Wirkung kündigen, wenn:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>der Nutzer gegen diese AGB verstößt</li>
                <li>der Nutzer illegale Inhalte hochlädt</li>
                <li>der Nutzer versucht, den Service zu manipulieren oder zu missbrauchen</li>
                <li>Zahlungen ausbleiben (bei kostenpflichtigen Tarifen)</li>
              </ul>
              <p>
                Bei Kündigung werden alle Daten des Nutzers gemäß unserer Datenschutzerklärung gelöscht.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                10. Widerrufsrecht
              </h2>
              <p className="mb-4">
                Verbraucher haben ein 14-tägiges Widerrufsrecht. Einzelheiten finden Sie in unserer <Link href="/widerruf" className="text-primary hover:underline">Widerrufsbelehrung</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                11. Änderungen der AGB
              </h2>
              <p>
                timax behält sich vor, diese AGB zu ändern. Änderungen werden dem Nutzer per E-Mail oder über die Plattform mitgeteilt. Widerspricht der Nutzer nicht innerhalb von 14 Tagen, gelten die geänderten AGB als akzeptiert.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                12. Schlussbestimmungen
              </h2>
              <p className="mb-4">
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
              </p>
              <p>
                Gerichtsstand ist, soweit der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist, der Sitz von timax. Andernfalls bleibt der gesetzliche Gerichtsstand unberührt.
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


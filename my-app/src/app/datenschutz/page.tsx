import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Datenschutzerklärung - timax",
  description: "Datenschutzerklärung gemäß DSGVO",
};

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>

          <section className="space-y-8 text-black/80 dark:text-white/80">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                1. Verantwortlicher
              </h2>
              <p className="mb-2">
                Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="mb-2">
                {/* TODO: Firmendaten eintragen */}
                timax
                <br />
                [Anschrift]
                <br />
                [PLZ Ort]
              </p>
              <p className="mb-2">
                E-Mail: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                2. Datenschutzbeauftragter
              </h2>
              <p>
                {/* TODO: Falls vorhanden (bei >20 Mitarbeitern verpflichtend) */}
                Bei Fragen zum Datenschutz können Sie sich an unseren Datenschutzbeauftragten wenden:
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                3. Erhebung und Speicherung personenbezogener Daten
              </h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4 text-black dark:text-white">
                3.1 Beim Besuch der Website
              </h3>
              <p className="mb-4">
                Beim Aufruf unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</li>
              </ul>
              <p className="mb-4">
                Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
                <li>Gewährleistung einer komfortablen Nutzung unserer Website</li>
                <li>Auswertung der Systemsicherheit und -stabilität</li>
                <li>zu weiteren administrativen Zwecken</li>
              </ul>
              <p>
                Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-6 text-black dark:text-white">
                3.2 Bei Registrierung und Nutzung unseres Dienstes
              </h3>
              <p className="mb-4">
                Wenn Sie sich bei uns registrieren und unseren Service nutzen, erheben wir folgende Daten:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>E-Mail-Adresse</li>
                <li>Name (optional)</li>
                <li>Hochgeladene Videos und Audios</li>
                <li>Generierte Transkripte</li>
                <li>Generierte Texte</li>
                <li>Chat-Verläufe</li>
                <li>Nutzungsstatistiken</li>
              </ul>
              <p>
                Diese Daten werden zur Erbringung unserer Dienstleistung benötigt. Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. b DSGVO (Vertragserfüllung).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                4. Weitergabe von Daten
              </h2>
              <p className="mb-4">
                Wir geben Ihre personenbezogenen Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 S. 1 lit. a DSGVO)</li>
                <li>die Weitergabe zur Erfüllung vertraglicher Verpflichtungen erforderlich ist (Art. 6 Abs. 1 S. 1 lit. b DSGVO)</li>
                <li>die Weitergabe zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist (Art. 6 Abs. 1 S. 1 lit. c DSGVO)</li>
              </ul>
              <p className="mb-4">
                Wir nutzen folgende externe Dienstleister für die Verarbeitung Ihrer Daten:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Vercel</strong> (Hosting) - Datenschutzerklärung: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com/legal/privacy-policy</a></li>
                <li><strong>OpenAI</strong> (Whisper API für Transkription) - Datenschutzerklärung: <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openai.com/policies/privacy-policy</a></li>
                <li><strong>Anthropic</strong> (Claude API für Textgenerierung) - Datenschutzerklärung: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">anthropic.com/privacy</a></li>
                <li><strong>n8n</strong> (Workflow-Automatisierung) - Datenschutzerklärung: <a href="https://n8n.io/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">n8n.io/privacy</a></li>
              </ul>
              <p className="mb-4">
                <strong>Wichtig:</strong> Einige dieser Dienstleister verarbeiten Daten in den USA. Wir haben mit diesen Dienstleistern entsprechende Auftragsverarbeitungsverträge (AVV) abgeschlossen und nutzen Standardvertragsklauseln gemäß Art. 46 DSGVO.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                5. Speicherdauer
              </h2>
              <p className="mb-4">
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Hochgeladene Dateien:</strong> 7 Tage nach Upload, wenn keine Transkription erfolgt. Nach erfolgreicher Transkription: 90 Tage ohne Aktivität.</li>
                <li><strong>Transkripte:</strong> 90 Tage ohne Aktivität, danach automatische Löschung.</li>
                <li><strong>Generierte Texte:</strong> 90 Tage ohne Aktivität, danach automatische Löschung.</li>
                <li><strong>Account-Daten:</strong> Bis zur Löschung des Accounts durch den Nutzer oder nach 2 Jahren Inaktivität.</li>
                <li><strong>Log-Daten:</strong> 7 Tage, danach automatische Löschung.</li>
              </ul>
              <p>
                Nach Ablauf der Speicherfristen werden die Daten routinemäßig und entsprechend den gesetzlichen Vorschriften gelöscht.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                6. Cookies und Tracking
              </h2>
              <p className="mb-4">
                Wir setzen Cookies ein, um unsere Website nutzerfreundlicher zu gestalten. Einzelheiten finden Sie in unserer <Link href="/cookies" className="text-primary hover:underline">Cookie-Richtlinie</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                7. Ihre Rechte
              </h2>
              <p className="mb-4">
                Sie haben folgende Rechte:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.</li>
                <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer personenbezogenen Daten verlangen, soweit nicht gesetzliche Aufbewahrungspflichten oder ein anderer gesetzlich zulässiger Grund der Löschung entgegensteht.</li>
                <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, dass wir Ihnen Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format übergeben.</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer personenbezogenen Daten aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.</li>
                <li><strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie haben das Recht, Ihre erteilte Einwilligung jederzeit zu widerrufen.</li>
              </ul>
              <p className="mb-4">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:info@timax.app" className="text-primary hover:underline">info@timax.app</a>
              </p>
              <p>
                Sie haben zudem das Recht, sich bei einer Aufsichtsbehörde über die Verarbeitung personenbezogener Daten durch uns zu beschweren (Art. 77 DSGVO).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                8. Automatisierte Entscheidungsfindung
              </h2>
              <p>
                Wir setzen KI-Technologien (OpenAI Whisper, Anthropic Claude) zur Transkription und Textgenerierung ein. Diese Systeme treffen automatisierte Entscheidungen. Sie haben das Recht, nicht einer ausschließlich auf einer automatisierten Verarbeitung beruhenden Entscheidung unterworfen zu werden (Art. 22 DSGVO). Sie können jederzeit eine manuelle Überprüfung verlangen.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                9. Datensicherheit
              </h2>
              <p>
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen Verlust, Zerstörung, Manipulation und unberechtigten Zugriff zu schützen. Alle unsere Mitarbeiter und die von uns beauftragten Dienstleister sind zur Vertraulichkeit und zum Datenschutz verpflichtet.
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


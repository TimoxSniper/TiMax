# Text Generator

## Feature Name
Template-basierter Text-Generator

## Description
Nutzer können aus einem Beispiel-Transkript verschiedene Textformate generieren (z. B. Social-Media-Post, Blog-Absatz, Caption). Sie wählen ein Format aus einer Liste und erhalten sofort eine formatierte Textausgabe, die sie kopieren oder weiter bearbeiten können.

## User Value
- Zeigt sofort den Kernnutzen der Plattform: Aus bestehenden Inhalten werden wiederverwendbare Textformate erstellt
- Spart Zeit durch sofortige Formatierung ohne manuelles Umformulieren
- Demonstriert den Workflow-Vorteil: Ein Transkript wird zu mehreren nutzbaren Textformaten
- Liefert konkretes, sichtbares Ergebnis, das Content-Creator direkt verwenden können

## Implementation Considerations
- **Keine Datenbank**: Alle Daten sind statisch (Beispiel-Transkript und Templates im Frontend)
- **UI-only**: Reine Frontend-Implementierung mit React/Next.js
- **Mock-Daten**: Ein vordefiniertes Beispiel-Transkript wird verwendet
- **Template-Engine**: Einfache String-Interpolation oder Formatierungsfunktionen
- **Format-Optionen**: Mindestens 3-4 verschiedene Formate (z. B. Instagram Post, Twitter Thread, Blog-Absatz, Caption)
- **Sofortiges Feedback**: Formatierung erfolgt clientseitig ohne API-Calls

## Out of Scope
- Echte KI-Generierung (nur Template-basiert)
- Eigene Transkripte hochladen (nur Beispiel-Transkript)
- Speichern der generierten Texte
- Anpassbare Templates durch den Nutzer
- Integration mit echten Transkriptions-Services
- Export-Funktionen (zunächst nur Anzeige und Copy-to-Clipboard)


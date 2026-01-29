# Text Generator — Product Requirements Document

**Status: Ready for Implementation**

## Objective
Content-Creator sparen Zeit, indem sie aus einem Beispiel-Transkript verschiedene Textformate (Social-Media-Posts, Blog-Absätze, Captions) per Template-Generierung erstellen und sofort kopieren können, ohne manuell umformulieren zu müssen.

## Scope

### In-Scope
- UI für Transkript-Anzeige mit Beispiel-Daten
- Format-Auswahl (mindestens 3-4 Optionen: Instagram Post, Twitter Thread, Blog-Absatz, Caption)
- Template-basierte Textgenerierung (clientseitig, ohne API)
- Sofortige Anzeige des formatierten Ergebnisses
- Copy-to-Clipboard-Funktion
- Responsive Design mit shadcn/ui Komponenten

### Out-of-Scope
- Echte KI-Generierung (nur Templates)
- Eigene Transkripte hochladen
- Persistenz/Speicherung generierter Texte
- Anpassbare Templates durch Nutzer
- Export-Funktionen (PDF, DOCX)
- Integration mit Transkriptions-Services
- Authentifizierung/Login
- Analytics/Tracking

## User Stories

1. **Als Content-Creator** möchte ich ein Beispiel-Transkript sehen, **damit** ich verstehe, wie die Plattform mit meinen Inhalten arbeiten wird.

2. **Als Social-Media-Manager** möchte ich aus einem Transkript mindestens 3 verschiedene Textformate generieren können, **damit** ich schnell Posts für verschiedene Plattformen erstellen kann, ohne manuell umformulieren zu müssen.

3. **Als Nutzer** möchte ich den generierten Text kopieren können, **damit** ich ihn direkt in meinen Social-Media-Tools oder Content-Management-Systemen verwenden kann.

## Acceptance Criteria

### AC1: Transkript-Anzeige
- **Given** der Nutzer öffnet die Text-Generator-Seite
- **When** die Seite geladen ist
- **Then** wird ein Beispiel-Transkript angezeigt (mindestens 200 Wörter)
- **And** das Transkript ist lesbar strukturiert (Absätze, Zeilenumbrüche)

### AC2: Format-Auswahl
- **Given** ein Transkript ist sichtbar
- **When** der Nutzer ein Format auswählt (z. B. "Instagram Post")
- **Then** wird der generierte Text sofort angezeigt (< 100ms)
- **And** Instagram Post enthält mindestens 3 Hashtags und ist ≤ 2200 Zeichen
- **And** Twitter Thread besteht aus mehreren Tweets mit max. 280 Zeichen pro Tweet
- **And** Blog-Absatz ist in Absätze strukturiert mit Überschriften
- **And** Caption ist fokussiert und enthält einen Call-to-Action

### AC3: Format-Wechsel
- **Given** ein Format wurde ausgewählt und Text generiert
- **When** der Nutzer ein anderes Format wählt
- **Then** wird der neue Text sofort angezeigt
- **And** der vorherige Text wird ersetzt

### AC4: Copy-to-Clipboard
- **Given** ein Text wurde generiert
- **When** der Nutzer auf "Kopieren" klickt
- **Then** wird der Text in die Zwischenablage kopiert
- **And** eine Erfolgsmeldung wird angezeigt

### AC5: Responsive Design
- **Given** die Seite wird auf Mobile/Tablet/Desktop geöffnet
- **Then** alle Elemente sind lesbar und bedienbar
- **And** die Layout-Struktur passt sich an die Bildschirmgröße an

## Success Metrics

- **Funktionalität**: Alle 4 Format-Optionen generieren erfolgreich Text aus dem Beispiel-Transkript
- **Performance**: Text-Generierung erfolgt in < 100ms (clientseitig, keine API-Calls)
- **Usability**: Copy-to-Clipboard funktioniert in Chrome, Firefox und Safari
- **Qualität**: Generierte Texte entsprechen den Format-spezifischen Regeln (Zeichenlimit, Hashtags, Struktur)
- **Zugänglichkeit**: Alle interaktiven Elemente sind per Tastatur bedienbar (Tab-Navigation)

## Implementation Plan

### Stage 1 — UI Design Only

1. ✅ **Route und Layout erstellen**
   - Neue Route `/text-generator` in `my-app/src/app/text-generator/page.tsx`
   - Basis-Layout mit Container und Spacing
   - Referenz: `my-app/src/app/page.tsx`

2. ✅ **Beispiel-Transkript als Mock-Daten definieren**
   - Datei: `my-app/src/lib/mock-transcript.ts`
   - Statisches Transkript (200-300 Wörter, realistischer Content)
   - Export als String oder Array von Abschnitten

3. ✅ **Transkript-Anzeige-Komponente**
   - Komponente: `my-app/src/components/text-generator/transcript-viewer.tsx`
   - Verwendet `Card` aus `components/ui/card`
   - Zeigt Mock-Transkript formatiert an (Absätze, Typografie)

4. ✅ **Format-Auswahl-Komponente**
   - Komponente: `my-app/src/components/text-generator/format-selector.tsx`
   - Verwendet `Button` oder Radio-Group (shadcn/ui falls vorhanden)
   - 4 Format-Optionen: Instagram Post, Twitter Thread, Blog-Absatz, Caption
   - State für ausgewähltes Format

5. ✅ **Text-Generator-Komponente (UI-Shell)**
   - Komponente: `my-app/src/components/text-generator/text-output.tsx`
   - Verwendet `Card` für Output-Bereich
   - Placeholder-Text: "Wähle ein Format aus"
   - Zeigt generierten Text an (später mit Logik)

6. ✅ **Template-Definitionen (Mock)**
   - Datei: `my-app/src/lib/text-templates.ts`
   - Template-Funktionen für jedes Format (zunächst nur Placeholder-Rückgabe)
   - Interface/Type für Template-Input

7. ✅ **Copy-Button-Komponente**
   - Verwendet `Button` aus `components/ui/button`
   - Icon für Copy-Aktion (lucide-react)
   - Toast/Alert für Feedback (später)

8. ✅ **Hauptseite zusammenfügen**
   - Alle Komponenten in `page.tsx` integrieren
   - Layout: Transkript links/oben, Format-Auswahl Mitte, Output rechts/unten
   - Responsive Grid/Flex-Layout

9. ✅ **Styling und Spacing**
   - Konsistente Abstände und Typografie
   - Mobile-First Responsive Design
   - Dark Mode Support (falls vorhanden)

10. ✅ **Lint und Typecheck**
    - `npm run lint` ausführen
    - TypeScript-Fehler beheben
    - Manuelle Click-Through: Navigation, Format-Auswahl (noch ohne Logik)

11. ✅ **Header mit Navigation**
    - Sticky Header mit Zurück-Button zur Startseite
    - Titel und Beschreibung der Seite
    - Skip-to-Content Link für Accessibility

12. ✅ **Footer mit Info**
    - Footer mit Stage-Information
    - Semantisches HTML (role="contentinfo")

13. ✅ **Info-Sektion "Wie funktioniert es?"**
    - Drei-Schritte-Anleitung für Nutzer
    - Responsive Grid-Layout
    - Visuelle Icons und Beschreibungen

14. ✅ **Accessibility Features**
    - ARIA-Labels für alle interaktiven Elemente
    - Keyboard-Navigation (Tab, Enter)
    - Skip-to-Content Link
    - Semantisches HTML (header, main, section, footer)
    - Focus-Rings und Hover-States

15. ✅ **Mobile UX Verbesserungen**
    - Smooth Scroll zum Output-Bereich auf Mobile
    - Responsive Breakpoints (mobile-first)
    - Sticky Navigation auf Desktop

**Stage 1 Zusammenfassung:**
Die UI für den Text Generator wurde vollständig implementiert mit shadcn/ui Komponenten (Card, Button, Badge, Separator). Mock-Daten befinden sich in `my-app/src/lib/mock-transcript.ts` und Template-Definitionen in `my-app/src/lib/text-templates.ts`. Alle Komponenten sind responsive, barrierefrei und folgen einem konsistenten Design-System.

### Stage 2 — Real Functionality

1. **Template-Engine implementieren**
   - Datei: `my-app/src/lib/text-templates.ts` erweitern
   - Funktionen für jedes Format: `generateInstagramPost()`, `generateTwitterThread()`, etc.
   - String-Interpolation basierend auf Transkript-Input
   - Formatierungsregeln (Hashtags, Zeilenlänge, Emojis)

2. **State-Management für Format-Auswahl**
   - React State in `page.tsx` oder Context
   - Format-Auswahl triggert Template-Funktion
   - Generierter Text wird im State gespeichert

3. **Text-Generierung verbinden**
   - `text-output.tsx` erhält generierten Text als Prop
   - Template-Funktion wird bei Format-Wechsel aufgerufen
   - Transkript wird an Template-Funktion übergeben

4. **Copy-to-Clipboard implementieren**
   - `navigator.clipboard.writeText()` verwenden
   - Error Handling für Browser-Kompatibilität
   - Fallback für ältere Browser

5. **Toast/Notification für Copy-Feedback**
   - shadcn/ui Toast-Komponente installieren oder einfache Alert
   - Erfolgsmeldung nach Copy-Aktion
   - 2-3 Sekunden Anzeige

6. **Transkript-Parsing (falls nötig)**
   - Transkript in Abschnitte/Segmente aufteilen
   - Timestamps entfernen (falls vorhanden)
   - Normalisierung für Template-Input

7. **Template-Logik verfeinern**
   - Instagram: Hashtags, Zeilenlänge max. 2200 Zeichen, Emojis
   - Twitter: Thread-Format (mehrere Tweets), 280 Zeichen pro Tweet
   - Blog: Absätze, Überschriften, strukturiert
   - Caption: Kürzer, fokussiert, Call-to-Action

8. **Error Handling**
   - Try-Catch für Template-Generierung
   - Fallback bei fehlendem Transkript
   - Validierung der Input-Daten

9. **Loading States (optional)**
   - Kurze Delay-Simulation für besseres UX
   - Loading-Spinner während Generierung

10. **Validierung und Tests**
    - Manuelle Tests: Alle Formate durchgehen
    - Copy-Funktion in verschiedenen Browsern testen
    - Edge Cases: Leeres Transkript, sehr langes Transkript

### Stage 3 — Test, Debug, and Safety Checks

1. **User Stories verifizieren**
   - Story 1: Transkript-Anzeige prüfen (Lesbarkeit, Struktur)
   - Story 2: Alle Formate testen, Output-Qualität bewerten
   - Story 3: Copy-Funktion in verschiedenen Browsern testen

2. **Acceptance Criteria durchgehen**
   - AC1: Transkript-Anzeige → ✓
   - AC2: Format-Auswahl → ✓
   - AC3: Format-Wechsel → ✓
   - AC4: Copy-to-Clipboard → ✓
   - AC5: Responsive Design → ✓

3. **Input-Validierung hinzufügen**
   - Transkript-Validierung (nicht leer, min. Länge)
   - Sanitization für generierten Text (XSS-Schutz)
   - Type-Checks für Template-Input

4. **Error Boundaries**
   - React Error Boundary für Template-Fehler
   - Graceful Degradation bei Browser-Inkompatibilität
   - Fehlermeldungen für Nutzer

5. **Accessibility Pass**
   - ARIA-Labels für Buttons und Inputs
   - Keyboard-Navigation (Tab, Enter)
   - Screen-Reader-Test (grundlegend)
   - Kontrast-Prüfung

6. **Performance Checks**
   - Template-Generierung sollte < 100ms sein
   - Keine unnötigen Re-Renders
   - React.memo für statische Komponenten (falls nötig)

7. **Browser-Kompatibilität**
   - Chrome, Firefox, Safari testen
   - Clipboard-API Fallback für ältere Browser
   - Mobile Browser (iOS Safari, Chrome Mobile)

8. **Edge Cases behandeln**
   - Sehr langes Transkript (> 5000 Wörter)
   - Sonderzeichen im Transkript
   - Mehrfaches schnelles Format-Wechseln
   - Copy während Generierung

9. **Code-Qualität**
   - Unused Imports entfernen
   - Console.logs entfernen
   - Kommentare für komplexe Template-Logik

10. **Finale Validierung**
    - Lint ohne Fehler
    - TypeScript ohne Fehler
    - Build erfolgreich (`npm run build`)
    - Manueller End-to-End-Test: Kompletter Workflow


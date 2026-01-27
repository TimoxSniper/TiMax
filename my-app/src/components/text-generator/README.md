# Text Generator Komponenten

## Übersicht

Diese Komponenten bilden das Text-Generator-Feature, das verschiedene Content-Formate aus einem Transkript generiert.

## Komponenten

### `transcript-viewer.tsx`
Zeigt das Original-Transkript mit Formatierung und Wortzähler.

**Accessibility Features:**
- Scrollbarer Container mit Keyboard-Support (tabIndex={0})
- ARIA-Label für Region
- Icon mit aria-hidden
- Responsive Text-Größen

### `format-selector.tsx`
Ermöglicht die Auswahl zwischen verschiedenen Content-Formaten.

**Accessibility Features:**
- Role="group" für Format-Buttons
- aria-pressed State für ausgewähltes Format
- Umfassende aria-labels mit Format-Beschreibungen
- Icons mit aria-hidden
- Hover/Focus/Active States mit Animations

### `text-output.tsx`
Zeigt den generierten Text und bietet Copy-to-Clipboard Funktionalität.

**Accessibility Features:**
- aria-live="polite" für Status-Updates
- Scrollbarer Container mit Focus-Ring
- aria-label für Copy-Button mit State-Feedback
- Icons mit aria-hidden
- Empty State mit visueller Anleitung

### `page.tsx`
Hauptseite, die alle Komponenten zusammenführt.

**Accessibility Features:**
- Skip-to-Content Link (erscheint bei Tab-Navigation)
- Semantisches HTML (header, main, section, footer)
- role="main" und role="contentinfo"
- Sticky Navigation auf Desktop für bessere Bedienbarkeit
- Responsive Breakpoints (mobile-first)

## Responsive Breakpoints

- **Mobile**: < 640px (1 Spalte)
- **Tablet**: 640px - 1023px (sm:, md:)
- **Desktop**: ≥ 1024px (lg:, 2 Spalten)

## Animationen & Transitions

- Hover: scale-[1.02] auf Buttons
- Active: scale-[0.98] für Click-Feedback
- Card Hover: shadow-md Transition
- Focus: Ring mit Offset
- Duration: 200ms für subtile, flüssige Übergänge

## Color Contrast

Alle Text/Hintergrund-Kombinationen erfüllen WCAG 2.1 AA Standards:
- Foreground/Background: ≥ 4.5:1
- Muted Text: ≥ 3:1 (größere Schrift)
- Primary Farben: Optimiert für Light & Dark Mode

## Keyboard Navigation

- Tab: Durchlaufen aller interaktiven Elemente
- Enter/Space: Aktivieren von Buttons
- Escape: (Für zukünftige Modals/Dialogs)
- Scrollbare Container: Arrow Keys funktionieren nach Focus

## Testing Checklist

- [x] Screen Reader Test (NVDA/JAWS)
- [x] Keyboard-only Navigation
- [x] Color Contrast Check
- [x] Responsive Breakpoints
- [x] Dark Mode Verification
- [x] Focus Indicators
- [x] ARIA Attributes


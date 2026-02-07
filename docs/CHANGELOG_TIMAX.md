# 🕒 TiMax Changelog & Fixes

Dieser Changelog dokumentiert alle Verbesserungen, Fehlerbehebungen und UX-Optimierungen am TiMax-Projekt.

---

## 🚀 Highlights & Zusammenfassung

Alle kritischen Probleme wurden behoben. Die App ist nun schneller, mobiler und wartbarer.

### 🎨 Design & UX Fixes

- **Globale Navigation**: Neuer Sticky Header mit Dark Mode Toggle auf allen Seiten.
- **Mobile Optimierung**: Chat-Höhe angepasst, Touch-Targets vergrößert (44px), Keyboard-Handling verbessert.
- **Performance**: Backdrop-Blur auf Mobile reduziert, Glow-Effekte minimiert, `React.memo` & `useMemo` implementiert.

### ⚙️ Backend & Code-Qualität

- **Refactoring**: Die überladene `page.tsx` wurde in über 10 modulare Komponenten aufgeteilt.
- **Sicherheit**: Environment-Variablen werden zur Laufzeit mit Zod validiert.
- **Monitoring**: Sentry Integration für Error-Tracking in Produktion.
- **Stabilität**: Race Conditions im Chat durch `AbortController` und Request-IDs behoben.

---

## 🛠️ Detaillierte Fix-Historie

### Kritische Fixes (🔴)

1. **API Korrekturen**: `substr()` durch `substring()` ersetzt (Vermeidung von Deprecated APIs).
2. **Memory Leaks**: Alle Timeouts in `useEffect` werden nun korrekt gecleared.
3. **Chat Stabilität**: Race Conditions durch parallele Requests werden nun abgefangen.
4. **Performance**: Massive Reduzierung von unnötigen Re-Renders durch Memoization.

### Wichtige Verbesserungen (🟡)

1. **Input-Validierung**: Zod-Schema für Chat-Nachrichten (Längen-Limits & Sanitization).
2. **Konstanten**: Magic Numbers wurden zentralisiert (`lib/constants.ts`).
3. **Accessibility**: ARIA-Labels hinzugefügt, Focus-States für Keyboard-Nutzer verbessert.
4. **Error Handling**: Graceful Degradation durch Error Boundaries und Sentry.

### Nice-to-Have (🟢)

1. **Test-Infrastruktur**: Vitest Setup mit 38 Unit Tests für Validierung und Constants.
2. **Design-System**: Konsistente Spacing-Scale eingeführt.

---

## 📅 Log-Details (Chronologisch)

| Datum      | Fix ID | Beschreibung                                        | Status      |
| :--------- | :----- | :-------------------------------------------------- | :---------- |
| 2025-02-03 | #1     | `substr()` → `substring()` Fix                      | ✅ Erledigt |
| 2025-02-03 | #2     | Memory leaks in Timeouts behoben                    | ✅ Erledigt |
| 2025-02-03 | #3     | Race conditions im Chat behoben                     | ✅ Erledigt |
| 2025-02-03 | #4     | `page.tsx` Refactoring (700+ Zeilen in Komponenten) | ✅ Erledigt |
| 2025-02-03 | #5     | React.memo / useMemo Performance-Fixes              | ✅ Erledigt |
| 2025-02-03 | #7     | ENV-Var Validierung zur Runtime (Zod)               | ✅ Erledigt |
| 2025-02-03 | #8     | Sentry Integration (Error Tracking)                 | ✅ Erledigt |
| 2025-02-03 | #10    | Input-Validierung & Sanitization                    | ✅ Erledigt |
| 2025-02-03 | #15    | Unit Tests (Vitest) implementiert                   | ✅ Erledigt |

> [!NOTE]
> Weitere Details zu den einzelnen technischen Implementierungen können in den jeweiligen Quellcodedateien im `src/` Verzeichnis eingesehen werden.

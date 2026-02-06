# TiMax Code Quality Master Prompt

## Aufgabe
Analysiere das TiMax Projekt systematisch in ALLEN Bereichen und bringe es auf **10/10 Code Quality**. 

Fixe ALLE gefundenen Probleme sofort, ohne Rückfragen. Arbeite dich durch alle Kategorien.

---

## Phase 1: Vollständige Analyse

Führe diese Befehle aus und analysiere die Ergebnisse:

```bash
# 1. Security Audit
npm audit --audit-level=moderate

# 2. Outdated Dependencies  
npm outdated

# 3. TypeScript Check
npm run typecheck

# 4. ESLint Check
npm run lint

# 5. Tests
npm test -- --run

# 6. Suche nach Code Smells
grep -r "TODO\|FIXME\|XXX\|HACK\|BUG" src/ --include="*.ts" --include="*.tsx"
grep -r "console\." src/ --include="*.ts" --include="*.tsx" | grep -v "__tests__" | grep -v "logger.ts"
grep -r "as any" src/ --include="*.ts" --include="*.tsx"
grep -r "eslint-disable" src/ --include="*.ts" --include="*.tsx"

# 7. Prüfe Test Coverage (falls verfügbar)
npm run test:coverage 2>/dev/null || echo "Coverage nicht konfiguriert"
```

---

## Phase 2: Kategorien-basierte Fixes

### 🔴 P0 - Kritisch (SOFORT fixen)

#### 1. Security (Muss 10/10 sein)
- [ ] Alle `npm audit` Vulnerabilities fixen: `npm audit fix`
- [ ] Keine Secrets im Code (suche nach `API_KEY`, `TOKEN`, `PASSWORD`)
- [ ] CSP Header prüfen - keine `'unsafe-inline'` oder `'unsafe-eval'` wenn möglich
- [ ] XSS Prüfung: `dangerouslySetInnerHTML` nur mit Sanitization
- [ ] Alle Inputs validiert (Zod Schemas)?

#### 2. TypeScript Strictness (Muss 10/10 sein)  
- [ ] `npm run typecheck` muss 0 Errors zeigen
- [ ] KEINE `any` Types (ersetzen durch `unknown` oder konkrete Typen)
- [ ] Alle Function Return Types definiert
- [ ] Keine impliziten `any` in Arrays/Objects

#### 3. ESLint (Muss 0 Errors haben)
- [ ] `npm run lint` muss sauber sein
- [ ] Alle "unused vars" entfernen
- [ ] Alle "unused imports" entfernen
- [ ] Keine eslint-disable Kommentare (außer mit Begründung)

#### 4. Tests (Müssen alle passing sein)
- [ ] `npm test -- --run` muss 100% passing zeigen
- [ ] Keine skipped Tests
- [ ] Keine flaky Tests

---

### 🟡 P1 - Wichtig (Direkt nach P0 fixen)

#### 5. Code Quality & Best Practices
- [ ] Keine `console.log` in Production Code (nur logger.ts)
- [ ] Keine TODO/FIXME Kommentare (Issues erstellen stattdessen)
- [ ] Keine Magic Numbers (Konstanten verwenden)
- [ ] DRY Prinzip - Keine Duplikate
- [ ] Funktionen max 50 Zeilen (außer gut begründet)
- [ ] Imports sortiert und konsistent

#### 6. Dependencies
- [ ] Alle Dependencies auf aktuellste stable Version updaten
- [ ] Keine veralteten Major Versions
- [ ] Keine ungenutzten Dependencies (prüfe mit `depcheck`)

#### 7. Performance
- [ ] Lazy Loading für schwere Komponenten (`next/dynamic`)
- [ ] `React.memo` wo sinnvoll
- [ ] `useMemo`/`useCallback` für teure Berechnungen
- [ ] Images optimiert (`next/image`, avif/webp)
- [ ] Bundle Size geprüft (`npm run analyze`)

#### 8. Documentation
- [ ] JSDoc für alle Public Functions
- [ ] README aktuell
- [ ] CHANGELOG bei neuen Features
- [ ] Architektur-Dokumentation (ADRs)

---

### 🟢 P2 - Optional (Nice to have)

#### 9. Testing Erweiterung
- [ ] Integration Tests für API Routes
- [ ] E2E Tests mit Playwright (kritische Flows)
- [ ] Test Coverage > 80%
- [ ] Snapshot Tests wo sinnvoll

#### 10. Advanced Features
- [ ] Pre-commit Hooks (Husky + lint-staged)
- [ ] Bundle Size Monitoring
- [ ] Performance Budgets
- [ ] OpenAPI/Swagger Dokumentation

---

## Phase 3: Fix-Strategie

### Reihenfolge:
1. **Security** (P0) - Nie compromisen
2. **TypeScript** (P0) - Strict mode muss passen
3. **Tests** (P0) - Alles muss grün sein
4. **ESLint** (P0) - Automatisierte Code Quality
5. **Dependencies** (P1) - Up-to-date halten
6. **Performance** (P1) - User Experience
7. **Documentation** (P1/P2) - Langfristige Wartbarkeit

### Für jeden Fix:
1. ✅ Problem identifizieren
2. ✅ Fix implementieren  
3. ✅ Tests laufen lassen
4. ✅ TypeScript check
5. ✅ ESLint check
6. ✅ Commit mit Convention: `fix:`, `refactor:`, `security:`, etc.

---

## Akzeptanzkriterien für 10/10

```bash
# Diese Befehle müssen ALLE erfolgreich sein:
npm audit --audit-level=moderate  # 0 vulnerabilities
npm outdated                      # max 3 outdated (keine Major)
npm run typecheck                 # 0 errors
npm run lint                      # 0 errors  
npm test -- --run                 # 100% passing
npm run build                     # Erfolgreich
```

---

## Output Format

Am Ende erstelle eine Zusammenfassung:

```
## Code Quality Report

### Ergebnis: X/10

| Kategorie | Bewertung | Status |
|-----------|-----------|--------|
| Security | X/10 | [Details] |
| TypeScript | X/10 | [Details] |
| Testing | X/10 | [Details] |
| ESLint | X/10 | [Details] |
| Performance | X/10 | [Details] |
| Dependencies | X/10 | [Details] |
| Documentation | X/10 | [Details] |
| Architecture | X/10 | [Details] |

### Behobene Probleme:
- [Liste aller Fixes]

### Verbleibende TODOs:
- [Was noch offen ist für 10/10]

### Empfohlene nächste Schritte:
- [Priorisierte Liste]
```

---

## Wichtige Regeln

1. **KEINE halben Sachen** - Wenn du anfängst, bringe es zu Ende
2. **Teste nach jedem Fix** - Nie mehrere Änderungen ohne Tests
3. **Committe regelmäßig** - Kleine, atomare Commits
4. **Dokumentiere Breaking Changes** - In CHANGELOG.md
5. **Frage NIE "Soll ich..."** - Analysiere und handle proaktiv

Los geht's! Analysiere jetzt systematisch und bringe TiMax auf 10/10! 🚀

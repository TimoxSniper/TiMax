# ADR-005: Vitest für Testing

Datum: 2024-02-06
Status: Akzeptiert

## Kontext

Wir brauchten ein Testing-Framework für:

- Unit Tests
- Integration Tests
- Component Tests

Optionen:

- Jest (Industriestandard)
- Vitest (Modern, schnell)
- Playwright (E2E)
- Cypress (E2E)

## Entscheidung

Wir verwenden **Vitest** für Unit/Integration Tests und planen Playwright für E2E.

## Begründung

### Vorteile Vitest

1. **Geschwindigkeit** - 10-20x schneller als Jest
2. **ESM Native** - Keine Transpilation nötig
3. **TypeScript** - Nativer Support
4. **Vite Integration** - Gleiche Config wie Build
5. **Jest API** - Fast identische Syntax
6. **UI Mode** - Browser-basierte Test-UI
7. **Coverage** - Integriert (v8)
8. **Watch Mode** - Sehr schnell

### Nachteile

1. **Ecosystem** - Weniger Plugins als Jest
2. **Maturity** - Jünger als Jest
3. **Documentation** - Weniger Community-Content

## Vergleich

| Feature         | Vitest     | Jest       |
| --------------- | ---------- | ---------- |
| Geschwindigkeit | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| ESM Support     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Ecosystem       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |
| TypeScript      | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| Maturity        | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |

## Konsequenzen

### Positiv

- Sehr schnelle Feedback-Loops
- Moderne Tooling
- Gute Developer Experience
- UI Mode für Debugging

### Negativ

- Team muss Vitest lernen (ähnlich zu Jest)
- Weniger Stack Overflow Antworten

## Implementierung

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
```

```typescript
// Beispiel Test
import { describe, it, expect } from "vitest";
import { validateEmail } from "./validation";

describe("Validation", () => {
  it("should validate correct email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });
});
```

## Test-Strategie

1. **Unit Tests** - Vitest
   - Utilities
   - Validation
   - Business Logic

2. **Integration Tests** - Vitest
   - API Routes
   - Database Queries

3. **E2E Tests** - Playwright (geplant)
   - User Flows
   - Critical Paths

## Ergebnis

- **224 Tests** implementiert
- **10 Testdateien**
- **Alle Tests passing**

## Verwandte ADRs

- ADR-001: Next.js App Router (Vitest funktioniert gut mit ESM)

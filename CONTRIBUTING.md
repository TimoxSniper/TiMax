# Contributing to TiMax

Danke für dein Interesse an TiMax! Wir freuen uns über jeden Beitrag.

## Inhaltsverzeichnis

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Performance](#performance)
- [Security](#security)
- [Documentation](#documentation)

## Code of Conduct

Dieses Projekt folgt unserem [Code of Conduct](CODE_OF_CONDUCT.md). Bitte respektiere alle Mitwirkenden.

## Getting Started

### Voraussetzungen

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git

### Setup

```bash
# 1. Repository forken und klonen
git clone https://github.com/dein-username/TiMax.git
cd TiMax/my-app

# 2. Dependencies installieren
npm install

# 3. Umgebungsvariablen einrichten
cp .env.local.example .env.local
# .env.local mit deinen Werten füllen

# 4. Git hooks aktivieren
npm run prepare

# 5. Entwicklungsserver starten
npm run dev
```

## Development Workflow

### Branch-Strategie

- `main` - Produktionsbranch
- `develop` - Entwicklungsbranch (falls verwendet)
- `feature/*` - Neue Features
- `fix/*` - Bugfixes
- `docs/*` - Dokumentation
- `refactor/*` - Refactoring

### Workflow

1. **Issue erstellen** - Beschreibe das Problem oder Feature
2. **Branch erstellen** - Von `main` oder `develop` ausgehen
3. **Entwickeln** - Code schreiben mit Tests
4. **Validieren** - Alle Checks bestehen lassen
5. **PR erstellen** - Ausführliche Beschreibung hinzufügen
6. **Review** - Auf Feedback reagieren
7. **Merge** - Nach Approval mergen

## Commit Convention

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat:` - Neue Features
- `fix:` - Bugfixes
- `docs:` - Dokumentationsänderungen
- `style:` - Code-Formatierung (keine funktionalen Änderungen)
- `refactor:` - Code-Refactoring
- `perf:` - Performance-Verbesserungen
- `test:` - Tests hinzufügen/ändern
- `chore:` - Wartungsarbeiten
- `ci:` - CI/CD Änderungen
- `security:` - Sicherheitsverbesserungen

### Scopes

- `auth` - Authentifizierung
- `api` - API-Routen
- `ui` - UI-Komponenten
- `chat` - Chat-Funktionalität
- `upload` - Upload-Funktionalität
- `db` - Datenbank
- `config` - Konfiguration
- `deps` - Dependencies

### Beispiele

```bash
feat(auth): add password reset functionality

fix(api): resolve rate limiting issue for upload endpoint

refactor(ui): simplify button component structure

docs(readme): update installation instructions

test(validation): add tests for email validation

security(csp): tighten content security policy
```

## Pull Request Process

### Vor dem PR

- [ ] Alle Tests laufen (`npm run test:ci`)
- [ ] TypeScript ohne Fehler (`npm run typecheck`)
- [ ] ESLint ohne Fehler (`npm run lint`)
- [ ] Code formatiert (`npm run format`)
- [ ] Git commits folgen Convention

### PR Template

```markdown
## Beschreibung

Kurze Beschreibung der Änderungen.

## Type

- [ ] Feature
- [ ] Bugfix
- [ ] Dokumentation
- [ ] Refactoring
- [ ] Performance
- [ ] Security

## Änderungen

- Änderung 1
- Änderung 2

## Tests

- [ ] Unit Tests hinzugefügt
- [ ] Integration Tests hinzugefügt
- [ ] Manuelle Tests durchgeführt

## Checkliste

- [ ] Code folgt Style-Guide
- [ ] Dokumentation aktualisiert
- [ ] Keine Breaking Changes (oder dokumentiert)
- [ ] Security-Aspekte berücksichtigt

## Screenshots (falls UI)

<!-- Screenshots einfügen -->

## Verwandte Issues

Closes #123
```

## Code Style

### TypeScript

```typescript
// ✅ Gut
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

// ❌ Schlecht
function formatUserName(user: any) {
  return user.firstName + " " + user.lastName;
}
```

### React Components

```typescript
// ✅ Gut
interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ❌ Schlecht
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### Imports

```typescript
// ✅ Gut - Sortiert nach Gruppen
import React from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

import { cn } from "@/lib/utils";

// ❌ Schlecht - Unsortiert
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
```

## Testing

### Test-Struktur

```
__tests__/
├── unit/           # Unit Tests
├── integration/    # Integration Tests
├── e2e/           # End-to-End Tests
└── setup.ts       # Test Setup
```

### Test-Namen

```typescript
// ✅ Gut
describe("Validation", () => {
  describe("emailSchema", () => {
    it("should validate correct email format", () => {});
    it("should reject invalid email format", () => {});
    it("should reject empty email", () => {});
  });
});

// ❌ Schlecht
describe("test", () => {
  it("test1", () => {});
  it("test2", () => {});
});
```

### Best Practices

- Ein Test = Ein Konzept
- Tests sollten unabhängig sein
- Mock externe Abhängigkeiten
- Teste Randfälle
- Beschreibende Namen verwenden

## Performance

### Optimierungen

- **Lazy Loading** - `next/dynamic` für schwere Komponenten
- **Memoization** - `React.memo`, `useMemo`, `useCallback`
- **Image Optimierung** - `next/image` verwenden
- **Bundle Size** - Nur benötigte Imports

### Beispiele

```typescript
// ✅ Lazy Loading
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false,
});

// ✅ Memoization
const MemoizedList = React.memo(function List({ items }: ListProps) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});
```

## Security

### Checkliste

- [ ] Keine Secrets im Code
- [ ] Eingaben validieren (Zod)
- [ ] XSS-Schutz (Sanitization)
- [ ] CSRF-Tokens verwenden
- [ ] Rate Limiting beachten
- [ ] RLS Policies in Supabase

### Beispiele

```typescript
// ✅ Eingabe validieren
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ XSS-Schutz
const sanitized = sanitizeUserInput(userInput);
```

## Documentation

### Code-Kommentare

```typescript
/**
 * Generiert einen CSRF-Token für Formular-Submissions
 * @returns Cryptographically secure random token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
```

### README Updates

- Neue Features dokumentieren
- API-Änderungen aktualisieren
- Breaking Changes markieren

## Fragen?

Bei Fragen:

1. Zuerst Dokumentation lesen
2. Bestehende Issues durchsuchen
3. Neues Issue erstellen
4. Community auf Discord fragen

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Danke für deinen Beitrag! 🚀**

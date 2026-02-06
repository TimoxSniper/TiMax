# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Added

#### Testing
- **224 Tests** hinzugefügt (von 3 auf 224!)
- Unit Tests für alle Utility-Funktionen
- Tests für CSRF-Schutz
- Tests für Error Handling
- Tests für Upload-Konfiguration
- Tests für Validation (inkl. XSS-Schutz)
- Tests für Rate Limiting
- Tests für Logger

#### Development Tools
- ESLint Konfiguration mit TypeScript, Import und Unused Imports Regeln
- Prettier Konfiguration mit Tailwind Plugin
- Husky Git Hooks für Pre-commit Checks
- Lint-staged für automatische Code-Formatierung
- Bundle Analyzer Script

#### Performance
- `optimizePackageImports` für lucide-react, framer-motion
- Image Optimization mit avif/webp
- Cache-Control Headers für statische Assets
- Redirects (www zu non-www)
- Rewrites für sitemap.xml und robots.txt

#### Documentation
- Umfassende README mit Tech Stack, API Docs, Contributing Guide
- CONTRIBUTING.md mit detaillierten Guidelines
- CHANGELOG.md (diese Datei)
- Verbesserte package.json mit engines, browserslist

### Changed

#### Dependencies
- Entfernt: Dupliziertes `radix-ui` Package
- Konsolidierung auf einzelne `@radix-ui/*` Pakete
- Import-Pfade korrigiert in `dialog.tsx`

#### Architecture
- Zentraler `lib/index.ts` für konsistente Imports
- Verbesserte TypeScript-Strictness in Tests
- `typecheck` Script hinzugefügt

### Fixed

- TypeScript-Fehler in Tests behoben (vi.Mock, NODE_ENV)
- Import-Konsistenz in UI-Komponenten

## [0.1.0] - 2024-02-06

### Added

#### Core Features
- **Upload** - Videos und Audios hochladen (bis 100MB)
- **Transkription** - Automatische Umwandlung in Text (Whisper API)
- **KI-Chat** - Dialog mit Claude AI für Textgenerierung
- **Content-Formate** - LinkedIn-Posts, Newsletter, Blog-Artikel
- **Multi-User** - Authentifizierung mit Clerk

#### Security
- CSRF-Schutz mit Double Submit Cookie
- Rate Limiting (IP + User basiert)
- XSS-Schutz durch Input Sanitization
- CSP Headers
- Security Headers (X-Frame-Options, etc.)
- Row Level Security in Supabase

#### Tech Stack
- Next.js 16 mit App Router
- React 19
- TypeScript 5 (Strict Mode)
- Tailwind CSS 4
- shadcn/ui Komponenten
- Supabase (PostgreSQL)
- Sentry (Error Tracking)
- Vitest (Testing)

#### SEO & Performance
- JSON-LD Structured Data
- OpenGraph Meta Tags
- Sitemap
- Robots.txt
- Responsive Design
- Dark Mode Support

### Infrastructure

- CI/CD mit Vercel
- Umgebungsvariablen Management
- Error Boundary Implementation
- Toast Notifications
- Loading States

---

## Versionierung

Wir verwenden [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking Changes
- **MINOR** - Neue Features (rückwärtskompatibel)
- **PATCH** - Bugfixes (rückwärtskompatibel)

## Release Prozess

1. Version in `package.json` aktualisieren
2. CHANGELOG.md aktualisieren
3. Git Tag erstellen: `git tag -a v0.1.0 -m "Release v0.1.0"`
4. Push mit Tags: `git push origin main --tags`
5. GitHub Release erstellen mit Release Notes

## Kategorien

- `Added` - Neue Features
- `Changed` - Änderungen an bestehendem Verhalten
- `Deprecated` - Features, die entfernt werden
- `Removed` - Entfernte Features
- `Fixed` - Bugfixes
- `Security` - Sicherheitsverbesserungen

---

**Letzte Aktualisierung:** 2024-02-06

# TiMax

KI-gestützte Video- und Audio-Transkription mit automatischer Textgenerierung.

[![Tests](https://img.shields.io/badge/tests-224%20passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![Next.js](https://img.shields.io/badge/Next.js-16-black)]()

## Features

- **Nahtloser Upload** - Videos und Audios einfach hochladen (bis 100MB)
- **Automatische Transkription** - Whisper API für präzise Spracherkennung
- **KI-Dialog** - Generiere Texte im Dialog mit Claude AI
- **Content-Formate** - LinkedIn-Posts, Newsletter, Blog-Artikel, Zusammenfassungen
- **Multi-User** - Authentifizierung mit Clerk
- **Sicherheit** - CSRF-Schutz, Rate Limiting, XSS-Schutz, CSP Headers
- **Deutschland-fokussiert** - DSGVO-konform, deutsche Lokalisierung

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude AI via n8n Webhooks
- **Transcription**: Whisper API
- **Monitoring**: Sentry
- **Testing**: Vitest + React Testing Library

## Schnellstart

### Voraussetzungen

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Repository klonen
git clone https://github.com/TimoxSniper/TiMax.git
cd TiMax/my-app

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren
cp .env.local.example .env.local

# Variablen in .env.local ausfüllen
# Siehe SETUP_SUPABASE.md für Details

# Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft unter [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
my-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── (routes)/       # Seiten
│   │   └── layout.tsx      # Root Layout
│   ├── components/         # React Components
│   │   ├── ui/            # shadcn/ui Komponenten
│   │   ├── chat/          # Chat-Komponenten
│   │   ├── upload/        # Upload-Komponenten
│   │   └── home/          # Landing Page
│   ├── lib/               # Utilities & Config
│   │   ├── supabase/      # Supabase Clients
│   │   ├── validation.ts  # Zod Schemas
│   │   └── errors.ts      # Error Handling
│   ├── hooks/             # Custom React Hooks
│   └── __tests__/         # Testdateien
├── docs/                  # Dokumentation
└── n8n-workflows/         # n8n Workflow JSONs
```

## Scripts

```bash
npm run dev              # Entwicklungsserver
npm run build            # Production Build
npm run start            # Production Server
npm run lint             # ESLint
npm run lint:fix         # ESLint --fix
npm run typecheck        # TypeScript Check
npm run test             # Tests (Watch Mode)
npm run test:coverage    # Tests mit Coverage
npm run test:ci          # Tests für CI/CD
```

## Testing

224 Tests decken kritische Funktionen ab:

- ✅ Input Validation & XSS-Schutz
- ✅ Security (CSRF, Rate Limiting)
- ✅ Error Handling
- ✅ Utility Funktionen
- ✅ Upload-Validierung

```bash
npm run test
```

## Sicherheit

- **CSRF Protection**: Double Submit Cookie Pattern
- **Rate Limiting**: Redis/Upstash (Production) / In-Memory (Dev)
- **XSS Protection**: Input Sanitization & CSP Headers
- **Auth**: Clerk mit RLS (Row Level Security)
- **Validation**: Zod Schemas für alle Inputs
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

Siehe `SECURITY_BEST_PRACTICES.md`

## Umgebungsvariablen

```env
# Required
N8N_CHAT_WEBHOOK_URL=
N8N_UPLOAD_WEBHOOK_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional (für Production)
SENTRY_DSN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Siehe `.env.local.example` für alle Variablen.

## Deployment

### Vercel (Empfohlen)

1. Repository auf GitHub pushen
2. Auf [Vercel](https://vercel.com) importieren
3. Umgebungsvariablen in Vercel Dashboard setzen
4. Deploy

### Manuelles Deployment

```bash
npm run build
npm run start
```

## API Dokumentation

### Chat API

```typescript
POST /api/chat
Body: {
  message: string (max 10.000 Zeichen)
  sessionId: string
  chatHistory?: Array<{role: "user" | "assistant", content: string}>
  chat_id?: string
}
```

### Upload API

```typescript
POST /api/upload
Body: FormData {
  file: File (max 100MB, MP4/WebM/MP3/WAV/M4A)
}
```

## Mitwirken

1. Fork erstellen
2. Feature Branch: `git checkout -b feature/neues-feature`
3. Committen: `git commit -m "feat: neues Feature"`
4. Pushen: `git push origin feature/neues-feature`
5. Pull Request erstellen

### Commit Convention

- `feat:` Neue Features
- `fix:` Bugfixes
- `docs:` Dokumentation
- `test:` Tests
- `refactor:` Refactoring
- `security:` Sicherheitsverbesserungen

## Lizenz

Proprietary - Alle Rechte vorbehalten.

## Support

Bei Fragen oder Problemen:

- Dokumentation im `docs/` Verzeichnis
- Issues auf GitHub
- Email: support@timax.xyz

---

**TiMax** - Transformiere Videos und Audios in kraftvolle Texte

# TiMax – Vollständige Flow-Analyse & Logs

**Erstellt**: 2026-02-19
**Analysiert von**: Claude Code (Automatische Codebase-Inspektion)

---

## Inhaltsverzeichnis

1. [Kompletter User-Flow](#1-kompletter-user-flow)
2. [Detailanalyse jedes Schritts](#2-detailanalyse-jedes-schritts)
3. [Gefundene Bugs & Fixes](#3-gefundene-bugs--fixes)
4. [Edge Cases & Szenarien](#4-edge-cases--szenarien)
5. [Sicherheitsbeurteilung](#5-sicherheitsbeurteilung)
6. [Architektur-Übersicht](#6-architektur-übersicht)
7. [Offene Punkte](#7-offene-punkte)

---

## 1. Kompletter User-Flow

```
[Erstbesucher]
      │
      ▼
  Landingpage (/)
  ├─ CTA "Datei hochladen" → /upload
  ├─ CTA "Wie funktioniert's?" → #workflow (Anker)
  └─ E-Mail-Signup (Waitlist)
      │
      ▼ (klickt CTA, nicht eingeloggt)
  Clerk Auth-Redirect
  ├─ /sign-in  (bestehende Accounts)
  └─ /sign-up  (neue Accounts) ──────────────────────────────────────┐
      │                                                                │
      ▼ (Nach Login / fallbackRedirectUrl="/chat")                    │
  /chat (protected)                                                   │
      │                                                                │
      ▼ Middleware-Check                                               │
  ┌─ Ist User NEU (< 24h) und hat onboarding NICHT abgeschlossen?    │
  │   JA → Redirect /welcome ◄─────────────────────────────────────── ┘
  │   NEIN → Chat anzeigen
  │
  ▼
/welcome (Onboarding-Seite)
  ├─ "30-Sekunden-Tour" → /upload?tour=1&style=floating
  │     Tour Schritt 1: Upload-Dropzone (/upload?tour=1)
  │     Tour Schritt 2: Workflow-Info  (/upload?tour=2)
  │     Tour Schritt 3: Upload-Liste   (/uploads?tour=3)
  │     Tour Schritt 4: Chat-Interface (/chat?tour=4)
  │     [Tour abschließen] → POST /api/onboarding/complete → /chat
  │     [Tour überspringen] → POST /api/onboarding/complete → aktuelle Seite (ohne ?tour)
  │
  └─ "Direkt starten" → POST /api/onboarding/complete → /upload
      │
      ▼
/upload (Upload-Flow)
  │  1. User wählt Datei (Drag & Drop oder Click)
  │  2. Datei-Validierung (Typ, Größe)
  │  3. CSRF-Token holen: GET /api/csrf
  │  4. Upload-Record erstellen: POST /api/uploads/create
  │     → Supabase: status="pending"
  │  5. Datei direkt zu n8n senden via XHR (NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL)
  │     Headers: X-Upload-ID, X-File-Name
  │     Progress-Tracking via XMLHttpRequest.upload
  │  6. n8n verarbeitet: Whisper STT → Embedding → Qdrant → Supabase-Update
  │     (status: pending → processing → completed)
  │  7. Erfolg: "Upload erfolgreich!" → Button "Zum Chat" (/chat)
  │
  ▼
/uploads (Upload-Liste)
  │  Zeigt alle Uploads des Users mit Status
  │  Daten: GET /api/uploads (mit user_id Filter)
  │
  ▼
/chat (Chat-Flow)
  │  1. Neuer Chat oder bestehenden Chat laden
  │  2. User tippt Nachricht
  │  3. CSRF-Token holen: GET /api/csrf
  │  4. POST /api/chat
  │     ├─ Auth-Check (Clerk)
  │     ├─ Chat in Supabase erstellen/fortsetzen
  │     ├─ User-Message in Supabase speichern
  │     ├─ Request an n8n Chat-Webhook
  │     │   n8n: Qdrant-Suche → Claude AI → Antwort
  │     └─ Sanitized AI-Response zurück ans Frontend
  │  5. AI-Antwort wird im Frontend angezeigt
  │  6. Chat-History: letzte 10 Nachrichten werden mitgesendet
  │
  ▼
[Stammkunde – wiederkehrender Nutzer]
  Login → /chat direkt (onboarding bereits abgeschlossen)
  Sidebar zeigt alle bisherigen Chats
  Kann neue Uploads machen, Chats starten, Uploads einsehen
```

---

## 2. Detailanalyse jedes Schritts

### 2.1 Landingpage (`/`)
- **Datei**: `src/app/page.tsx`
- **Zugang**: Öffentlich (keine Auth erforderlich)
- **Komponenten**: Hero, Stats (Zähl-Animation), Problem, Workflow-Vergleich, Features, Use-Cases, Benefits, Beta-Notice, Final-CTA, Email-Signup
- **CTAs**: Alle wichtigen Buttons verlinken auf `/upload` oder `/chat` → Clerk-Redirect wenn nicht eingeloggt
- **Besonderheit**: Stats-Counter-Animation via `IntersectionObserver` (nur einmalig, kein Loop-Problem)

### 2.2 Authentifizierung
- **Dateien**: `src/app/sign-in/[[...sign-in]]/page.tsx`, `src/app/sign-up/[[...sign-up]]/page.tsx`
- **Clerk**: Routing `hash`, DE-Lokalisierung aktiv
- **Nach Sign-in**: `fallbackRedirectUrl="/chat"` → Middleware fängt ab
- **Nach Sign-up**: `fallbackRedirectUrl="/chat"` → Middleware leitet neue User zu `/welcome`

### 2.3 Middleware (`src/middleware.ts`)
Wird bei **jedem Request** ausgeführt (außer statische Assets):

```
1. Rate-Limiting für /api/* Routen (Redis oder In-Memory)
2. Auth-Protect für geschützte Routen
3. Admin-Rollen-Check für /admin/*
4. Onboarding-Check: wenn /chat ohne ?tour und User neu → /welcome
5. CSP-Header setzen
```

**Onboarding-Check-Logik**:
```typescript
// Nur für /chat OHNE ?tour Parameter
if (pathname === "/chat" && !searchParams.has("tour")) {
  if (shouldShowOnboarding(user)) → redirect /welcome
}
// shouldShowOnboarding: onboardingCompleted !== true UND user < 24h alt
```

### 2.4 Onboarding / Welcome (`/welcome`)
- **Datei**: `src/app/welcome/page.tsx`
- **Trigger**: Middleware-Redirect für neue User
- **Optionen**:
  - Tour starten: Navigation zu `/upload?tour=1&style=floating`
  - Direkt starten: `POST /api/onboarding/complete` → `/upload`
- **Onboarding-Status**: Gespeichert in Clerk `publicMetadata.onboardingCompleted`

### 2.5 Tour-System
- **Provider**: `OnboardingTourProvider` (Context)
- **State**: URL-Query-Parameter (`?tour=1..4`, `?style=floating`)
- **Renderer**: `TourFloating` – positioniert sich automatisch neben Ziel-Element
- **Tour-Schritte**:

| Schritt | Route | Ziel-Selector | Beschreibung |
|---------|-------|---------------|--------------|
| 1 | `/upload?tour=1` | `upload-dropzone` | Upload-Bereich |
| 2 | `/upload?tour=2` | `workflow-section` | Workflow-Erklärung |
| 3 | `/uploads?tour=3` | `uploads-list` | Upload-Liste |
| 4 | `/chat?tour=4` | `chat-interface` | Chat-Interface |

- **Keyboard-Shortcuts**: `←` Zurück, `→` Weiter, `Esc` Überspringen
- **Tour abschließen**: `POST /api/onboarding/complete` → `/chat`

### 2.6 Upload-Flow (`/upload`)
- **Datei**: `src/app/upload/page.tsx` + `src/components/upload/file-upload.tsx`
- **Protected**: Ja (Clerk Auth)
- **Erlaubte Dateitypen**: MP4, WebM, MP3, WAV, M4A
- **Max. Größe**: 100 MB
- **Validierung**: Frontend (Typ, Größe) + Backend (Zod, Magic Bytes)

**Upload-Prozess** (Client-Side Upload zu n8n):
```
1. GET /api/csrf → csrfToken
2. POST /api/uploads/create (mit csrfToken) → uploadId aus Supabase
3. XHR POST → NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL
   Headers: X-Upload-ID, X-File-Name
   Body: FormData mit Datei
4. n8n: Whisper STT → Analyse → Embedding → Supabase + Qdrant
5. Frontend: Animierter ProcessingStatus (simulierte Schritte, ~270s total)
6. Erfolg: onUploadSuccess() → "Zum Chat" Button
```

**Hinweis**: Es gibt zwei Upload-Wege im Code:
- Client-Side (aktiv): `FileUpload`-Komponente → direkt zu n8n
- Server-Side (vorhanden, aber nicht verwendet): `/api/upload` route

### 2.7 Chat-Flow (`/chat`)
- **Datei**: `src/app/chat/page.tsx` + `src/components/chat/chat-interface.tsx` + `src/hooks/useChat.ts`
- **Mobile**: Vollbild ohne Nav/Footer, Sheet-Sidebar
- **Desktop**: Sidebar + Haupt-Chat, Max-Height `calc(100vh-16rem)`

**Nachricht senden**:
```
1. GET /api/csrf → csrfToken
2. POST /api/chat (message, sessionId, chat_id, chatHistory[letzte 10])
   ├─ Auth-Check (Clerk)
   ├─ Chat in Supabase erstellen (wenn neue chat_id)
   ├─ User-Message in Supabase speichern
   ├─ POST → n8n Chat-Webhook
   │   n8n: Qdrant-Suche + Claude AI + Antwort generieren
   └─ Sanitized AI-Output zurück
3. AI-Antwort im Frontend anzeigen
```

**Transcript-Übergabe** aus Upload: Via `localStorage.getItem("pending_transcript")` beim Mount.

### 2.8 Admin-Bereich (`/admin`)
- **Protected**: Ja (Clerk Auth + `publicMetadata.role === "admin"`)
- **Development**: Auto-Admin für ersten User
- **Sub-Seiten**: `/admin` (Dashboard), `/admin/users` (Benutzerverwaltung)
- **Admin-Actions**: User-Rollen ändern via `PATCH /api/admin/users/[id]`

---

## 3. Gefundene Bugs & Fixes

### Bug #1 – KRITISCH: `skipTour()` verursacht Onboarding-Loop ✅ BEHOBEN

**Problem**:
Wenn ein User die Tour über den ✕-Button im Floating-Card überspringt, wird `skipTour()` aufgerufen, das nur den `?tour` Parameter aus der URL entfernt, aber `onboardingCompleted` **nicht** auf `true` setzt.

**Konsequenz**:
Jedes Mal wenn der User anschließend `/chat` (ohne `?tour`) besucht, greift die Middleware und leitet ihn wieder zu `/welcome`. Dieser Loop hält 24 Stunden an.

**Fix** (`src/components/onboarding/onboarding-tour-provider.tsx`):
`skipTour()` ruft jetzt `POST /api/onboarding/complete` auf (non-blocking) bevor es navigiert:
```typescript
const skipTour = useCallback(async () => {
  try {
    await fetch('/api/onboarding/complete', { method: 'POST' });
  } catch {
    // Non-blocking: user kann trotzdem navigieren
  }
  router.push(pathname);
}, [router, pathname]);
```

---

### Bug #2 – KRITISCH: Fehlende `/unauthorized` Seite ✅ BEHOBEN

**Problem**:
Die Middleware redirectet nicht-Admin-User, die `/admin/*` aufrufen, zu `/unauthorized`. Diese Seite existierte nicht → 404 Error.

**Fix**:
`src/app/unauthorized/page.tsx` erstellt mit deutschem Fehlertext, Erklärung und "Zurück zum Chat" Button.

---

### Bug #3 – ProcessingStatus Memory Leak / instabile Referenz ✅ BEHOBEN

**Problem**:
Der `onComplete`-Callback in `ProcessingStatus` wurde als Inline-Arrow-Function übergeben. Da `ProcessingStatus` diesen Callback als `useEffect`-Dependency nutzt, wurde der Effekt bei jedem Render neu ausgeführt und löste mehrere parallele Timer-Chains aus.

**Fix** (`src/components/upload/file-upload.tsx`):
`handleProcessingComplete` als `useCallback` mit `[isProcessingAI]` Dependency extrahiert und stabil übergeben.

---

## 4. Edge Cases & Szenarien

### Szenario A: User sign-up, kein Onboarding innerhalb 24h
- User registriert sich, schließt Tab sofort
- Nächster Tag: Login → `/chat` direkt (24h-Fenster abgelaufen)
- `shouldShowOnboarding()` gibt `false` zurück → kein `/welcome` mehr
- **Ergebnis**: User sieht nie Onboarding, kann aber normal arbeiten ✅

### Szenario B: User doppelt auf CTA geklickt (doppelter Upload)
- `file-upload.tsx`: `isUploading` State verhindert zweiten `handleUpload()` Aufruf (Button disabled)
- Jedoch: Kein Debounce auf "Datei auswählen" Button
- **Ergebnis**: Kein kritisches Problem, aber User könnte zwei Upload-Records erstellen wenn er den XHR abbricht und neu startet ⚠️

### Szenario C: n8n Webhook nicht erreichbar (Upload)
- XHR schlägt fehl → `xhr.addEventListener("error")` → `reject(new Error("Netzwerkfehler beim Upload"))`
- Error wird in `FileUpload` State gesetzt und angezeigt
- Supabase-Record bleibt mit Status `"pending"` (wird nie auf `"failed"` gesetzt, weil der Error-Handler im `/api/upload` route ist, nicht im client-side Flow)
- **Ergebnis**: Waisenkind-Records in Supabase ⚠️

### Szenario D: n8n Webhook nicht erreichbar (Chat)
- `fetch()` wirft Netzwerkfehler → caught → "Verbindung zum KI-Service fehlgeschlagen"
- User sieht Fehlermeldung in Chat
- Kein Retry-Mechanismus
- **Ergebnis**: User muss manuell erneut senden ✅ (akzeptabel)

### Szenario E: CSRF-Token abgelaufen (24h Cookie)
- Cookie läuft ab → nächste API-Anfrage: `getCsrfTokenFromCookie()` gibt `undefined` zurück
- API antwortet mit 403 "CSRF token missing"
- User sieht Fehlermeldung
- Page-Refresh löst das Problem (neues CSRF-Token wird bei nächstem `/api/csrf` Aufruf gesetzt)
- **Ergebnis**: Gelegentliche 403 bei langen Sessions ohne Reload ⚠️

### Szenario F: Rate Limit erreicht (Upload: 5/h)
- Nach 5 Uploads: 429 mit `Retry-After` Header
- Middleware gibt JSON zurück
- `FileUpload` XHR sendet **direkt zu n8n**, nicht über `/api/upload` → Rate Limiting greift nicht für den Upload selbst! Rate Limiting gilt nur für `/api/uploads/create`
- **Ergebnis**: User kann > 5 Dateien zu n8n senden (Limit greift nur für Supabase-Record-Erstellung) ⚠️

### Szenario G: Tour-Floating-Card findet Ziel-Element nicht
- `document.querySelector('[data-tour="X"]')` gibt `null` zurück
- Retry nach 800ms (einmalig)
- Falls dann noch nicht gefunden: Karte wird nicht angezeigt, aber Backdrop bleibt aktiv
- User sieht verdunkelte Seite ohne Karte, nur Klick irgendwo ruft `skipTour()` auf
- **Ergebnis**: Tour "hängt" kurzzeitig, aber User kann ESC oder Klick nutzen ✅ (jetzt mit skipTour → onboarding complete)

### Szenario H: Billing / Subscription
- Kein Billing-Flow in der Codebase gefunden
- Clerk Billing ist konfiguriert (CSP enthält `https://js.stripe.com`)
- Commithistorie zeigt kürzlich Stripe/Clerk-Billing Fixes
- **Ergebnis**: Billing-Integration existiert in Clerk-Konfiguration, aber keine UI-Seite im Code ⚠️

### Szenario I: Mobile Upload
- Upload-Seite ist vollständig responsiv
- Chat auf Mobile: Vollbild ohne Header/Footer (`h-[100dvh]`)
- XHR Progress funktioniert auch auf Mobile
- Safari: `overscroll-contain` und `touch-pan-y` gesetzt
- **Ergebnis**: Mobile-Flow funktioniert ✅

### Szenario J: Mehrere Tabs offen
- Chat: Jeder Tab hat eigene `sessionId` und `chatId`
- Kein WebSocket / Real-Time-Sync zwischen Tabs
- Upload-Status wird nicht zwischen Tabs synchronisiert
- **Ergebnis**: Kein kritisches Problem, aber State kann divergieren ⚠️

### Szenario K: Sehr große Dateien (nahe 100MB)
- Frontend-Validierung vor Upload
- Backend: `maxDuration = 60s` in `/api/upload` (wird aber nicht verwendet im client-side flow)
- XHR Upload: Kein Timeout (potenziell Problem bei sehr langsamer Verbindung)
- n8n: Eigene Timeouts und Limits
- **Ergebnis**: Sehr langsame Verbindungen könnten Probleme haben ⚠️

---

## 5. Sicherheitsbeurteilung

### Stärken ✅
- **CSRF-Schutz**: Double Submit Cookie Pattern auf allen POST/PATCH/DELETE APIs
- **Timing-Safe Comparison**: `crypto.timingSafeEqual` für CSRF-Token-Vergleich
- **Rate Limiting**: User-basiert (sicherer als IP-basiert), fallback auf IP
- **Auth auf allen geschützten Routen**: Clerk-Middleware zuverlässig
- **User-Isolation**: Alle DB-Queries filtern nach `user_id`
- **Input-Sanitization**: Zod-Schemas + `sanitizeString()` + `sanitizeAIOutput()`
- **Magic Bytes Validierung**: Dateityp via echte Byte-Signatur, nicht nur Extension
- **Sentry-Integration**: Fehler werden geloggt
- **Filename-Validierung**: Nur `[a-zA-Z0-9._-]` erlaubt
- **CSP-Headers**: Gesetzt in Middleware und Layout

### Hinweise ⚠️
- **`NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL`**: Client-seitig exponiert (notwendig für direkten Upload), aber bekanntes Risiko
- **XHR ohne Auth-Header an n8n**: n8n muss die Upload-ID kennen, um den richtigen User zuzuordnen – das funktioniert via Supabase-Record-Lookup
- **AI-Response nicht in Supabase gespeichert** (in `/api/chat`): n8n übernimmt die Persistierung der Assistant-Messages oder sie werden nicht gespeichert
- **In-Memory Rate Limiting in Development**: Wird nach Serverrestart zurückgesetzt

---

## 6. Architektur-Übersicht

```
Browser/Client
    │
    ├─ Next.js Frontend (App Router, Vercel)
    │   ├─ Clerk (Auth, Session Management)
    │   ├─ Supabase Client (RLS-geschützt)
    │   └─ n8n direkt (Upload via XHR)
    │
    ├─ Middleware (Edge Runtime)
    │   ├─ Rate Limiting (Upstash Redis / In-Memory)
    │   ├─ Auth Protection (Clerk)
    │   ├─ Admin Role Check
    │   ├─ Onboarding Redirect
    │   └─ CSP Headers
    │
    └─ API Routes (Node.js Runtime)
        ├─ /api/chat → n8n Chat Webhook
        ├─ /api/upload → n8n Upload Webhook (Server-Side, unused by client)
        ├─ /api/uploads/create → Supabase
        ├─ /api/csrf → Token Generation
        ├─ /api/onboarding/complete → Clerk Metadata Update
        └─ /api/admin/* → Clerk + Supabase Admin

n8n (Workflow Engine)
    ├─ Upload-Workflow: Whisper STT → Analyse → Qdrant + Supabase
    └─ Chat-Workflow: Qdrant-Suche → Claude AI → Supabase

Supabase (PostgreSQL + RLS)
    ├─ chats (user_id, session_id, title)
    ├─ messages (chat_id, role, content)
    ├─ uploads (user_id, file_name, status, transcript)
    └─ waitlist (email)

Qdrant (Vektor-DB, via n8n)
    └─ Embeddings der Transkripte (für Semantic Search)
```

---

## 7. Offene Punkte

| Priorität | Thema | Details |
|-----------|-------|---------|
| Mittel | Waisenkind-Upload-Records | Wenn Client-Side XHR fehlschlägt, bleibt Supabase-Record mit `status="pending"`. Kein automatisches Cleanup. |
| Mittel | Rate Limit greift nicht für n8n-Upload | User kann >5 Dateien direkt zu n8n senden; Limit gilt nur für `POST /api/uploads/create`. |
| Mittel | AI-Response Persistierung unklar | `/api/chat` speichert nur User-Message in Supabase. Assistant-Response muss von n8n gespeichert werden (nicht verifizierbar ohne n8n-Workflow-Zugang). |
| Niedrig | XHR-Timeout fehlt für sehr langsame Verbindungen | Kein `xhr.timeout` gesetzt – bei sehr langsamer Verbindung hängt der Upload unbegrenzt. |
| Niedrig | Mehrere Tabs / Desync | Kein Real-Time-Sync zwischen Tabs via WebSocket/SSE. |
| Niedrig | Double-Upload möglich | User könnte Upload abbrechen und neu starten, ohne den alten Record zu bereinigen. |
| Info | Billing-UI fehlt | Clerk Billing / Stripe ist konfiguriert (CSP), aber keine UI-Seite vorhanden. |

---

*Analyse abgeschlossen: 2026-02-19. Alle kritischen Bugs wurden behoben.*

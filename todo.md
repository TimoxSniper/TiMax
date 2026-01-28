# 📋 TiMax Launch TODO-Liste

**Erstellt:** 2026-01-28  
**Ziel:** Multi-User-fähiger Production-Launch  
**Zeitrahmen:** 2-3 Wochen

---

## 🎯 Übersicht

### Aktueller Stand ✅
- ✅ Frontend: Landing Page, Chat-Interface, Upload-Komponente
- ✅ Backend: API-Routen für Chat und Upload implementiert
- ✅ n8n-Integration: Webhooks konfiguriert
- ✅ Environment-Variablen: `.env.local` vorhanden
- ✅ Build: Erfolgreich kompiliert, keine TypeScript-Fehler
- ✅ Code-Qualität: Viele kritische Fixes heute umgesetzt

### Was noch fehlt ❌
- ❌ Authentifizierung (Login/Registrierung)
- ❌ Datenbank (User-Daten, Chat-Historie, Uploads)
- ❌ User-Isolation (jeder User sieht nur eigene Daten)
- ❌ Error-Tracking & Monitoring
- ❌ Analytics
- ❌ Session-Management (Backend statt nur Browser)

---

## 🚀 Phase 1: Foundation (Diese Woche)

**Ziel:** Kritische Basis für Production schaffen  
**Zeitaufwand:** 1-2 Tage

### 1.1 Error-Tracking (Sentry)
- [ ] Sentry-Account erstellen
- [x] `@sentry/nextjs` installieren
- [x] Sentry in `next.config.ts` konfigurieren
- [x] Error-Boundary mit Sentry verbinden
- [x] API-Routen Error-Handling mit Sentry
- [x] Environment-Variable: `SENTRY_DSN` (in env.ts hinzugefügt)
- [ ] Test: Fehler manuell auslösen und prüfen (benötigt Sentry-Account)

**Zeitaufwand:** 2-3 Stunden  
**Priorität:** 🔴 Kritisch  
**Status:** 🟡 Teilweise abgeschlossen (Code fertig, benötigt Sentry-Account für Tests)

---

### 1.2 Analytics (Plausible)
- [ ] Plausible-Account erstellen (oder Google Analytics)
- [ ] Analytics-Script in `layout.tsx` einbinden
- [ ] Event-Tracking für wichtige Aktionen:
  - [ ] CTA-Clicks auf Homepage
  - [ ] Format-Auswahl im Text-Generator
  - [ ] Upload-Success
  - [ ] Chat-Messages gesendet
  - [ ] Login/Registrierung
- [ ] Environment-Variable: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Test: Events in Dashboard prüfen

**Zeitaufwand:** 1-2 Stunden  
**Priorität:** 🔴 Kritisch

---

### 1.3 ENV-Var-Validierung (Zod)
- [x] `zod` installieren
- [x] `lib/env.ts` erstellen mit Schema:
  - [x] `N8N_CHAT_WEBHOOK_URL`
  - [x] `N8N_UPLOAD_WEBHOOK_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_URL` (später)
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (später)
  - [x] `NEXTAUTH_SECRET` (später)
- [x] Validierung in API-Routen einbauen
- [x] Fehlerhafte ENV-Vars früh abfangen
- [x] `.env.example` Datei erstellen

**Zeitaufwand:** 2-3 Stunden  
**Priorität:** 🟡 Wichtig  
**Status:** ✅ Abgeschlossen

---

### 1.4 Code-Cleanup
- [x] Veraltete Dateien entfernen:
  - [x] `my-app/src/app/page-old.tsx` löschen
  - [x] Root-Level Duplikate prüfen:
    - [x] `chat-header.tsx` (Root vs. `components/chat/`)
    - [x] `chat-input.tsx` (Root vs. `components/chat/`)
    - [x] `message-list.tsx` (Root vs. `components/chat/`)
- [ ] Unused Imports entfernen
- [ ] TODO-Kommentare durchgehen und priorisieren

**Zeitaufwand:** 1 Stunde  
**Priorität:** 🟢 Nice-to-have  
**Status:** 🟡 Teilweise abgeschlossen

---

## 👥 Phase 2: Multi-User-Setup (Nächste Woche)

**Ziel:** Authentifizierung und Datenbank einrichten  
**Zeitaufwand:** 3-4 Tage

### 2.1 Supabase-Projekt einrichten
- [ ] Supabase-Account erstellen
- [ ] Neues Projekt anlegen
- [ ] API-Keys kopieren:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Supabase-Client initialisieren (`lib/supabase.ts`)
- [ ] Test-Connection prüfen

**Zeitaufwand:** 1-2 Stunden  
**Priorität:** 🔴 Kritisch

---

### 2.2 Datenbank-Schema erstellen
- [ ] SQL-Schema in Supabase SQL Editor ausführen:

```sql
-- Chats Table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploads Table
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  status TEXT DEFAULT 'processing',
  transcript_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
```

- [ ] Row Level Security (RLS) aktivieren:
  - [ ] Chats: User kann nur eigene Chats sehen
  - [ ] Messages: User kann nur Messages seiner Chats sehen
  - [ ] Uploads: User kann nur eigene Uploads sehen
- [ ] Policies testen

**Zeitaufwand:** 3-4 Stunden  
**Priorität:** 🔴 Kritisch

---

### 2.3 NextAuth.js Integration
- [ ] Dependencies installieren:
  ```bash
  npm install next-auth @auth/supabase-adapter
  ```
- [ ] `app/api/auth/[...nextauth]/route.ts` erstellen
- [ ] Auth-Provider konfigurieren:
  - [ ] Email-Provider (Magic Link)
  - [ ] Google OAuth (optional)
- [ ] Session-Callbacks einrichten
- [ ] `SessionProvider` in `layout.tsx` einbinden
- [ ] `lib/auth.ts` Hook erstellen (`useAuth`)
- [ ] Test: Login/Logout funktioniert

**Zeitaufwand:** 4-6 Stunden  
**Priorität:** 🔴 Kritisch

---

### 2.4 Login/Registrierung UI
- [ ] Login-Seite erstellen (`/login`)
- [ ] Registrierungs-Seite erstellen (`/register`)
- [ ] Auth-Buttons in Navigation
- [ ] Protected Routes Middleware
- [ ] User-Menü (Avatar, Logout) in Navigation
- [ ] Redirect-Logik nach Login

**Zeitaufwand:** 4-6 Stunden  
**Priorität:** 🔴 Kritisch

---

## 🔗 Phase 3: Integration (Woche 3)

**Ziel:** Alles zusammenführen - User-Daten in alle Features integrieren  
**Zeitaufwand:** 5-6 Tage

### 3.1 API-Routen anpassen
- [ ] `api/chat/route.ts`:
  - [ ] User-ID aus Session extrahieren
  - [ ] Chat in Datenbank speichern/laden
  - [ ] Messages in Datenbank speichern
  - [ ] Chat-Historie aus Datenbank laden
- [ ] `api/upload/route.ts`:
  - [ ] User-ID aus Session extrahieren
  - [ ] Upload-Metadaten in Datenbank speichern
  - [ ] User-spezifische Uploads zurückgeben
- [ ] Neue API-Routen erstellen:
  - [ ] `GET /api/chats` - Liste aller Chats des Users
  - [ ] `GET /api/chats/[id]` - Einzelner Chat mit Messages
  - [ ] `POST /api/chats` - Neuen Chat erstellen
  - [ ] `DELETE /api/chats/[id]` - Chat löschen
  - [ ] `GET /api/uploads` - Liste aller Uploads des Users

**Zeitaufwand:** 2 Tage  
**Priorität:** 🔴 Kritisch

---

### 3.2 Frontend-Komponenten anpassen
- [ ] `ChatInterface`:
  - [ ] User-ID aus Session holen
  - [ ] Chat-Historie aus Datenbank laden
  - [ ] Messages in Datenbank speichern
  - [ ] Chat-Liste anzeigen (Sidebar)
  - [ ] Neue Chat-Session erstellen
- [ ] `FileUpload`:
  - [ ] User-ID zu Upload-Metadaten hinzufügen
  - [ ] User-spezifische Uploads anzeigen
- [ ] Navigation:
  - [ ] User-Menü (Avatar, Logout)
  - [ ] Protected Routes (nur für eingeloggte User)
- [ ] Text-Generator:
  - [ ] User-ID zu Transkripten hinzufügen

**Zeitaufwand:** 2 Tage  
**Priorität:** 🔴 Kritisch

---

### 3.3 Testing & Bug-Fixes
- [ ] Multi-User-Szenarien testen:
  - [ ] User A erstellt Chat → User B sieht ihn nicht
  - [ ] User A lädt Datei hoch → User B sieht sie nicht
  - [ ] User A löscht Chat → nur sein Chat verschwindet
- [ ] Session-Management testen:
  - [ ] Login → Chat-Historie wird geladen
  - [ ] Logout → Daten bleiben gespeichert
  - [ ] Neue Session → neue Chat-ID
- [ ] Performance-Tests:
  - [ ] Viele Messages laden
  - [ ] Viele Uploads anzeigen
- [ ] Bug-Fixes basierend auf Tests

**Zeitaufwand:** 1 Tag  
**Priorität:** 🔴 Kritisch

---

## 🚀 Phase 4: Production-Ready (Woche 3-4)

**Ziel:** Finale Vorbereitung für Launch  
**Zeitaufwand:** 3-4 Tage

### 4.1 Security & Performance
- [ ] Rate-Limiting für API-Routen
- [ ] CORS richtig konfigurieren
- [ ] Input-Validierung verschärfen
- [ ] SQL-Injection-Schutz prüfen
- [ ] XSS-Schutz prüfen
- [ ] HTTPS erzwingen

**Zeitaufwand:** 1 Tag  
**Priorität:** 🟡 Wichtig

---

### 4.2 Monitoring & Alerts
- [ ] Sentry-Alerts einrichten
- [ ] Uptime-Monitoring (z.B. UptimeRobot)
- [ ] Performance-Monitoring
- [ ] Error-Rate-Tracking
- [ ] User-Activity-Dashboard

**Zeitaufwand:** 1 Tag  
**Priorität:** 🟡 Wichtig

---

### 4.3 Deployment
- [ ] Vercel-Projekt einrichten
- [ ] Environment-Variablen auf Vercel setzen:
  - [ ] Supabase-Keys
  - [ ] NextAuth-Secret
  - [ ] Sentry-DSN
  - [ ] Analytics-Keys
- [ ] Production-Build testen
- [ ] Domain konfigurieren
- [ ] SSL-Zertifikat prüfen
- [ ] Deployment testen

**Zeitaufwand:** 1 Tag  
**Priorität:** 🔴 Kritisch

---

### 4.4 Dokumentation
- [ ] README.md aktualisieren:
  - [ ] Setup-Anleitung
  - [ ] Environment-Variablen
  - [ ] Deployment-Guide
- [ ] API-Dokumentation erstellen
- [ ] User-Guide (optional)
- [ ] Changelog führen

**Zeitaufwand:** 1 Tag  
**Priorität:** 🟢 Nice-to-have

---

## 📊 Zeitplan-Zusammenfassung

| Phase | Aufgaben | Zeitaufwand | Status |
|-------|----------|------------|--------|
| **Phase 1** | Foundation (Monitoring, Analytics, ENV-Validierung) | 1-2 Tage | ⏳ Pending |
| **Phase 2** | Multi-User-Setup (Supabase, NextAuth, DB-Schema) | 3-4 Tage | ⏳ Pending |
| **Phase 3** | Integration (API-Routen, Frontend, Testing) | 5-6 Tage | ⏳ Pending |
| **Phase 4** | Production-Ready (Security, Deployment, Docs) | 3-4 Tage | ⏳ Pending |
| **GESAMT** | | **12-16 Tage (2-3 Wochen)** | |

---

## ✅ Quick-Wins (Kann sofort gemacht werden)

Diese Aufgaben können parallel oder zwischendurch gemacht werden:

- [x] `.env.example` Datei erstellen
- [x] Veraltete Dateien entfernen (`page-old.tsx`, Root-Duplikate)
- [ ] README.md aktualisieren
- [ ] Code-Kommentare verbessern
- [ ] TypeScript-Types verschärfen (`any` Types entfernen)

**Zeitaufwand:** 2-3 Stunden  
**Priorität:** 🟢 Nice-to-have  
**Status:** 🟡 Teilweise abgeschlossen

---

## 🎯 Launch-Kriterien

Das Projekt ist launch-ready wenn:

### Kritisch (MUSS vor Launch):
- [x] Build erfolgreich
- [ ] Error-Tracking aktiv
- [ ] Analytics aktiv
- [ ] Authentifizierung funktioniert
- [ ] Datenbank-Schema erstellt
- [ ] User-Isolation funktioniert
- [ ] API-Routen mit User-ID
- [ ] Frontend mit Auth-Integration
- [ ] Multi-User-Tests bestanden
- [ ] Production-Deployment getestet

### Wichtig (Sollte vor Launch):
- [ ] Rate-Limiting aktiv
- [ ] Security-Checks durchgeführt
- [ ] Performance optimiert
- [ ] Monitoring eingerichtet
- [ ] Dokumentation aktualisiert

### Nice-to-have (Kann nach Launch):
- [ ] OAuth-Provider (Google, GitHub)
- [ ] Email-Verification
- [ ] Password-Reset
- [ ] Profile-Seite
- [ ] Admin-Dashboard
- [ ] Tests geschrieben

---

## 📝 Notizen

### Entscheidungen
- **Auth-Lösung:** NextAuth.js + Supabase
- **Datenbank:** Supabase (PostgreSQL)
- **Error-Tracking:** Sentry
- **Analytics:** Plausible (oder Google Analytics)
- **Hosting:** Vercel

### Offene Fragen
- [ ] Welche OAuth-Provider sollen unterstützt werden?
- [ ] Soll Email-Verification Pflicht sein?
- [ ] Wie sollen gelöschte Chats behandelt werden? (Soft Delete?)
- [ ] Sollen User ihre Uploads löschen können?

### Bekannte Probleme
- Aktuell keine kritischen bekannten Probleme
- Alle heute identifizierten Fehler wurden behoben

---

## 🔄 Updates

**2026-01-28:**
- TODO-Liste erstellt
- Launch-Plan definiert
- Multi-User-Implementierungsplan erstellt
- ✅ Phase 1.3 abgeschlossen: ENV-Var-Validierung mit Zod implementiert
- ✅ Phase 1.4 teilweise abgeschlossen: Code-Cleanup (veraltete Dateien entfernt)
- ✅ Quick-Wins teilweise abgeschlossen: `.env.example` erstellt, veraltete Dateien entfernt

---

**Status:** 🟡 In Arbeit  
**Nächster Schritt:** Phase 1.1 (Error-Tracking mit Sentry) oder Phase 1.2 (Analytics)


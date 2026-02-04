# 📋 TiMax Project Roadmap

Dieser Plan strukturiert die restlichen Aufgaben in logische Batches, die nacheinander (oder parallel als Block) abgearbeitet werden können.

---

## ✅ Batch 0: Foundation & Core Logic (Erledigt)
- [x] **Frontend Basis:** Landing Page, Chat-Interface Komponenten, Upload-UI
- [x] **Auth Integration:** Clerk Auth konfiguriert und Middleware integriert
- [x] **Backend Infrastructure:** API-Routen für Chat und Upload mit n8n-Integration
- [x] **Rate Limiting:** Redis-basiertes Rate Limiting in Middleware (Upstash)
- [x] **Security:** Zod-Validierung für API-Inputs und Env-Variablen
- [x] **Error Tracking:** Sentry-Integration für Client und Server
- [x] **Code Quality:** Refactoring der monolithischen Page in Komponenten, `useChat` Hook extrahiert

---

## ✅ Batch 1: Middleware & Config Polish (Erledigt)
- [x] **Middleware Warning beheben:** Analyse der `middleware-to-proxy` Warnung (Sentry Tunnel vs. Next.js Middleware)
- [x] **Redis Connection:** Sicherstellen, dass die Redis-Verbindung für Production stabil ist (Timeout-Handling)
- [x] **Environment Sync:** `.env.example` mit allen aktuell benötigten Keys (Clerk, Supabase, Redis, n8n) synchronisieren
- [x] **API Header:** CSRF-Schutz und Security-Header (CSP) finalisieren

---

## ✅ Batch 2: Chat Persistence & History (Erledigt)
- [x] **Frontend State Management:** `useChat` Hook erweitern, um `chat_id` aus der DB zu verwalten
- [x] **History Loading:** Automatisches Laden der Nachrichten-Historie beim Mounten oder bei Auswahl eines Chats
- [x] **New Chat Logic:** Funktion zum Zurücksetzen des aktuellen Chats und Starten einer neuen DB-Session
- [x] **Error Handling:** Verbesserte UI-Feedbacks bei DB-Verbindungsfehlern

---

## ✅ Batch 3: User Experience & Sidebar (Erledigt)
- [x] **Chat Sidebar:** Entwicklung einer Sidebar-Komponente zur Anzeige der letzten Chats
- [x] **Sidebar Integration:** Integration in das `ChatInterface` (Responsive: Drawer auf Mobile)
- [x] **Chat Management:** Löschen von Chats und Umbenennen von Chat-Titeln (API + UI)
- [x] **Empty State:** Optimierung des "No Chats" Screens

---

## ✅ Batch 4: File Management & Dashboards (Erledigt)
- [x] **Upload Dashboard:** Übersicht über bisherige Uploads und deren Status
- [x] **Transcript Linking:** Verknüpfung von Transkripten mit spezifischen Chat-Sessions
- [x] **File Deletion:** Löschen von Dateien aus der DB (und optional S3/Supabase Storage)
- [x] **Transkript Preview:** Schnelle Ansicht der generierten Transkripte vor dem Chat

---

## 📦 Batch 5: Production Ready & Launch (Prio: Hoch)
- [ ] **E2E Testing:** Multi-User Tests (Sicherstellen, dass User nur eigene Daten sehen)
- [ ] **Performance Audit:** Optimierung der Bundle-Size und Ladezeiten
- [ ] **Domain & SSL:** Finale Konfiguration der Produktions-Domain
- [ ] **Documentation:** Update von `README.md` und internen API-Docs

---

## 📝 Notizen & Aktuelle Fehler
- **Middleware Warning:** `middleware-to-proxy` tritt beim Build auf. Wahrscheinlich wegen Sentry `tunnelRoute`.
- **Redis Placeholder:** `.env.local` enthält aktuell Placeholder für Redis (Upstash).
- **History Link:** Aktuell werden Chats in die DB geschrieben, aber noch nicht vom Frontend geladen.

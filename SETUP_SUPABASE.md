# TiMax Setup Guide: Supabase + n8n + Clerk

Dieses Dokument erklärt, wie du TiMax mit allen Services einrichtest.

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                            │
│                                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│  │   Chat UI   │     │  Upload UI  │     │  History UI │              │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘              │
│         │                   │                   │                       │
│         └───────────────────┼───────────────────┘                       │
│                             │                                           │
│                    ┌────────▼────────┐                                 │
│                    │  Clerk Auth     │  ← User Login/Signup            │
│                    │  (userId)       │                                 │
│                    └────────┬────────┘                                 │
└─────────────────────────────┼───────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Next.js API     │
                    │   Routes          │
                    │ /api/chat         │
                    │ /api/upload       │
                    │ /api/uploads      │
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Supabase    │    │     n8n       │    │    Qdrant     │
│   PostgreSQL  │    │   Workflows   │    │  Vector DB    │
│               │    │               │    │               │
│ - chats       │◄───│ Chat Workflow │───►│ Knowledge     │
│ - messages    │    │               │    │ Base          │
│ - uploads     │◄───│Upload Workflow│───►│               │
│               │    │               │    │ (user_id      │
│ user_id Filter│    │ user_id Pass  │    │  filtered!)   │
└───────────────┘    └───────────────┘    └───────────────┘
```

## User-Isolation (Wichtig!)

**Jeder User sieht NUR seine eigenen Daten:**

1. **Clerk Auth**: User-ID wird bei jedem Request validiert
2. **Next.js API**: Alle Queries filtern mit `WHERE user_id = [Clerk ID]`
3. **n8n Workflows**: Erhalten `user_id` und speichern korrekt
4. **Qdrant**: Vector-Suche filtert nach `user_id` in Metadaten

---

## Teil 1: Supabase Setup

### 1.1 Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Wähle Region (am besten Frankfurt für DACH)
4. Merke dir das Datenbank-Passwort!

### 1.2 Schema ausführen

1. Gehe zu **SQL Editor** (linke Sidebar)
2. Klicke **+ New query**
3. Kopiere den kompletten Inhalt von `supabase-schema.sql`
4. Klicke **Run** (oder Ctrl+Enter)
5. Warte auf "Success"

### 1.3 API Keys kopieren

Gehe zu **Project Settings → API**:

| Key | Environment Variable | Verwendung |
|-----|---------------------|------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Beide (Frontend + Backend) |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js API Routes |
| service_role | `SUPABASE_SERVICE_ROLE_KEY` | n8n Workflows |

### 1.4 Storage Bucket erstellen

1. Gehe zu **Storage** (linke Sidebar)
2. Klicke **Create new bucket**
3. Einstellungen:
   - **Name**: `timax-uploads`
   - **Public**: **NEIN** (wichtig!)
   - **File size limit**: 100 MB
   - **Allowed MIME types**: `audio/*,video/*`

---

## Teil 2: n8n Setup

### 2.1 Credentials erstellen

Du brauchst diese API-Zugangsdaten in n8n:

#### A) Supabase Credentials

1. In n8n: **Credentials → Add Credential → Supabase API**
2. Eingaben:
   - **Host**: Deine Supabase Project URL (ohne `https://`)
   - **Service Role Key**: Der `service_role` Key von Supabase

#### B) Google Gemini Credentials

1. Gehe zu [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Erstelle einen API Key
3. In n8n: **Credentials → Add Credential → Google PaLM API**
4. Füge den API Key ein

#### C) ElevenLabs Credentials

1. Gehe zu [elevenlabs.io](https://elevenlabs.io) → Profile → API Keys
2. Erstelle einen API Key
3. In n8n: **Credentials → Add Credential → Eleven Labs API**
4. Füge den API Key ein

#### D) Qdrant Credentials

1. Gehe zu [cloud.qdrant.io](https://cloud.qdrant.io)
2. Erstelle ein kostenloses Cluster
3. Kopiere:
   - **Cluster URL**: z.B. `https://abc123.eu-central.aws.cloud.qdrant.io:6333`
   - **API Key**: Unter "Data Access Control"
4. In n8n: **Credentials → Add Credential → Qdrant API**
5. Eingaben:
   - **API URL**: Die Cluster URL
   - **API Key**: Der Qdrant API Key

### 2.2 Qdrant Collection erstellen

In Qdrant Dashboard oder via API:

```bash
curl -X PUT "https://YOUR_QDRANT_URL/collections/timax_knowledge_base" \
  -H "api-key: YOUR_QDRANT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 768,
      "distance": "Cosine"
    }
  }'
```

### 2.3 Workflows importieren

1. In n8n: **Settings → Import from File**
2. Importiere:
   - `n8n-workflows/chat-workflow-supabase-final.json`
   - `n8n-workflows/upload-workflow-supabase-final.json`

### 2.4 Credentials zuweisen

Nach dem Import musst du bei JEDEM Node die Credentials zuweisen:

#### Chat Workflow Nodes:

| Node | Credential-Typ |
|------|----------------|
| Google Gemini Chat | Google PaLM API |
| Search Knowledge Base | Qdrant API |
| Embeddings | Google PaLM API |
| Save to Supabase | Supabase API |

#### Upload Workflow Nodes:

| Node | Credential-Typ |
|------|----------------|
| ElevenLabs STT | Eleven Labs API |
| Google Gemini (Metadata) | Google PaLM API |
| Update Supabase | Supabase API |
| Embeddings | Google PaLM API |
| Insert Qdrant | Qdrant API |

### 2.5 Workflows aktivieren

1. Öffne jeden Workflow
2. Klicke oben rechts auf **Inactive → Active**
3. Kopiere die Webhook URLs:
   - Chat: `https://YOUR_N8N_URL/webhook/timax-chat`
   - Upload: `https://YOUR_N8N_URL/webhook/timax-upload`

---

## Teil 3: Next.js Konfiguration

### 3.1 Environment Variables

Erstelle `my-app/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk (bereits vorhanden)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# n8n Webhooks
N8N_CHAT_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/timax-chat
N8N_UPLOAD_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/timax-upload

# Qdrant (optional, nur wenn direkt von Next.js aus)
QDRANT_URL=https://xxx.eu-central.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=xxx
```

### 3.2 Clerk Webhook (optional)

Wenn du willst, dass bei neuen Clerk-Usern automatisch ein Supabase-Eintrag erstellt wird:

1. In Clerk Dashboard → Webhooks
2. Neuer Webhook für `user.created`
3. URL: `https://your-domain.com/api/webhooks/clerk`

---

## Teil 4: Testen

### 4.1 Supabase testen

Gehe zu **Table Editor** und prüfe:
- [ ] Tabelle `chats` existiert
- [ ] Tabelle `messages` existiert
- [ ] Tabelle `uploads` existiert

### 4.2 n8n Workflows testen

**Chat Workflow:**
```bash
curl -X POST "https://your-n8n/webhook/timax-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "chat_id": null,
    "message": "Hallo, wie geht es dir?",
    "sessionId": "test-session",
    "chatHistory": []
  }'
```

**Upload Workflow:**
```bash
curl -X POST "https://your-n8n/webhook/timax-upload" \
  -H "X-User-ID: test_user_123" \
  -H "X-Upload-ID: 00000000-0000-0000-0000-000000000000" \
  -H "X-File-Name: test.mp3" \
  -F "Audio/Video Datei=@test.mp3"
```

### 4.3 Kompletter Flow testen

1. Starte die App: `npm run dev`
2. Melde dich mit Clerk an
3. Lade eine Audio-Datei hoch
4. Prüfe in Supabase → uploads → status = "completed"
5. Starte einen Chat und frage nach dem hochgeladenen Inhalt

---

## Troubleshooting

### "n8n Webhook Fehler 404"

- Workflow ist nicht aktiviert
- Webhook URL ist falsch (Tippfehler?)
- n8n Server läuft nicht

### "Supabase insert/update Fehler"

- Credential ist falsch
- Tabelle existiert nicht (Schema ausführen!)
- Feld-Namen stimmen nicht

### "ElevenLabs Transkription leer"

- Datei ist beschädigt oder zu leise
- API Key ungültig
- Dateiformat nicht unterstützt

### "Qdrant Fehler"

- Collection `timax_knowledge_base` existiert nicht
- API Key falsch
- Vector-Dimension stimmt nicht (muss 768 sein für Google Embeddings)

### "User sieht fremde Daten"

- API Route filtert nicht nach `user_id`
- n8n speichert falsche `user_id`
- Qdrant-Suche hat keinen `user_id` Filter

---

## Sicherheits-Checkliste

- [ ] Supabase Service Role Key ist NICHT im Frontend
- [ ] Alle API Routes prüfen `userId` von Clerk
- [ ] n8n Webhooks sind nicht öffentlich dokumentiert
- [ ] Qdrant API Key ist nicht öffentlich
- [ ] CORS ist in Supabase konfiguriert
- [ ] Rate Limiting ist aktiviert (Vercel/Cloudflare)

---

## Fertig!

Wenn alles funktioniert, hast du:

1. **Multi-User Chat** mit AI-Assistent
2. **Audio/Video Upload** mit automatischer Transkription
3. **Wissensdatenbank** pro User (Qdrant)
4. **Vollständige User-Isolation** (jeder sieht nur seine Daten)

Bei Fragen: Check die n8n Execution History für Details!

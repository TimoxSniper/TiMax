# TiMax Supabase Setup Anleitung

## Schritt 1: Supabase einrichten

### 1.1 Supabase Projekt erstellen
1. Gehe zu https://supabase.com
2. Erstelle ein neues Projekt
3. Warte bis die Datenbank bereit ist

### 1.2 Datenbank-Schema erstellen
1. Öffne dein Supabase-Projekt
2. Gehe zu **SQL Editor**
3. Füge den Inhalt aus `supabase-schema.sql` ein
4. Klicke auf **Run**

### 1.3 API Keys kopieren
1. Gehe zu **Project Settings → API**
2. Kopiere folgende Werte:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY` (unter "Project API keys")

## Schritt 2: n8n Workflows importieren

### 2.1 Supabase Credentials in n8n erstellen
1. Öffne n8n
2. Gehe zu **Settings → Credentials**
3. Klicke auf **Add Credential**
4. Wähle **Supabase API**
5. Fülle folgende Felder aus:
   - **Host**: Deine Supabase URL (z.B. `https://abc123.supabase.co`)
   - **Service Role Secret**: Dein `SUPABASE_SERVICE_ROLE_KEY`
6. Speichere die Credentials
7. Notiere dir die **Credential ID** (z.B. `n8n-cred-12345`)

### 2.2 Chat Workflow importieren
1. In n8n: **Workflow → Import from File**
2. Wähle `n8n-workflows/chat-workflow-supabase-final.json`
3. **WICHTIG**: Aktualisiere die Supabase-Credential-ID
   - Klicke auf die "Save Message to Supabase" Node
   - Wähle deine zuvor erstellte Supabase-Credential
4. Speichere und aktiviere den Workflow

### 2.3 Upload Workflow importieren
1. In n8n: **Workflow → Import from File**
2. Wähle `n8n-workflows/upload-workflow-supabase-final.json`
3. **WICHTIG**: Aktualisiere die Supabase-Credential-ID
   - Klicke auf die "Save Upload to Supabase" Node
   - Wähle deine zuvor erstellte Supabase-Credential
4. Speichere und aktiviere den Workflow

## Schritt 3: Environment Variablen setzen

1. Kopiere `.env.local.example` zu `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fülle alle Werte in `.env.local` aus:
   - Supabase Keys (aus Schritt 1.3)
   - Clerk Keys (aus deinem Clerk Dashboard)
   - n8n Webhook URLs

## Schritt 4: Code testen

1. Starte den Dev-Server:
   ```bash
   cd my-app
   npm run dev
   ```

2. Teste Chat:
   - Erstelle einen neuen Chat
   - Schreibe eine Nachricht
   - Prüfe in Supabase: Tabelle `messages` sollte Einträge haben

3. Teste Upload:
   - Lade eine Audio-Datei hoch
   - Prüfe in Supabase: Tabelle `uploads` sollte den Eintrag haben

## Schritt 5: API Endpunkte (optional)

Falls du API-Endpunkte für Chats/Uploads brauchst, erstelle:

### GET /api/chats
Erstellt: `src/app/api/chats/route.ts`

### GET /api/chats/[id]
Erstellt: `src/app/api/chats/[id]/route.ts`

### GET /api/uploads
Erstellt: `src/app/api/uploads/route.ts`

Soll ich diese API-Endpunkte erstellen?

## Troubleshooting

### Fehler: "User ID is required"
- Prüfe ob der User eingeloggt ist
- Prüfe ob `x-user-id` Header gesetzt wird

### Fehler: "RLS Policy Violation"
- Prüfe ob RLS Policies korrekt gesetzt sind
- Verwende Service Role Key für n8n (nicht Anon Key)

### Fehler: "Cannot read property 'id' of undefined"
- Chat-ID wird nicht korrekt übergeben
- Prüfe ob `chat_id` im Request Body enthalten ist

## Wichtige Änderungen im Code

### Chat API Route
- Speichert User-Messages in Supabase
- Erstellt neue Chats wenn keine `chat_id` vorhanden
- Sendet `chat_id` an n8n für Assistant-Messages

### Upload API Route
- Erstellt Upload-Eintrag in Supabase (Status: "processing")
- n8n updated den Eintrag später auf "completed" mit Transkript

### n8n Workflows
- Chat: Speichert AI-Antworten in `messages` Tabelle
- Upload: Speichert Transkripte und Metadaten in `uploads` Tabelle

# 🌐 Website-Änderungen: Was muss geändert werden?

## 📋 Übersicht: Was wird geändert?

### ✅ NEU zu erstellen:

1. **Neue Seite: Chat-Interface**
   - Route: `/chat`
   - Datei: `my-app/src/app/chat/page.tsx`

2. **Neue Chat-Komponenten** (5 Stück):
   - `my-app/src/components/chat/chat-interface.tsx` - Haupt-Chat
   - `my-app/src/components/chat/message-bubble.tsx` - Einzelne Nachricht
   - `my-app/src/components/chat/message-list.tsx` - Liste der Nachrichten
   - `my-app/src/components/chat/chat-input.tsx` - Eingabefeld
   - `my-app/src/components/chat/chat-header.tsx` - Header

3. **Neue Upload-Komponente**:
   - `my-app/src/components/upload/file-upload.tsx` - Datei-Upload mit Drag & Drop

4. **Neue API-Routen** (2 Stück):
   - `my-app/src/app/api/chat/route.ts` - Chat-API
   - `my-app/src/app/api/upload/route.ts` - Upload-API

5. **Neue UI-Komponente** (falls nicht vorhanden):
   - `my-app/src/components/ui/progress.tsx` - Progress-Bar

### 🔄 ZU ÄNDERN:

1. **Text-Generator Seite** (`my-app/src/app/text-generator/page.tsx`)
   - Upload-Komponente hinzufügen
   - Link zum Chat-Interface hinzufügen

2. **Homepage** (`my-app/src/app/page.tsx`) - OPTIONAL
   - Link zum Chat-Interface hinzufügen (z.B. in Navigation)

3. **Umgebungsvariablen** (`.env.local`)
   - n8n Webhook URLs hinzufügen

---

## 🎯 Konkrete Änderungen im Detail

### 1. Text-Generator Seite erweitern

**Datei**: `my-app/src/app/text-generator/page.tsx`

**Was ändern:**
- Upload-Komponente oben hinzufügen
- Button/Link zum Chat-Interface hinzufügen

**Wo einfügen:**
```typescript
// Nach Zeile 13 (nach den Imports) hinzufügen:
import { FileUpload } from "@/components/upload/file-upload";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

// In der JSX, vor dem TranscriptViewer (ca. Zeile 106) hinzufügen:
<div className="space-y-6">
  {/* Upload-Bereich */}
  <FileUpload 
    onUploadSuccess={(fileName) => {
      console.log("Upload erfolgreich:", fileName);
    }}
  />
  
  {/* Link zum Chat */}
  <Button asChild className="w-full">
    <Link href="/chat">
      <MessageSquare className="w-4 h-4 mr-2" />
      Zum Chat-Interface
    </Link>
  </Button>
  
  {/* Bestehender TranscriptViewer bleibt */}
  <TranscriptViewer transcript={mockTranscript} />
</div>
```

### 2. Navigation erweitern (OPTIONAL)

**Datei**: `my-app/src/app/page.tsx`

**Was ändern:**
- Link zum Chat-Interface in der Navigation hinzufügen

**Wo einfügen:**
```typescript
// In der Hero-Section, neben "Jetzt ausprobieren" Button:
<Button 
  size="lg" 
  variant="outline"
  className="group border-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-base font-medium"
  asChild
>
  <a href="/chat">
    <MessageSquare className="mr-2 h-4 w-4" />
    Chat starten
  </a>
</Button>
```

### 3. Umgebungsvariablen hinzufügen

**Datei**: `my-app/.env.local` (neu erstellen falls nicht vorhanden)

**Was hinzufügen:**
```env
# n8n Webhook URLs
N8N_CHAT_WEBHOOK_URL=https://zapkothimofej.app.n8n.cloud/webhook/create-content
N8N_UPLOAD_WEBHOOK_URL=https://zapkothimofej.app.n8n.cloud/webhook/voice-upload

# Upload-Konfiguration
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=audio/mpeg,audio/mp4,audio/wav,audio/m4a,video/mp4,video/webm
```

**WICHTIG**: 
- Die Upload-Webhook-URL muss du aus deinem n8n Form-Trigger kopieren
- Die Chat-Webhook-URL ist bereits bekannt: `https://zapkothimofej.app.n8n.cloud/webhook/create-content`

---

## 📁 Neue Dateien - Komplette Liste

### Chat-Komponenten:
1. ✅ `my-app/src/components/chat/chat-interface.tsx`
2. ✅ `my-app/src/components/chat/message-bubble.tsx`
3. ✅ `my-app/src/components/chat/message-list.tsx`
4. ✅ `my-app/src/components/chat/chat-input.tsx`
5. ✅ `my-app/src/components/chat/chat-header.tsx`

### Upload-Komponente:
6. ✅ `my-app/src/components/upload/file-upload.tsx`

### Neue Seiten:
7. ✅ `my-app/src/app/chat/page.tsx`

### API-Routen:
8. ✅ `my-app/src/app/api/chat/route.ts`
9. ✅ `my-app/src/app/api/upload/route.ts`

### UI-Komponenten:
10. ✅ `my-app/src/components/ui/progress.tsx` (falls nicht vorhanden)

---

## 🔗 Neue Routen auf der Website

Nach der Implementierung hast du diese neuen Seiten:

1. **`/chat`** - Chat-Interface mit REX
   - Vollständiger Chat mit Message-Historie
   - Session-Management
   - Integration mit n8n Content-Generation Agent

2. **`/api/chat`** - Backend-API für Chat
   - Empfängt Chat-Nachrichten
   - Kommuniziert mit n8n Webhook
   - Gibt AI-Responses zurück

3. **`/api/upload`** - Backend-API für Uploads
   - Empfängt Datei-Uploads
   - Validiert Dateien
   - Sendet zu n8n Form-Webhook

---

## 🎨 Was der User sieht

### Vorher:
- ✅ Text-Generator Seite mit Mock-Transkript
- ✅ Format-Auswahl (Instagram, Twitter, Blog, Caption)
- ✅ Template-basierte Text-Generierung

### Nachher:
- ✅ **NEU**: Upload-Bereich auf Text-Generator Seite
- ✅ **NEU**: Button "Zum Chat-Interface"
- ✅ **NEU**: `/chat` Seite mit vollständigem Chat
- ✅ **NEU**: Datei-Upload mit Drag & Drop
- ✅ **NEU**: Echte KI-Integration über n8n
- ✅ **NEU**: Chat-Historie pro Session

---

## ⚡ Schnellstart: Was zuerst machen?

### Schritt 1: Umgebungsvariablen
```bash
cd my-app
# Erstelle .env.local falls nicht vorhanden
echo "N8N_CHAT_WEBHOOK_URL=https://zapkothimofej.app.n8n.cloud/webhook/create-content" >> .env.local
echo "N8N_UPLOAD_WEBHOOK_URL=DEINE_UPLOAD_WEBHOOK_URL" >> .env.local
```

### Schritt 2: Neue Komponenten erstellen
- Alle Chat-Komponenten (5 Dateien)
- Upload-Komponente
- Progress-Komponente (falls nicht vorhanden)

### Schritt 3: Neue Seiten erstellen
- `/chat` Seite

### Schritt 4: API-Routen erstellen
- `/api/chat` Route
- `/api/upload` Route

### Schritt 5: Bestehende Seite erweitern
- Text-Generator Seite: Upload + Chat-Link hinzufügen

### Schritt 6: Testen
```bash
npm run dev
# Öffne http://localhost:3000/chat
# Teste Chat und Upload
```

---

## 📝 Checkliste

- [ ] `.env.local` mit n8n Webhook URLs erstellen
- [ ] Chat-Komponenten erstellen (5 Dateien)
- [ ] Upload-Komponente erstellen
- [ ] Progress-Komponente erstellen (falls nicht vorhanden)
- [ ] `/chat` Seite erstellen
- [ ] `/api/chat` Route erstellen
- [ ] `/api/upload` Route erstellen
- [ ] Text-Generator Seite erweitern
- [ ] Lokal testen
- [ ] n8n Upload-Webhook URL finden und eintragen
- [ ] Deployment mit Umgebungsvariablen

---

## 🎯 Zusammenfassung

**Was wird geändert:**
- ✅ **10 neue Dateien** erstellen (Komponenten, Seiten, API-Routen)
- ✅ **1 bestehende Datei** erweitern (Text-Generator Seite)
- ✅ **1 Konfigurationsdatei** erstellen (`.env.local`)

**Was der User bekommt:**
- ✅ Chat-Interface mit KI-Integration
- ✅ Datei-Upload für Audio/Video
- ✅ Echte Content-Generierung über n8n
- ✅ Session-Management für Chats

**Zeitaufwand:**
- ~2-3 Stunden für komplette Implementierung
- ~30 Minuten für Testing

---

*Alle Code-Beispiele findest du in der `IMPLEMENTATION_GUIDE.md` Datei!*


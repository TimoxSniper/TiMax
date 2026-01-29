# 🚀 VOLLSTÄNDIGE IMPLEMENTIERUNGS-ANLEITUNG: n8n Workflow Integration

## 📋 Inhaltsverzeichnis

1. [Übersicht: Was muss gemacht werden](#übersicht)
2. [n8n Workflow - Komplette Erklärung](#n8n-workflow-erklaerung)
3. [Frontend-Änderungen - Schritt für Schritt](#frontend-aenderungen)
4. [Chat-Interface - Vollständige Implementierung](#chat-interface)
5. [Upload-Funktionalität - Datei-Upload Integration](#upload-funktionalitaet)
6. [API-Routen - Backend-Integration](#api-routen)
7. [Umgebungsvariablen - Konfiguration](#umgebungsvariablen)
8. [Testing & Deployment](#testing-deployment)

---

## 📖 Übersicht: Was muss gemacht werden

### Aktueller Stand
- ✅ Frontend: Text-Generator mit Template-basierter Generierung
- ✅ Frontend: Mock-Transkript wird verwendet
- ✅ Frontend: Format-Auswahl (Instagram, Twitter, Blog, Caption)
- ❌ **FEHLT**: Chat-Interface für KI-Dialog
- ❌ **FEHLT**: Upload-Funktionalität für Audio/Video
- ❌ **FEHLT**: Integration mit n8n Webhooks
- ❌ **FEHLT**: API-Routen für Backend-Kommunikation
- ❌ **FEHLT**: Session-Management für Chat-Historie

### Was implementiert werden muss

1. **Chat-Interface Komponente** - Vollständiger Chat mit Message-Historie
2. **Upload-Komponente** - Audio/Video Upload mit Progress-Tracking
3. **API-Routen** - Next.js API Routes für n8n-Integration
4. **Session-Management** - Chat-Sessions mit persistenter Historie
5. **Webhook-Integration** - Kommunikation mit n8n Workflows
6. **Error-Handling** - Umfassendes Fehler-Management
7. **Loading-States** - UX-optimierte Ladeanzeigen

---

## 🔄 n8n Workflow - Komplette Erklärung

### Workflow 1: Voice Upload & Processing

#### Datenfluss:
```
1. Form Upload (Webhook)
   ↓
2. ElevenLabs Speech-to-Text
   ↓
3. Format Content Metadata
   ↓
4. Extract Content Metatags (Google Gemini)
   ↓
5. Combine AI Generated Metadata
   ↓
6. Prepare Document For Storage
   ↓
7. Recursive Character Text Splitter
   ↓
8. Generate Document Embeddings
   ↓
9. Insert Into Qdrant Database
   ↓
10. Success Response
```

#### Webhook-Endpunkt:
- **URL**: Wird vom Form-Trigger generiert (dynamisch)
- **Methode**: POST (multipart/form-data)
- **Feldname**: "Audio/Video Datei"
- **Response**: JSON mit `status` und `fileName`

#### Beispiel Response:
```json
{
  "status": "✅ Erfolgreich gespeichert",
  "fileName": "mein-audio.mp3"
}
```

### Workflow 2: Content Generation Agent

#### Datenfluss:
```
1. Webhook Request (POST)
   ↓
2. Chat History Processing
   ↓
3. REX Content Generation Agent
   ├─→ Retrieve Qdrant Knowledge Tool
   ├─→ Generate Search Query Embeddings
   ├─→ Simple Memory (Session)
   └─→ Google Gemini Generation Model
   ↓
4. Format Agent Output
   ↓
5. Webhook Response
```

#### Webhook-Endpunkt:
- **URL**: `https://zapkothimofej.app.n8n.cloud/webhook/create-content`
- **Methode**: POST
- **Content-Type**: `application/json`

#### Request Body:
```json
{
  "message": "mach daraus einen linkedin post",
  "sessionId": "chat-1767038533999-sa19oxkma",
  "chatHistory": []
}
```

#### Response Body:
```json
{
  "output": "Hier ist dein LinkedIn Post:\n\n..."
}
```

#### Session-Management:
- Jede Chat-Session hat eine eindeutige `sessionId`
- Format: `chat-{timestamp}-{random}`
- Memory speichert bis zu 10000 Zeichen Context
- Historie wird pro Session gespeichert

---

## 🎨 Frontend-Änderungen - Schritt für Schritt

### Schritt 1: Neue Seitenstruktur erstellen

#### 1.1 Chat-Interface Seite
**Datei**: `my-app/src/app/chat/page.tsx`

Diese Seite wird das Haupt-Chat-Interface enthalten.

#### 1.2 Upload-Seite (optional, kann auch in Chat integriert werden)
**Datei**: `my-app/src/app/upload/page.tsx`

Oder: Upload direkt in Chat-Interface integrieren.

### Schritt 2: Chat-Interface Komponente

**Datei**: `my-app/src/components/chat/chat-interface.tsx`

Diese Komponente muss folgende Features haben:
- Message-Liste mit Scroll
- Input-Feld für Nachrichten
- Send-Button
- Loading-States während Generierung
- Error-Handling
- Session-Management
- Scroll-to-bottom bei neuen Nachrichten

### Schritt 3: Upload-Komponente

**Datei**: `my-app/src/components/upload/file-upload.tsx`

Features:
- Drag & Drop
- File-Select Button
- Progress-Bar während Upload
- File-Validation (Format, Größe)
- Success/Error-Feedback

### Schritt 4: API-Routen erstellen

**Dateien**:
- `my-app/src/app/api/chat/route.ts` - Chat-API
- `my-app/src/app/api/upload/route.ts` - Upload-API

Diese Routen kommunizieren mit n8n Webhooks.

---

## 💬 Chat-Interface - Vollständige Implementierung

### Komponenten-Struktur

```
src/components/chat/
├── chat-interface.tsx          # Haupt-Chat-Komponente
├── message-list.tsx            # Liste der Nachrichten
├── message-bubble.tsx          # Einzelne Nachricht
├── chat-input.tsx              # Input-Feld mit Send-Button
└── chat-header.tsx              # Header mit Session-Info
```

### 1. Chat-Interface Hauptkomponente

**Datei**: `my-app/src/components/chat/chat-interface.tsx`

**Features**:
- State-Management für Messages
- Session-ID Generation
- API-Calls zu `/api/chat`
- Auto-Scroll
- Loading-States
- Error-Handling

### 2. Message-Bubble Komponente

**Datei**: `my-app/src/components/chat/message-bubble.tsx`

**Features**:
- User vs. AI Messages (unterschiedliche Styles)
- Timestamp
- Copy-Button für AI-Messages
- Markdown-Rendering (optional)

### 3. Chat-Input Komponente

**Datei**: `my-app/src/components/chat/chat-input.tsx`

**Features**:
- Text-Input mit Auto-Resize
- Send-Button (Enter-Taste)
- Disabled während Loading
- Character-Count (optional)

---

## 📤 Upload-Funktionalität - Datei-Upload Integration

### Upload-Komponente

**Datei**: `my-app/src/components/upload/file-upload.tsx`

**Features**:
- Drag & Drop Zone
- File-Select Button
- File-Validation:
  - Erlaubte Formate: `.mp3`, `.mp4`, `.wav`, `.m4a`, `.webm`
  - Max. Größe: 100MB (anpassbar)
- Progress-Bar
- Upload zu n8n Form-Webhook
- Success/Error-Feedback

### Upload-Flow:

1. User wählt Datei oder zieht sie in Drop-Zone
2. Validierung (Format, Größe)
3. Upload zu n8n Form-Webhook (multipart/form-data)
4. Progress-Tracking
5. Success: Datei wird transkribiert und gespeichert
6. Error: Fehlermeldung anzeigen

---

## 🔌 API-Routen - Backend-Integration

### 1. Chat API Route

**Datei**: `my-app/src/app/api/chat/route.ts`

**Funktion**: 
- Empfängt Chat-Nachrichten vom Frontend
- Sendet Request an n8n Webhook
- Gibt Response zurück

**Request**:
```typescript
POST /api/chat
Body: {
  message: string;
  sessionId: string;
  chatHistory?: Array<{role: 'user' | 'assistant', content: string}>;
}
```

**Response**:
```typescript
{
  success: boolean;
  output?: string;
  error?: string;
}
```

### 2. Upload API Route

**Datei**: `my-app/src/app/api/upload/route.ts`

**Funktion**:
- Empfängt Datei-Upload
- Validiert Datei
- Sendet zu n8n Form-Webhook
- Gibt Status zurück

**Request**:
```typescript
POST /api/upload
Body: FormData mit 'file' field
```

**Response**:
```typescript
{
  success: boolean;
  status?: string;
  fileName?: string;
  error?: string;
}
```

### 3. Session API Route (optional)

**Datei**: `my-app/src/app/api/session/route.ts`

**Funktion**:
- Erstellt neue Session
- Lädt Session-Historie
- Speichert Session-Daten (localStorage oder Backend)

---

## ⚙️ Umgebungsvariablen - Konfiguration

### .env.local Datei

**Datei**: `my-app/.env.local`

```env
# n8n Webhook URLs
N8N_CHAT_WEBHOOK_URL=https://zapkothimofej.app.n8n.cloud/webhook/create-content
N8N_UPLOAD_WEBHOOK_URL=https://zapkothimofej.app.n8n.cloud/webhook/voice-upload

# Optional: n8n API für Workflow-Management
N8N_API_URL=https://zapkothimofej.app.n8n.cloud
N8N_API_KEY=dein_api_key_hier

# Upload-Konfiguration
MAX_FILE_SIZE=104857600  # 100MB in Bytes
ALLOWED_FILE_TYPES=audio/mpeg,audio/mp4,audio/wav,audio/m4a,video/mp4,video/webm

# Session-Konfiguration
SESSION_STORAGE_KEY=rex_chat_sessions
```

---

## 📝 Detaillierte Code-Implementierung

### 1. Chat-Interface Komponente

**Vollständiger Code**:

```typescript
// my-app/src/components/chat/chat-interface.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialSessionId?: string;
}

export function ChatInterface({ initialSessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(initialSessionId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session-ID generieren falls nicht vorhanden
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Auto-Scroll zu letzter Nachricht
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.trim(),
          sessionId,
          chatHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler bei der Chat-Anfrage");
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.output || "Keine Antwort erhalten",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(errorMessage);
      console.error("Chat-Fehler:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <ChatHeader sessionId={sessionId} messageCount={messages.length} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Willkommen bei REX!</p>
            <p className="text-sm">
              Stelle Fragen oder bitte um Content-Generierung.
              <br />
              Beispiel: "Erstelle einen LinkedIn Post über Produktivität"
            </p>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">REX denkt nach...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </Card>
  );
}
```

### 2. Message-Bubble Komponente

```typescript
// my-app/src/components/chat/message-bubble.tsx
"use client";

import { Message } from "./chat-interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Bot } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopieren fehlgeschlagen:", err);
    }
  };

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <Card
        className={`max-w-[80%] ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <div className="p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-xs opacity-70">
              {message.timestamp.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 opacity-70 hover:opacity-100"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}
```

### 3. Message-List Komponente

```typescript
// my-app/src/components/chat/message-list.tsx
"use client";

import { Message } from "./chat-interface";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
```

### 4. Chat-Input Komponente

```typescript
// my-app/src/components/chat/chat-input.tsx
"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht eingeben... (Enter zum Senden)"
          disabled={disabled}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
```

### 5. Chat-Header Komponente

```typescript
// my-app/src/components/chat/chat-header.tsx
"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  sessionId: string;
  messageCount: number;
}

export function ChatHeader({ sessionId, messageCount }: ChatHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">REX Content Assistant</CardTitle>
          <CardDescription className="text-xs">
            {messageCount > 0
              ? `${messageCount} Nachrichten in dieser Session`
              : "Neue Chat-Session"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
```

### 6. Chat-Seite

```typescript
// my-app/src/app/chat/page.tsx
"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">REX Chat</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
```

### 7. Chat API Route

```typescript
// my-app/src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL;

if (!N8N_CHAT_WEBHOOK_URL) {
  console.warn("WARNUNG: N8N_CHAT_WEBHOOK_URL nicht gesetzt!");
}

export async function POST(request: NextRequest) {
  try {
    if (!N8N_CHAT_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, error: "Chat-Webhook nicht konfiguriert" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, sessionId, chatHistory = [] } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: "message und sessionId sind erforderlich" },
        { status: 400 }
      );
    }

    // Request an n8n Webhook senden
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: {
          message,
          sessionId,
          chatHistory,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Webhook Fehler: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // n8n gibt die Antwort in verschiedenen Formaten zurück
    // Wir müssen die Struktur anpassen
    let output = "";
    
    if (typeof data === "string") {
      output = data;
    } else if (data.output) {
      output = data.output;
    } else if (data.body?.output) {
      output = data.body.output;
    } else if (Array.isArray(data) && data[0]?.json?.output) {
      output = data[0].json.output;
    } else {
      // Fallback: JSON stringify
      output = JSON.stringify(data);
    }

    return NextResponse.json({
      success: true,
      output,
    });
  } catch (error) {
    console.error("Chat API Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler bei der Chat-Anfrage",
      },
      { status: 500 }
    );
  }
}
```

### 8. File-Upload Komponente

```typescript
// my-app/src/components/upload/file-upload.tsx
"use client";

import { useState, useRef, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Falls vorhanden, sonst selbst bauen

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/m4a",
  "video/mp4",
  "video/webm",
];

interface FileUploadProps {
  onUploadSuccess?: (fileName: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Datei ist zu groß. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Dateityp nicht unterstützt. Erlaubt: MP3, MP4, WAV, M4A, WebM";
    }
    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      onUploadError?.(validationError);
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Simuliere Progress (da fetch keine Progress-Events hat)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload fehlgeschlagen");
      }

      setSuccess(true);
      onUploadSuccess?.(data.fileName || file.name);
      
      // Reset nach 3 Sekunden
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setProgress(0);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unbekannter Upload-Fehler";
      setError(errorMessage);
      onUploadError?.(errorMessage);
      console.error("Upload-Fehler:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
        >
          {!file ? (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">
                Datei hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Unterstützt: MP3, MP4, WAV, M4A, WebM (max. 100MB)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Datei auswählen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    handleFileSelect(selectedFile);
                  }
                }}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : error ? (
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress}% hochgeladen...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm">
                  ✅ Datei erfolgreich hochgeladen und wird verarbeitet!
                </div>
              )}

              {!isUploading && !success && (
                <Button onClick={handleUpload} className="w-full">
                  Hochladen
                </Button>
              )}

              {isUploading && (
                <Button disabled className="w-full">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird hochgeladen...
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 9. Upload API Route

```typescript
// my-app/src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

const N8N_UPLOAD_WEBHOOK_URL = process.env.N8N_UPLOAD_WEBHOOK_URL;

if (!N8N_UPLOAD_WEBHOOK_URL) {
  console.warn("WARNUNG: N8N_UPLOAD_WEBHOOK_URL nicht gesetzt!");
}

export async function POST(request: NextRequest) {
  try {
    if (!N8N_UPLOAD_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, error: "Upload-Webhook nicht konfiguriert" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Keine Datei bereitgestellt" },
        { status: 400 }
      );
    }

    // Erstelle neue FormData für n8n
    const n8nFormData = new FormData();
    n8nFormData.append("Audio/Video Datei", file);

    // Upload zu n8n Form-Webhook
    const response = await fetch(N8N_UPLOAD_WEBHOOK_URL, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Upload Fehler: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // n8n Response-Struktur anpassen
    let status = "✅ Erfolgreich gespeichert";
    let fileName = file.name;

    if (data.status) {
      status = data.status;
    } else if (Array.isArray(data) && data[0]?.json?.status) {
      status = data[0].json.status;
    }

    if (data.fileName) {
      fileName = data.fileName;
    } else if (Array.isArray(data) && data[0]?.json?.fileName) {
      fileName = data[0].json.fileName;
    }

    return NextResponse.json({
      success: true,
      status,
      fileName,
    });
  } catch (error) {
    console.error("Upload API Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler beim Upload",
      },
      { status: 500 }
    );
  }
}
```

### 10. Progress Komponente (falls nicht vorhanden)

```typescript
// my-app/src/components/ui/progress.tsx
"use client";

import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={`w-full bg-muted rounded-full overflow-hidden ${className || ""}`}
    >
      <div
        className="h-2 bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
```

---

## 🔗 Integration in bestehende Seiten

### Text-Generator Seite erweitern

**Datei**: `my-app/src/app/text-generator/page.tsx`

**Änderungen**:
- Upload-Komponente hinzufügen
- Link zu Chat-Interface
- Optional: Chat direkt integrieren

```typescript
// Am Anfang der Seite hinzufügen:
import { FileUpload } from "@/components/upload/file-upload";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

// In der JSX:
<div className="mb-6">
  <FileUpload 
    onUploadSuccess={(fileName) => {
      // Optional: Toast oder Notification
      console.log("Upload erfolgreich:", fileName);
    }}
  />
</div>

<Button asChild className="mb-6">
  <Link href="/chat">
    <MessageSquare className="w-4 h-4 mr-2" />
    Zum Chat-Interface
  </Link>
</Button>
```

---

## 🧪 Testing & Deployment

### Lokales Testing

1. **Umgebungsvariablen setzen**:
   ```bash
   cd my-app
   cp .env.example .env.local
   # Bearbeite .env.local mit deinen n8n Webhook URLs
   ```

2. **Development Server starten**:
   ```bash
   npm run dev
   ```

3. **Testen**:
   - Chat-Interface: `http://localhost:3000/chat`
   - Upload: Datei hochladen und Response prüfen
   - API-Routen: Mit Postman oder curl testen

### Deployment-Checkliste

- [ ] Umgebungsvariablen in Vercel/Deployment-Plattform setzen
- [ ] n8n Webhook URLs sind korrekt
- [ ] CORS-Einstellungen in n8n prüfen (falls nötig)
- [ ] File-Upload Limits prüfen
- [ ] Error-Logging implementieren
- [ ] Analytics/Tracking hinzufügen (optional)

---

## 🐛 Troubleshooting

### Häufige Probleme

1. **Webhook gibt 404**:
   - Prüfe n8n Webhook URL
   - Stelle sicher, dass Workflow aktiv ist
   - Prüfe Webhook-Path in n8n

2. **CORS-Fehler**:
   - n8n muss CORS für deine Domain erlauben
   - Prüfe n8n CORS-Einstellungen

3. **Upload schlägt fehl**:
   - Prüfe Dateigröße (max. 100MB)
   - Prüfe Dateityp
   - Prüfe n8n Form-Webhook Konfiguration

4. **Chat gibt keine Antwort**:
   - Prüfe n8n Chat-Webhook
   - Prüfe Request-Body Format
   - Prüfe n8n Workflow Logs

5. **Session wird nicht gespeichert**:
   - Session-ID wird im Frontend generiert
   - Optional: Backend-Session-Speicherung implementieren

---

## 📚 Zusätzliche Features (Optional)

### 1. Session-Persistenz
- LocalStorage für Chat-Historie
- Backend-Session-Speicherung
- Session-Wiederherstellung

### 2. Markdown-Rendering
- Markdown in AI-Responses rendern
- Code-Blocks formatieren
- Links klickbar machen

### 3. Voice-Input
- Browser Speech-to-Text API
- Mikrofon-Button im Chat-Input

### 4. Export-Funktionen
- Chat als PDF exportieren
- Generierter Content direkt zu Plattformen posten

### 5. Analytics
- Nachrichten-Tracking
- Upload-Statistiken
- Usage-Analytics

---

## ✅ Zusammenfassung der zu erstellenden Dateien

### Neue Dateien:

1. `my-app/src/components/chat/chat-interface.tsx`
2. `my-app/src/components/chat/message-bubble.tsx`
3. `my-app/src/components/chat/message-list.tsx`
4. `my-app/src/components/chat/chat-input.tsx`
5. `my-app/src/components/chat/chat-header.tsx`
6. `my-app/src/components/upload/file-upload.tsx`
7. `my-app/src/components/ui/progress.tsx` (falls nicht vorhanden)
8. `my-app/src/app/chat/page.tsx`
9. `my-app/src/app/api/chat/route.ts`
10. `my-app/src/app/api/upload/route.ts`

### Zu ändernde Dateien:

1. `my-app/src/app/text-generator/page.tsx` - Upload-Komponente hinzufügen
2. `my-app/.env.local` - Umgebungsvariablen hinzufügen
3. `my-app/package.json` - Zusätzliche Dependencies (falls nötig)

---

## 🎯 Nächste Schritte

1. **Erstelle alle Komponenten** in der oben genannten Reihenfolge
2. **Teste lokal** mit deinen n8n Webhook URLs
3. **Passe an** falls n8n Response-Format anders ist
4. **Deploy** und teste in Production
5. **Iteriere** basierend auf User-Feedback

---

*Diese Anleitung ist vollständig und enthält alle notwendigen Code-Beispiele für die komplette Integration des n8n Workflows in dein Frontend.*


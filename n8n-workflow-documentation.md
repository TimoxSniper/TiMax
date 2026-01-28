# REX n8n Workflow Dokumentation

## Übersicht

Dieser n8n Workflow implementiert das Backend für das REX Content-Generierungs-System. Er besteht aus zwei Haupt-Workflows:

1. **Voice Upload & Processing Pipeline** - Verarbeitet Audio/Video-Uploads
2. **Content Generation Agent** - Generiert Content basierend auf Benutzeranfragen

---

## Workflow 1: Voice Upload & Processing

### Ziel
Transkribiert Audio/Video-Dateien, extrahiert Metadaten und speichert sie in einer Vector-Datenbank (Qdrant) für spätere Content-Generierung.

### Workflow-Ablauf

#### 1. REX Voice Upload Trigger
- **Typ**: `n8n-nodes-base.formTrigger`
- **Funktion**: Empfängt Audio/Video-Dateien über ein Web-Formular
- **Konfiguration**:
  - Form-Titel: "REX - Voice Upload"
  - Beschreibung: "Lade deine Voice Messages hoch. Sie werden transkribiert und in der Wissensdatenbank gespeichert."
  - Feld: "Audio/Video Datei" (File-Upload, erforderlich)
  - Response Mode: `lastNode`

#### 2. ElevenLabs Speech To Text
- **Typ**: `@elevenlabs/n8n-nodes-elevenlabs.elevenLabs`
- **Funktion**: Transkribiert die hochgeladene Audio/Video-Datei zu Text
- **Operation**: `speechToText`
- **Input**: Datei vom Form-Trigger

#### 3. Format Content Metadata
- **Typ**: `n8n-nodes-base.set`
- **Funktion**: Strukturiert die Metadaten für die weitere Verarbeitung
- **Erstellt**:
  - `content`: Transkribierter Text
  - `fileName`: Original-Dateiname
  - `uploadedAt`: ISO-Timestamp des Uploads

#### 4. Extract Content Metatags
- **Typ**: `@n8n/n8n-nodes-langchain.chainLlm`
- **Funktion**: Extrahiert strukturierte Metadaten aus dem transkribierten Inhalt
- **LLM**: Google Gemini 2.0 Flash Experimental
- **Prompt**: Analysiert den Inhalt und extrahiert:
  - `topics`: Array von Tags/Themen
  - `intention`: Kategorie (bildung|motivation|argumentation|beispiel|geschichte)
  - `platform_suitability`: Array von passenden Plattformen (reel_hook, linkedin_post, twitter_thread)
  - `tone`: Tonalität (enthusiastisch|kritisch|sachlich|inspirierend)
  - `content_quality`: Bewertung 1-10
  - `key_quotes`: Array von wichtigen Zitaten

#### 5. Combine AI Generated Metadata
- **Typ**: `n8n-nodes-base.code`
- **Funktion**: Kombiniert die formatierten Metadaten mit den AI-generierten Tags
- **JavaScript-Logik**: 
  - Parst die JSON-Antwort vom LLM
  - Fallback auf Standardwerte bei Parsing-Fehlern
  - Kombiniert alle Metadaten in einem Objekt

#### 6. Prepare Document For Storage
- **Typ**: `@n8n/n8n-nodes-langchain.documentDefaultDataLoader`
- **Funktion**: Bereitet das Dokument für die Vector-Datenbank vor
- **Konfiguration**:
  - Text-Splitting: Custom Mode
  - Metadaten werden als Dokument-Metadaten hinzugefügt

#### 7. Recursive Character Text Splitter
- **Typ**: `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter`
- **Funktion**: Teilt den Text in Chunks für bessere Vector-Suche
- **Chunk Overlap**: 200 Zeichen

#### 8. Generate Document Embeddings
- **Typ**: `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini`
- **Funktion**: Generiert Embeddings für die Text-Chunks
- **Verwendung**: Google Gemini Embeddings

#### 9. Insert Into Qdrant Database
- **Typ**: `@n8n/n8n-nodes-langchain.vectorStoreQdrant`
- **Funktion**: Speichert die Dokumente mit Embeddings in Qdrant
- **Collection**: `rex_knowledge_base`
- **Mode**: `insert`

#### 10. Set Success Status Response
- **Typ**: `n8n-nodes-base.set`
- **Funktion**: Erstellt eine Erfolgsantwort für das Formular
- **Response**:
  - `status`: "✅ Erfolgreich gespeichert"
  - `fileName`: Name der hochgeladenen Datei

---

## Workflow 2: Content Generation Agent

### Ziel
Generiert plattform-spezifische Content-Varianten basierend auf Benutzeranfragen und dem gespeicherten Wissen in der Qdrant-Datenbank.

### Workflow-Ablauf

#### 1. Receive Content Creation Request
- **Typ**: `n8n-nodes-base.webhook`
- **Funktion**: Empfängt POST-Requests für Content-Generierung
- **Path**: `/6f6f73a9-6f3a-49dc-b344-c043513aec88`
- **Response Mode**: `responseNode`
- **Erwartete Payload**:
  ```json
  {
    "body": {
      "message": "mach daraus einen linkedin post",
      "sessionId": "chat-1767038533999-sa19oxkma",
      "chatHistory": []
    }
  }
  ```

#### 2. Code in JavaScript (Chat History Processing)
- **Typ**: `n8n-nodes-base.code`
- **Funktion**: Verarbeitet die Chat-Historie und extrahiert die aktuelle Nachricht
- **Output**:
  - `currentMessage`: Die aktuelle Benutzeranfrage
  - `chatHistory`: Formatierte Chat-Historie

#### 3. REX Content Generation Agent
- **Typ**: `@n8n/n8n-nodes-langchain.agent`
- **Funktion**: Haupt-Agent für Content-Generierung
- **LLM**: Google Gemini Generation Model
- **System Prompt**: Umfangreicher Prompt, der den Agent als REX definiert:
  - Zugriff auf angereicherte Wissensdatenbank
  - Plattform-spezifische Content-Erstellung
  - Mehrere Stil-Varianten (Formal, Persönlich, Provokativ)
  - Berücksichtigung der Chat-Historie
  - Metadaten-basierte Suche

#### 4. Retrieve Qdrant Knowledge Tool
- **Typ**: `@n8n/n8n-nodes-langchain.vectorStoreQdrant`
- **Funktion**: Tool für den Agent zum Durchsuchen der Wissensdatenbank
- **Mode**: `retrieve-as-tool`
- **Collection**: `rex_knowledge_base`
- **Top K**: 8 (8 relevanteste Chunks)
- **Tool Description**: Beschreibt die Fähigkeit, die Wissensdatenbank mit Metadaten zu durchsuchen

#### 5. Generate Search Query Embeddings
- **Typ**: `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini`
- **Funktion**: Generiert Embeddings für Suchanfragen
- **Verwendung**: Für die Vector-Suche in Qdrant

#### 6. Simple Memory
- **Typ**: `@n8n/n8n-nodes-langchain.memoryBufferWindow`
- **Funktion**: Speichert den Chat-Verlauf für die Session
- **Session Key**: Aus `sessionId` im Request
- **Context Window**: 10000 Zeichen

#### 7. Google Gemini Generation Model
- **Typ**: `@n8n/n8n-nodes-langchain.lmChatGoogleGemini`
- **Funktion**: LLM für die Content-Generierung
- **Credentials**: Google Gemini API

#### 8. Format Agent Output With Fallback
- **Typ**: `n8n-nodes-base.code`
- **Funktion**: Formatiert die Agent-Ausgabe mit umfassendem Fallback-Handling
- **JavaScript-Logik**: 
  - Extrahiert Output aus verschiedenen möglichen Feldern
  - Fallback auf JSON-Stringify bei unerwarteten Formaten
  - Fehlerbehandlung für leere Antworten

#### 9. Send Generated Content Response
- **Typ**: `n8n-nodes-base.respondToWebhook`
- **Funktion**: Sendet die generierte Antwort zurück an den Client
- **Mode**: `allIncomingItems`

---

## Technische Details

### Verwendete Services & APIs

1. **ElevenLabs**
   - Speech-to-Text API
   - Credentials: `e6MMDFDQ1dbDxpvE`

2. **Google Gemini**
   - Tagging Model: `models/gemini-2.0-flash-exp`
   - Generation Model: Standard Gemini
   - Embeddings: Google Gemini Embeddings
   - Credentials: `BWPxLiVPTdHxDSZp`

3. **Qdrant**
   - Vector Database
   - Collection: `rex_knowledge_base`
   - Credentials: `A1Vpk1rA51dSounY`

### Datenfluss

#### Upload-Pipeline:
```
Form Upload → Speech-to-Text → Metadata Formatting → AI Tagging → 
Document Preparation → Text Splitting → Embedding Generation → 
Qdrant Storage → Success Response
```

#### Content Generation:
```
Webhook Request → Chat History Processing → Agent (mit Tools & Memory) → 
Output Formatting → Webhook Response
```

### Metadaten-Struktur

Jedes gespeicherte Dokument enthält:
- `content`: Der transkribierte Text
- `fileName`: Original-Dateiname
- `uploadedAt`: ISO-Timestamp
- `topics`: Array von Themen/Tags
- `intention`: Kategorie
- `platform_suitability`: Array von passenden Plattformen
- `tone`: Tonalität
- `content_quality`: Bewertung 1-10
- `key_quotes`: Array von wichtigen Zitaten

---

## Integration mit Frontend

### Webhook-Endpunkte

1. **Upload-Form**: 
   - URL: Wird vom Form-Trigger generiert
   - Methode: POST (multipart/form-data)
   - Response: JSON mit Status und Dateiname

2. **Content Generation**:
   - URL: `https://zapkothimofej.app.n8n.cloud/webhook/create-content`
   - Methode: POST
   - Body:
     ```json
     {
       "message": "mach daraus einen linkedin post",
       "sessionId": "chat-1767038533999-sa19oxkma",
       "chatHistory": []
     }
     ```
   - Response: JSON mit generiertem Content

### Session-Management

- Jede Chat-Session hat eine eindeutige `sessionId`
- Der Memory-Node speichert den Chat-Verlauf pro Session
- Context Window: 10000 Zeichen pro Session

---

## Erweiterungsmöglichkeiten

1. **Fehlerbehandlung**: Erweiterte Error-Handling-Nodes für beide Workflows
2. **Webhooks für Status-Updates**: Real-time Updates während der Verarbeitung
3. **Batch-Processing**: Unterstützung für mehrere Dateien gleichzeitig
4. **Content-Varianten**: Automatische Generierung mehrerer Varianten
5. **Export-Funktionen**: Direkter Export zu verschiedenen Plattformen
6. **Analytics**: Tracking von generiertem Content und Nutzung

---

## Troubleshooting

### Häufige Probleme

1. **Transkription schlägt fehl**:
   - Prüfe ElevenLabs API-Key und Quota
   - Validiere Dateiformat (unterstützte Formate prüfen)

2. **Metadaten-Extraktion liefert ungültiges JSON**:
   - Der "Combine AI Generated Metadata" Node hat Fallback-Logik
   - Prüfe LLM-Output für Formatierungsprobleme

3. **Qdrant-Speicherung schlägt fehl**:
   - Prüfe Qdrant-Verbindung und Collection-Name
   - Validiere Embedding-Dimensionen

4. **Content-Generierung liefert leere Antworten**:
   - Prüfe Agent-Prompt und System-Message
   - Validiere Tool-Verbindungen (Qdrant Tool)
   - Prüfe Memory-Node Konfiguration

---

## Workflow-Status

- ✅ Voice Upload & Processing: Implementiert
- ✅ Content Generation Agent: Implementiert
- ✅ Metadaten-Extraktion: Implementiert
- ✅ Vector-Speicherung: Implementiert
- ✅ Chat-Historie: Implementiert

---

*Letzte Aktualisierung: 2025-12-29*


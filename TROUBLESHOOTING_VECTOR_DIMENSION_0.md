# Troubleshooting: Vector Dimension 0 Problem

## Problem-Beschreibung

Beim Upload mit Gemini Embeddings `text-embedding-004` wird die Vector Dimension als **0 statt 768** angezeigt.

## Sofort-Diagnose (5 Minuten)

### Schritt 1: Pinecone Index Dimension prüfen

**Via Pinecone Console:**

1. Gehe zu https://app.pinecone.io
2. Öffne Index `timax-knowledge`
3. Prüfe "Dimensions" in Index Details

**Via Pinecone CLI:**

```bash
pinecone index describe timax-knowledge
```

**Erwartete Ausgabe:**

```json
{
  "name": "timax-knowledge",
  "dimension": 768, // ← MUSS 768 sein für text-embedding-004
  "metric": "cosine",
  "status": "Ready"
}
```

**❌ Problem gefunden wenn:**

- `dimension: 1536` (OpenAI Embeddings)
- `dimension: 3072` (Gemini embedding-001)
- `dimension: 384` (sentence-transformers)
- Jede andere Zahl außer 768

**✅ Lösung:** Index neu erstellen (siehe unten)

---

### Schritt 2: Gemini API Key testen

**Test-Request:**

```bash
export GEMINI_API_KEY="your-api-key-here"

curl -s "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -d '{
    "model": "models/text-embedding-004",
    "content": {
      "parts": [{
        "text": "Das ist ein Test"
      }]
    }
  }' | python3 -m json.tool
```

**✅ Erfolgreich wenn:**

```json
{
  "embedding": {
    "values": [0.123, -0.456, 0.789, ...]  // 768 Werte
  }
}
```

**❌ Fehler wenn:**

```json
{
  "error": {
    "code": 403,
    "message": "API key not valid"
  }
}
```

→ **Lösung:** API Key in n8n Credentials aktualisieren

```json
{
  "error": {
    "code": 429,
    "message": "Quota exceeded"
  }
}
```

→ **Lösung:** Rate Limiting aktiv, warten oder Quota erhöhen

---

### Schritt 3: n8n Workflow Execution Log prüfen

**In n8n:**

1. Öffne Workflow `upload-workflow-CHUNKING-FIXED`
2. Gehe zu "Executions" (oben rechts)
3. Öffne letzte fehlgeschlagene Execution
4. Prüfe Node "Insert Pinecone" → Error Message

**Typische Fehler:**

**Fehler 1: Dimension Mismatch**

```
Error: Vector dimension 0 does not match the dimension of the index 768
```

→ **Ursache:** Embeddings kommen mit Dimension 0 bei Pinecone an
→ **Lösung:** Validation Node einfügen (siehe unten)

**Fehler 2: API Error**

```
Error: Failed to generate embeddings: 403 Forbidden
```

→ **Ursache:** API Key ungültig oder Model nicht verfügbar
→ **Lösung:** Credentials prüfen

**Fehler 3: Empty Documents**

```
Error: Cannot insert empty documents
```

→ **Ursache:** Document Loader oder Text Splitter gibt keine Daten weiter
→ **Lösung:** Transcript prüfen, Chunking-Einstellungen validieren

---

## Detaillierte Fehlerbehebung

### Fix 1: Pinecone Index neu erstellen (Empfohlen bei Dimension-Mismatch)

**⚠️ WARNUNG:** Dies löscht alle bestehenden Vektoren im Index!

**Backup erstellen (optional):**

```bash
# Export aller Vektoren (falls möglich)
pinecone index export timax-knowledge --output backup.json
```

**Index löschen:**

```bash
pinecone index delete timax-knowledge
```

**Neuen Index erstellen (768 Dimensionen für text-embedding-004):**

```bash
pinecone index create \
  --name timax-knowledge \
  --dimension 768 \
  --metric cosine \
  --spec serverless \
  --cloud aws \
  --region us-east-1
```

**Warte bis Index bereit ist:**

```bash
watch -n 5 'pinecone index describe timax-knowledge'
# Warte bis Status = "Ready"
```

---

### Fix 2: Validation Node einfügen (Debugging)

**Zweck:** Embeddings validieren BEVOR sie zu Pinecone gesendet werden

**Datei:** `D:\Timax\n8n-workflows\embedding-validation-node.json`

**Installation in n8n:**

1. Öffne Workflow: `upload-workflow-CHUNKING-FIXED`
2. Füge neuen **Code Node** ein (zwischen "Embeddings" und "Insert Pinecone")
3. Name: `Validate Embeddings`
4. Code: Siehe `embedding-validation-node.json`
5. **Wichtig:** Verbindungen anpassen:
   - **ALT:** `Embeddings` → `Insert Pinecone` (ai_embedding)
   - **NEU:** `Embeddings` → `Validate Embeddings` → `Insert Pinecone`

**Workflow-Struktur (neu):**

```
Embeddings Node
    ↓ (ai_embedding)
Validate Embeddings Node  ← NEU
    ↓ (ai_embedding)
Insert Pinecone Node
```

**Test durchführen:**

1. Speichere Workflow
2. Führe Test-Upload aus
3. Prüfe Execution Logs von "Validate Embeddings" Node

**Erwartete Console-Ausgabe (Erfolg):**

```
=== EMBEDDING VALIDATION START ===
Anzahl Items: 12
Erwartete Dimension: 768

--- Item 1/12 ---
✓ Embedding gefunden in: item.json.embedding
Dimension: 768
Erste 5 Werte: [0.0234, -0.1567, 0.0892, -0.0445, 0.1123]
Letzte 5 Werte: [0.0667, -0.0234, 0.0891, 0.1234, -0.0556]
Mittelwert: 0.000123
Magnitude: 1.000456
✅ Validation erfolgreich

...

=== VALIDATION SUMMARY ===
Erfolgreich validiert: 12/12
Fehler: 0
✅ ALLE EMBEDDINGS VALIDIERT
```

**Bei Fehler "Dimension 0":**

```
--- Item 1/12 ---
Dimension: 0
❌ KRITISCHER FEHLER: Embedding hat Dimension 0!
```

→ **Nächster Schritt:** API Debug (Fix 3)

---

### Fix 3: Gemini API Request debuggen

**Debug Node VOR Embeddings Node einfügen:**

```javascript
// Code Node: "Debug Text Before Embeddings"
const items = $input.all();

for (const item of items) {
  const text = item.json.text || item.json.pageContent || "";

  console.log("=== TEXT DEBUG ===");
  console.log("Text Länge:", text.length);
  console.log("Text (erste 200 Zeichen):", text.substring(0, 200));
  console.log("Text leer?:", text.trim().length === 0);

  if (text.trim().length === 0) {
    throw new Error(
      "❌ Text ist leer! Embeddings können nicht generiert werden.",
    );
  }

  if (text.length > 10000) {
    console.log("⚠️ Text sehr lang, könnte API Limit überschreiten");
  }
}

return items;
```

**Platzierung:**

```
Document Loader
    ↓
Text Splitter
    ↓
Debug Text Before Embeddings  ← NEU
    ↓
Embeddings
```

---

### Fix 4: Upgrade zu gemini-embedding-001 (Zukunftssicher)

**Problem:** `text-embedding-004` ist seit 14.01.2026 deprecated

**Lösung:** Upgrade zu neuem Modell `gemini-embedding-001`

**Datei:** `n8n-workflows/upload-workflow-CHUNKING-FIXED.json`

**Änderung Zeile 275:**

```json
// VORHER
"parameters": {
  "model": "text-embedding-004"
}

// NACHHER
"parameters": {
  "model": "gemini-embedding-001"
}
```

**⚠️ WICHTIG:** Pinecone Index muss mit **3072 Dimensionen** neu erstellt werden!

```bash
pinecone index delete timax-knowledge
pinecone index create \
  --name timax-knowledge \
  --dimension 3072 \
  --metric cosine \
  --spec serverless
```

**Validation Node anpassen (Zeile 17):**

```javascript
// const EXPECTED_DIMENSION = 768;  // alt
const EXPECTED_DIMENSION = 3072; // neu
```

---

### Fix 5: Community Node mit Dimensions-Kontrolle (Alternative)

**Problem:** Standard n8n Node hat keine `outputDimensionality` Parameter

**Lösung:** Community Node `n8n-nodes-gemini-embedding-plus` installieren

**Installation:**

```bash
# In n8n Docker Container oder Server
cd ~/.n8n/nodes
npm install n8n-nodes-gemini-embedding-plus
```

**Oder via n8n Community Nodes UI:**

1. Settings → Community Nodes
2. Suche: `n8n-nodes-gemini-embedding-plus`
3. Install

**Node in Workflow ersetzen:**

```json
{
  "type": "n8n-nodes-gemini-embedding-plus.embeddingsGoogleGemini",
  "parameters": {
    "model": "text-embedding-004",
    "outputDimensionality": 768, // ← Explizit setzen
    "taskType": "RETRIEVAL_DOCUMENT"
  }
}
```

---

## Checkliste zur Fehlerbehebung

- [ ] **Pinecone Index Dimension = 768** (für text-embedding-004)
- [ ] **Gemini API Key funktioniert** (Test-Request erfolgreich)
- [ ] **Validation Node zeigt Dimension > 0** (nicht nur Nullen)
- [ ] **Text Splitter gibt Chunks weiter** (nicht leer)
- [ ] **Document Loader hat validen Text** (nicht null/undefined)
- [ ] **n8n Credentials korrekt konfiguriert** (googlePalmApi)
- [ ] **Workflow-Verbindungen korrekt** (ai_embedding connections)
- [ ] **Rate Limits nicht überschritten** (Gemini API Quota)

---

## Monitoring-Setup (Produktiv-Umgebung)

### 1. Error Alerts in n8n

**Webhook für Fehler-Benachrichtigungen:**

```json
{
  "nodes": [
    {
      "name": "Error Notification",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "error-alert"
      }
    }
  ]
}
```

**In jedem Workflow:**

- Error Output von "Insert Pinecone" Node verbinden
- Bei Fehler: POST zu Error Webhook mit Details

### 2. Pinecone Index Stats überwachen

**Täglicher Check (Cron Job):**

```bash
#!/bin/bash
# pinecone-health-check.sh

STATS=$(pinecone index describe timax-knowledge --format json)
DIMENSION=$(echo $STATS | jq -r '.dimension')
VECTOR_COUNT=$(echo $STATS | jq -r '.vectorCount')

echo "Pinecone Health Check - $(date)"
echo "Dimension: $DIMENSION (Expected: 768)"
echo "Vector Count: $VECTOR_COUNT"

if [ "$DIMENSION" != "768" ]; then
  echo "❌ ERROR: Dimension mismatch!"
  # Send alert
fi
```

**Cron:**

```cron
0 9 * * * /path/to/pinecone-health-check.sh >> /var/log/pinecone.log 2>&1
```

### 3. Application Monitoring

**Supabase Uploads überwachen:**

```sql
-- Fehlgeschlagene Uploads heute
SELECT
  id,
  file_name,
  error_message,
  created_at
FROM uploads
WHERE
  status = 'failed'
  AND created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- Häufigste Fehler
SELECT
  error_message,
  COUNT(*) as count
FROM uploads
WHERE
  status = 'failed'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY error_message
ORDER BY count DESC;
```

---

## Bekannte Issues & Workarounds

### Issue 1: Rate Limiting

**Symptom:** Embeddings erfolgreich für erste 10 Chunks, dann Dimension 0

**Ursache:** Gemini API Rate Limit (60 requests/minute)

**Workaround:**

```javascript
// In Code Node nach Text Splitter
const chunks = $input.all();
const BATCH_SIZE = 50;
const DELAY_MS = 1000;

// Verarbeite in Batches mit Delay
for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
  const batch = chunks.slice(i, i + BATCH_SIZE);
  // Process batch
  if (i + BATCH_SIZE < chunks.length) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
}
```

### Issue 2: Text zu lang

**Symptom:** Embedding Generation schlägt fehl bei einzelnen Chunks

**Ursache:** Text Splitter erstellt Chunks > 10.000 Zeichen

**Workaround:**

- Chunk Size reduzieren: `1000` → `800`
- Chunk Overlap reduzieren: `200` → `100`

**In Workflow (Zeile 218-219):**

```json
"parameters": {
  "chunkSize": 800,     // reduziert von 1000
  "chunkOverlap": 100   // reduziert von 200
}
```

---

## Support & Weitere Hilfe

**n8n Community:**

- [Pinecone Vector Dimension Issues](https://community.n8n.io/t/problem-in-node-pinecone-vector-store1-vector-dimension/79207)
- [Gemini Embeddings Feature Request](https://community.n8n.io/t/dimensions-option-for-embeddings-google-vertex-and-embeddings-google-gemini-nodes/124300)

**Pinecone Support:**

- [Dimension Mismatch Troubleshooting](https://community.pinecone.io/t/vector-dimension-0-does-not-match-the-dimension-of-the-index-3072/8191)

**Google Gemini:**

- [Embeddings API Documentation](https://ai.google.dev/gemini-api/docs/embeddings)
- [Model Specifications](https://ai.google.dev/gemini-api/docs/models/gemini)

**TiMax Setup:**

- `D:\Timax\PINECONE_INDEX_FIX.md` - Index Neuerstellen Anleitung
- `D:\Timax\n8n-workflows\embedding-validation-node.json` - Validation Node Code
- `D:\Timax\SETUP_SUPABASE.md` - Allgemeine Setup-Dokumentation

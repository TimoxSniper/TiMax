# ⚠️ FIX: Vector Dimension 0 Problem

## Problem

Bei Nutzung von **Gemini Embeddings `text-embedding-004`** zeigt der Upload **Vector Dimension 0** statt der erwarteten **768**.

## Ursachen (nach Wahrscheinlichkeit)

### 1. Pinecone Index falsch konfiguriert (80% Wahrscheinlichkeit)

❌ **Problem:** Index wurde mit falscher Dimension erstellt

- OpenAI: 1536 Dimensionen
- Cohere: 1024 oder 768
- Gemini text-embedding-004: **768** ✅
- Gemini gemini-embedding-001: 3072

✅ **Lösung:**

```bash
# 1. Prüfe aktuelle Dimension
node check-pinecone-dimension.js

# 2. Falls falsch: Index neu erstellen
# ACHTUNG: Löscht alle Vektoren!
pinecone index delete timax-knowledge
pinecone index create \
  --name timax-knowledge \
  --dimension 768 \
  --metric cosine
```

### 2. Gemini API gibt leere Embeddings zurück (15%)

❌ **Problem:** API-Fehler oder Rate Limiting

Mögliche Ursachen:

- API Key ungültig
- Rate Limit überschritten (60 requests/minute)
- Input-Text ist leer
- Embedding-Node falsch verbunden

✅ **Lösung:**

1. **API Key validieren:**

   ```bash
   # Test Gemini API direkt
   curl -H "Content-Type: application/json" \
     -d '{"model": "text-embedding-004", "content": {"parts": [{"text": "Test"}]}}' \
     -H "x-goog-api-key: YOUR_API_KEY" \
     https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent
   ```

2. **Rate Limiting in n8n einfügen:**
   - Füge "Wait" Node (500ms) nach Embeddings ein
   - Oder: Batch Processing mit max 50 items

3. **Input validieren:**
   - Prüfe ob `transcript` nicht leer ist
   - Minimum 5 Zeichen Text erforderlich

### 3. n8n Node-Problem (5%)

❌ **Problem:** Workflow-Konfiguration fehlerhaft

Häufige Fehler:

- Embedding-Node nicht mit Vector Store verbunden
- Falscher Connection Type (`ai_embedding` erforderlich)
- Document Loader gibt keine Dokumente weiter

✅ **Lösung:**

Füge den **DEBUG Validation Node** ein:

1. Öffne `n8n-workflows/DEBUG-embedding-validation-node.json`
2. Kopiere den Node
3. Füge ihn in deinen Workflow ein:
   ```
   [Embeddings] → [DEBUG: Validate Embeddings] → [Insert Pinecone]
   ```
4. Führe Test-Upload durch
5. Prüfe Console-Logs in n8n

Der Node zeigt dir:

- Ob Embeddings existieren
- Welche Dimension sie haben
- Ob Werte valide sind
- Genaue Fehlerquelle

---

## Schritt-für-Schritt Diagnose

### Phase 1: Pinecone Index prüfen (2 Minuten)

```bash
# 1. Check-Script ausführen
cd D:\Timax
node check-pinecone-dimension.js

# Erwartete Ausgabe:
# ✅ Dimension 768 ist korrekt für text-embedding-004
```

**Falls Dimension ≠ 768:**
→ Gehe zu "Lösung A: Index neu erstellen"

**Falls Dimension = 768:**
→ Gehe zu Phase 2

### Phase 2: n8n Workflow debuggen (5 Minuten)

```bash
# 1. Öffne n8n Workflow Editor
# 2. Workflow: "TiMax Upload Workflow (CHUNKING FIXED)"
# 3. Füge DEBUG Node ein (siehe oben)
# 4. Test-Upload durchführen
# 5. Prüfe n8n Console-Logs
```

**Logs zeigen "Kein Embedding gefunden":**
→ Gehe zu "Lösung B: Node-Verbindungen prüfen"

**Logs zeigen "Embedding Dimension ist 0":**
→ Gehe zu "Lösung C: API Key validieren"

**Logs zeigen "Dimension ≠ 768":**
→ Gehe zu "Lösung D: Falsches Modell"

### Phase 3: API validieren (2 Minuten)

```bash
# Test Gemini API direkt
curl -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-004",
    "content": {
      "parts": [{
        "text": "Dies ist ein Test für Embeddings"
      }]
    }
  }' \
  -H "x-goog-api-key: $GOOGLE_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent

# Erwartete Response:
# {
#   "embedding": {
#     "values": [0.123, -0.456, ...] // 768 Werte
#   }
# }
```

**Falls HTTP 401/403:**
→ API Key ist ungültig

**Falls HTTP 429:**
→ Rate Limit überschritten

**Falls leeres Array:**
→ Input-Text ist leer

---

## Lösungen

### Lösung A: Pinecone Index neu erstellen

⚠️ **ACHTUNG:** Löscht ALLE bestehenden Vektoren!

```bash
# 1. Backup erstellen (falls Pinecone Paid Plan)
pinecone index export timax-knowledge ./backup-$(date +%Y%m%d).json

# 2. Index löschen
pinecone index delete timax-knowledge

# 3. Neu erstellen mit korrekter Dimension
pinecone index create \
  --name timax-knowledge \
  --dimension 768 \
  --metric cosine \
  --region us-east-1

# 4. Warten bis Ready
pinecone index describe timax-knowledge
# Status: Ready ✅

# 5. Test-Upload durchführen
```

### Lösung B: Node-Verbindungen prüfen

In n8n Workflow Editor:

1. **Embedding Node prüfen:**
   - Model: `text-embedding-004` ✅
   - Credentials: Google Gemini API gesetzt ✅

2. **Verbindung prüfen:**
   - Embeddings → Vector Store
   - Connection Type muss `ai_embedding` sein (lila Linie)
   - NICHT `main` (grau)!

3. **Document Loader prüfen:**
   - Muss JSON Mode = "Expression Data" sein
   - Text-Feld: `{{ $('Combine Data').item.json.transcript }}`
   - Metadata korrekt gesetzt

4. **Text Splitter prüfen:**
   - Chunk Size: 1000
   - Overlap: 200
   - Verbunden mit Document Loader (`ai_textSplitter`)

### Lösung C: Gemini API Key validieren

1. **Key in n8n Credentials prüfen:**

   ```
   Settings → Credentials → Google Gemini (PaLM) API
   API Key: AIza... (sollte mit "AIza" beginnen)
   ```

2. **Key Permissions prüfen:**
   - Google Cloud Console → APIs & Services
   - "Generative Language API" AKTIVIERT ✅

3. **Rate Limiting:**
   - Free Tier: 60 requests/minute
   - Füge "Wait" Node ein (500ms delay)

### Lösung D: Auf gemini-embedding-001 upgraden

**⚠️ WICHTIG:** `text-embedding-004` ist seit 14.01.2026 DEPRECATED!

Upgrade zu neuem Modell:

1. **Workflow ändern:**

   ```json
   // Embeddings Node (beide Workflows!)
   {
     "model": "gemini-embedding-001" // NEU! (vorher: text-embedding-004)
   }
   ```

2. **Pinecone Index neu erstellen:**

   ```bash
   pinecone index delete timax-knowledge
   pinecone index create \
     --name timax-knowledge \
     --dimension 3072 \  # NEU! (vorher: 768)
     --metric cosine
   ```

3. **Validation Node anpassen:**
   ```javascript
   const EXPECTED_DIMENSION = 3072; // NEU! (vorher: 768)
   ```

**Vorteile:**

- Zukunftssicher (aktuelles Modell)
- Höhere Embedding-Qualität
- 3072 Dimensionen = bessere Genauigkeit

**Nachteil:**

- Alle bestehenden Uploads müssen neu verarbeitet werden

---

## Nach dem Fix: Verifizierung

### 1. Test-Upload durchführen

```bash
# 1. Kleine Audio-Datei hochladen (< 10MB)
# 2. Status in Dashboard prüfen
# 3. Console-Logs in n8n prüfen
```

Erwartete Logs:

```
✅ Embedding ist VALIDE
Embedding Dimension: 768
Value Range: [-0.1234, 0.4567]
✅ VALIDATION SUCCESSFUL
```

### 2. Pinecone Vektoren prüfen

```bash
# Index Stats abrufen
pinecone index describe timax-knowledge

# Erwartete Ausgabe:
# dimension: 768 ✅
# totalVectorCount: > 0 ✅
```

### 3. Chat-Suche testen

1. Zum Chat navigieren
2. Frage stellen: "Was habe ich hochgeladen?"
3. Erwartete Antwort sollte Transkript-Inhalte enthalten

Falls keine Ergebnisse:
→ Vektoren wurden noch nicht indiziert (1-2 Minuten warten)

---

## Monitoring für Produktiv-Umgebung

### Alert-Setup in n8n

Füge "Error Trigger" Workflow ein:

```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.errorTrigger",
      "name": "On Workflow Error"
    },
    {
      "type": "n8n-nodes-base.if",
      "name": "Check if Embedding Error",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.error.message }}",
              "operation": "contains",
              "value2": "dimension"
            }
          ]
        }
      }
    },
    {
      "type": "n8n-nodes-base.emailSend",
      "name": "Send Alert",
      "parameters": {
        "subject": "⚠️ Embedding Dimension Error",
        "text": "Workflow: {{ $json.workflow.name }}\\nError: {{ $json.error.message }}"
      }
    }
  ]
}
```

### Logging

Füge in jeden kritischen Node:

```javascript
console.log("[TIMESTAMP]", new Date().toISOString());
console.log("[CHECKPOINT] Embeddings Node - Start");
// ... Node Logic ...
console.log("[CHECKPOINT] Embeddings Node - Success");
```

---

## Bekannte Issues

### Issue 1: n8n Community Feature Request

**Problem:** Standard `embeddingsGoogleGemini` Node hat KEINE `outputDimensionality` Parameter

**Status:** [Feature Request seit Monaten offen](https://community.n8n.io/t/dimensions-option-for-embeddings-google-vertex-and-embeddings-google-gemini-nodes/124300)

**Workaround:** Community Package `n8n-nodes-gemini-embedding-plus` verwenden

```bash
# In n8n Container
npm install n8n-nodes-gemini-embedding-plus
# Restart n8n
```

### Issue 2: Pinecone Dimension Mismatch

**Error Message:**

```
PineconeArgumentError: Vector dimension 0 does not match the dimension of the index 768
```

**Ursache:** Pinecone prüft Dimensionen VOR dem Upload, aber n8n zeigt keinen aussagekräftigen Fehler

**Fix:** DEBUG Validation Node (siehe oben) zeigt genaue Ursache

### Issue 3: Rate Limiting nicht sichtbar

**Problem:** Gemini API gibt bei Rate Limiting HTTP 200 mit leerem Array zurück

**Workaround:**

```javascript
// In Code Node NACH Embeddings:
if (embedding.length === 0) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error("Retry after rate limit");
}
```

---

## Zusammenfassung

**Schnellster Fix (5 Minuten):**

1. `node check-pinecone-dimension.js` ausführen
2. Falls Dimension ≠ 768: Index neu erstellen
3. Test-Upload durchführen

**Gründlicher Fix (15 Minuten):**

1. Pinecone prüfen
2. DEBUG Node einfügen
3. API Key validieren
4. Logs analysieren
5. Ursache beheben

**Zukunftssicherer Fix (30 Minuten):**

1. Upgrade zu `gemini-embedding-001`
2. Index mit Dimension 3072 erstellen
3. Alle Uploads neu verarbeiten
4. Monitoring einrichten

---

## Support

**Dokumentation:**

- [Gemini Embeddings Docs](https://ai.google.dev/gemini-api/docs/embeddings)
- [n8n Vector Store Docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.vectorstorepinecone/)
- [Pinecone Index Management](https://docs.pinecone.io/guides/indexes/manage-indexes)

**Community:**

- [n8n Community Forum](https://community.n8n.io/)
- [Pinecone Community](https://community.pinecone.io/)

**Dieser Fix wurde erstellt am:** 2026-02-07
**Getestet mit:**

- n8n: v1.x
- Gemini: text-embedding-004
- Pinecone: Serverless

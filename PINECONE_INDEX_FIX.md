# Pinecone Index Dimension Fix für Gemini Embeddings

## Problem

Vector Dimension wird als 0 angezeigt, statt der erwarteten 768 für `text-embedding-004`.

## Root Cause

1. Der Pinecone Index `timax-knowledge` wurde möglicherweise mit falscher Dimension erstellt
2. n8n `embeddingsGoogleGemini` Node hat keine Output-Dimensions-Konfiguration
3. `text-embedding-004` ist deprecated (seit 14.01.2026) und sollte durch `gemini-embedding-001` ersetzt werden

## Lösung 1: Pinecone Index überprüfen und neu erstellen

### Schritt 1: Index-Dimension überprüfen

```bash
# Via Pinecone Console oder CLI
pinecone index describe timax-knowledge
```

### Schritt 2: Falschen Index löschen (falls Dimension != 768)

```bash
# ACHTUNG: Löscht alle Daten!
pinecone index delete timax-knowledge
```

### Schritt 3: Neuen Index mit korrekter Dimension erstellen

```bash
# Für text-embedding-004 (768 Dimensionen)
pinecone index create \
  --name timax-knowledge \
  --dimension 768 \
  --metric cosine \
  --spec serverless \
  --cloud aws \
  --region us-east-1
```

**Alternative: Für neueres Modell `gemini-embedding-001` (3072 Dimensionen):**

```bash
pinecone index create \
  --name timax-knowledge \
  --dimension 3072 \
  --metric cosine \
  --spec serverless \
  --cloud aws \
  --region us-east-1
```

## Lösung 2: Upgrade zu gemini-embedding-001 (Empfohlen)

### In n8n Workflow ändern:

**Datei:** `upload-workflow-CHUNKING-FIXED.json`

**Ändern (Zeile 275):**

```json
"parameters": {
  "model": "text-embedding-004"  // ❌ Deprecated
}
```

**Zu:**

```json
"parameters": {
  "model": "gemini-embedding-001"  // ✅ Neuestes Modell
}
```

**WICHTIG:** Pinecone Index muss dann mit 3072 Dimensionen erstellt werden!

## Lösung 3: Community Node mit Dimensions-Kontrolle verwenden

### Installation:

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-gemini-embedding-plus
```

### Node-Konfiguration:

```json
{
  "type": "n8n-nodes-gemini-embedding-plus.embeddingsGoogleGemini",
  "parameters": {
    "model": "text-embedding-004",
    "outputDimensionality": 768 // ✅ Explizit setzen
  }
}
```

## Lösung 4: Debugging - Embeddings validieren

### Code Node nach Embeddings einfügen:

```javascript
// Validate Embeddings Node
const embeddings = $input.all();

console.log("=== EMBEDDING DEBUG ===");
console.log("Anzahl Embeddings:", embeddings.length);

for (const item of embeddings) {
  const embedding = item.json.embedding || item.json;

  if (Array.isArray(embedding)) {
    console.log("Dimension:", embedding.length);
    console.log("Erste 3 Werte:", embedding.slice(0, 3));

    if (embedding.length === 0) {
      throw new Error("❌ Embedding hat Dimension 0!");
    }
    if (embedding.length !== 768) {
      throw new Error(`❌ Falsche Dimension: ${embedding.length} statt 768`);
    }
  } else {
    throw new Error("❌ Embedding ist kein Array!");
  }
}

console.log("✅ Alle Embeddings haben korrekte Dimension 768");
return embeddings;
```

## Lösung 5: API-Key Berechtigung prüfen

### Problem: Gemini API Key hat keine Berechtigung für Embeddings

**Prüfen:**

1. Gehe zu https://aistudio.google.com/apikey
2. Prüfe, ob der API Key für "Gemini API" aktiviert ist
3. Teste den Key:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: YOUR_API_KEY" \
  -d '{
    "model": "models/text-embedding-004",
    "content": {
      "parts": [{
        "text": "Test Embedding"
      }]
    }
  }'
```

**Erwartete Antwort:**

```json
{
  "embedding": {
    "values": [0.123, 0.456, ...]  // 768 Werte
  }
}
```

## Zusammenfassung

**Wahrscheinlichste Ursache:** Pinecone Index wurde mit falscher Dimension erstellt

**Empfohlene Aktion:**

1. Index-Dimension überprüfen
2. Falls falsch: Index neu erstellen mit Dimension 768
3. Upgrade zu `gemini-embedding-001` erwägen (3072 Dimensionen)
4. Validation Node einfügen um frühzeitig zu erkennen

**Quellen:**

- [Gemini Embeddings Documentation](https://ai.google.dev/gemini-api/docs/embeddings)
- [n8n Community: Dimensions Feature Request](https://community.n8n.io/t/dimensions-option-for-embeddings-google-vertex-and-embeddings-google-gemini-nodes/124300)
- [Pinecone Dimension Mismatch Issue](https://community.pinecone.io/t/vector-dimension-0-does-not-match-the-dimension-of-the-index-3072/8191)
- [n8n Gemini Embedding Plus (Community Package)](https://socket.dev/npm/package/n8n-nodes-gemini-embedding-plus)

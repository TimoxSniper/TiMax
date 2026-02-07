# ADR-004: n8n für Workflow Automation

Datum: 2024-01-25
Status: Akzeptiert

## Kontext

Wir müssen komplexe Workflows automatisieren:

- Datei-Upload verarbeiten
- Transkription starten
- KI-Textgenerierung
- Benachrichtigungen senden

Optionen:

- n8n (Open Source)
- Zapier
- Make (Integromat)
- Eigenes Workflow-System

## Entscheidung

Wir verwenden **n8n** (Self-Hosted).

## Begründung

### Vorteile n8n

1. **Open Source** - Keine Vendor Lock-in
2. **Self-Hosted** - Volle Kontrolle über Daten
3. **Preis** - Kostenlos (außer Hosting)
4. **Nodes** - 400+ Integrationen
5. **Code Node** - Eigene JavaScript/Python
6. **Error Handling** - Try-Catch, Retry-Logik
7. **Versioning** - Workflows als JSON
8. **Webhooks** - Einfache Integration

### Nachteile

1. **Hosting** - Wir müssen selbst hosten
2. **Wartung** - Updates und Backups
3. **Lernkurve** - Komplexe Workflows
4. **Performance** - JavaScript-basiert

## Konsequenzen

### Positiv

- Keine laufenden Kosten (außer Hosting)
- Datenschutz (DSGVO-konform)
- Flexibel erweiterbar
- Versionierbar

### Negativ

- DevOps-Aufwand für Hosting
- Monitoring nötig
- Skalierungslimits

## Architektur

```
Frontend (Next.js)
    ↓ (Webhook)
n8n (Workflow Engine)
    ↓ (API Calls)
OpenAI (Whisper, Claude)
    ↓ (Speichern)
Supabase (Database)
```

## Workflows

1. **Upload Workflow**
   - Webhook empfangen
   - Datei validieren
   - Supabase speichern
   - Transkription starten

2. **Chat Workflow**
   - Message empfangen
   - Kontext laden
   - Claude API call
   - Response speichern
   - Response senden

## Verwandte ADRs

- ADR-002: Supabase als Backend (n8n speichert Daten)

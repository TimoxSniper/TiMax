# n8n MCP Server

Dieser MCP (Model Context Protocol) Server ermöglicht es, n8n Workflows über MCP zu steuern und zu verwalten.

## Setup

1. **Umgebungsvariablen konfigurieren**

   Erstelle eine `.env.local` Datei im `my-app` Verzeichnis:

   ```env
   N8N_API_URL=http://localhost:5678
   N8N_API_KEY=dein_api_key_hier
   ```

   Den API Key findest du in deiner n8n Instanz unter **Settings → API**.

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **MCP Server starten**

   ```bash
   npm run mcp:server
   ```

## Verfügbare Tools

Der Server stellt folgende Tools zur Verfügung:

- **list_workflows** - Listet alle verfügbaren n8n Workflows auf
- **get_workflow** - Ruft Details eines spezifischen Workflows ab
- **execute_workflow** - Führt einen n8n Workflow aus
- **create_workflow** - Erstellt einen neuen n8n Workflow
- **update_workflow** - Aktualisiert einen bestehenden Workflow
- **delete_workflow** - Löscht einen Workflow
- **get_workflow_executions** - Ruft die Ausführungs-Historie eines Workflows ab

## Integration mit Cursor/Claude Desktop

Um den MCP Server mit Cursor oder Claude Desktop zu verwenden, füge folgende Konfiguration hinzu:

### Cursor

Füge in deiner Cursor-Konfiguration (z.B. `~/.cursor/mcp.json` oder in den Cursor-Einstellungen) hinzu:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npm",
      "args": ["run", "mcp:server"],
      "cwd": "/home/Tynox/TiMax/my-app",
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "dein_api_key_hier"
      }
    }
  }
}
```

### Claude Desktop

Füge in `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) oder `%APPDATA%/Claude/claude_desktop_config.json` (Windows) hinzu:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npm",
      "args": ["run", "mcp:server"],
      "cwd": "/home/Tynox/TiMax/my-app",
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "dein_api_key_hier"
      }
    }
  }
}
```

## Verwendung

Nach der Konfiguration kannst du den AI-Assistenten natürlichsprachlich anweisen, n8n Workflows zu erstellen, auszuführen oder zu verwalten. Beispiel:

- "Zeige mir alle verfügbaren n8n Workflows"
- "Führe den Workflow mit der ID 123 aus"
- "Erstelle einen neuen Workflow für Transkription"


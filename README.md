# TiMax

## Projekt klonen

Um das Projekt zu klonen, führe folgenden Befehl aus:

```bash
git clone https://github.com/TimoxSniper/TiMax.git
cd TiMax
```

## Installation

Nach dem Klonen müssen die Dependencies installiert werden:

```bash
cd my-app
npm install
```

**Hinweis:** Stelle sicher, dass Node.js und npm installiert sind. Falls du nvm verwendest:

```bash
source ~/.nvm/nvm.sh
nvm use default
npm install
```

## Entwicklungsserver starten

Um den Entwicklungsserver zu starten:

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Projektstruktur

- `my-app/` - Next.js Anwendung
- `src/docs/` - Dokumentation
- Weitere Konzept- und Dokumentationsdateien im Root-Verzeichnis

## Technologien

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

## Automatische Einrichtung mit KI

Für eine automatische Einrichtung kannst du den **Master Prompt** (`MASTER_PROMPT.md`) verwenden. Kopiere den Prompt und füge deine `.env.local` Inhalte ein, dann kann eine KI-Assistent das Projekt komplett automatisch einrichten.

### .env.local Datei

Erstelle eine `.env.local` Datei im Root-Verzeichnis mit folgenden Variablen:

```env
GITHUB_TOKEN=dein_github_token
GITHUB_USERNAME=dein_github_username
GITHUB_REPO_URL=github.com/TimoxSniper/TiMax.git
```


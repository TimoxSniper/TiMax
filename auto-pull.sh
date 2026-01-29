#!/usr/bin/env bash
set -e

# Automatisches Git Pull Script
# Prüft ob es neue Änderungen auf GitHub gibt und pulled diese automatisch

# Im Projektverzeichnis ausführen
cd "$(dirname "$0")"

# Log-Datei für Ausgaben
LOG_FILE="$HOME/TiMax-auto-pull.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Funktion zum Loggen
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "=== Auto-Pull gestartet ==="

# Prüfe ob wir in einem Git-Repository sind
if [ ! -d .git ]; then
    log "FEHLER: Kein Git-Repository gefunden!"
    exit 1
fi

# Aktuellen Branch ermitteln
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log "Aktueller Branch: $CURRENT_BRANCH"

# Prüfe ob es uncommitted Änderungen gibt
if ! git diff-index --quiet HEAD --; then
    log "WARNUNG: Es gibt uncommitted Änderungen. Überspringe Pull."
    log "Bitte committe oder stashe deine Änderungen zuerst."
    exit 0
fi

# Fetch neueste Änderungen von GitHub
log "Fetche neueste Änderungen..."
git fetch origin "$CURRENT_BRANCH" 2>&1 | tee -a "$LOG_FILE"

# Prüfe ob es neue Commits gibt
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$CURRENT_BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
    log "Repository ist bereits auf dem neuesten Stand."
else
    log "Neue Änderungen gefunden! Führe Pull aus..."
    git pull origin "$CURRENT_BRANCH" 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -eq 0 ]; then
        log "✓ Pull erfolgreich abgeschlossen!"
        
        # Optional: npm install ausführen falls package.json geändert wurde
        if git diff --name-only HEAD@{1} HEAD | grep -q "package.json\|package-lock.json"; then
            log "package.json wurde geändert. Führe npm install aus..."
            cd my-app
            if [ -f package.json ]; then
                source ~/.nvm/nvm.sh 2>/dev/null || true
                nvm use default 2>/dev/null || true
                npm install 2>&1 | tee -a "$LOG_FILE"
                log "npm install abgeschlossen."
            fi
        fi
    else
        log "✗ FEHLER: Pull fehlgeschlagen!"
        exit 1
    fi
fi

log "=== Auto-Pull beendet ==="
echo "" >> "$LOG_FILE"





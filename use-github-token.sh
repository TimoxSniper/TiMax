#!/usr/bin/env bash
set -e

# Im Projektverzeichnis ausführen (da, wo dieses Skript liegt)
cd "$(dirname "$0")"

if [ ! -f .env.local ]; then
  echo ".env.local nicht gefunden. Bitte erst erstellen."
  exit 1
fi

# Variablen aus .env.local laden
set -o allexport
source .env.local
set +o allexport

if [ -z "$GITHUB_TOKEN" ]; then
  echo "GITHUB_TOKEN ist leer. Bitte in .env.local eintragen."
  exit 1
fi

if [ -z "$GITHUB_USERNAME" ]; then
  echo "GITHUB_USERNAME ist leer. Bitte in .env.local eintragen."
  exit 1
fi

if [ -z "$GITHUB_REPO_URL" ]; then
  echo "GITHUB_REPO_URL ist leer. Bitte in .env.local eintragen."
  exit 1
fi

# origin-URL mit Token setzen (wird nur lokal in .git/config gespeichert)
NEW_URL="https://$GITHUB_USERNAME:$GITHUB_TOKEN@$GITHUB_REPO_URL"

git remote set-url origin "$NEW_URL"

echo "origin auf: $NEW_URL gesetzt."
echo "Achtung: Der Token steht jetzt im lokalen .git/config. Teile dieses Verzeichnis nicht unverschlüsselt."

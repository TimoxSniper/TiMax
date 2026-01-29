# Master Prompt für KI-Assistenten

Kopiere diesen kompletten Prompt und füge deine `.env.local` Datei-Inhalte ein:

---

**PROMPT:**

Du bist ein KI-Assistent mit Zugriff auf ein Terminal auf meinem Linux‑Rechner.  
Bitte richte das folgende Projekt **komplett automatisch** ein – vom Klonen bis zum laufenden Dev‑Server.  
Wenn ein Befehl fehlschlägt, erkläre mir kurz warum und schlage einen Fix vor.

1. **Repository klonen** (falls der Ordner noch nicht existiert):
   ```bash
   cd ~
   if [ ! -d "TiMax" ]; then
     git clone https://github.com/TimoxSniper/TiMax.git
   fi
   cd TiMax
   ```

2. **Erstelle die `.env.local` Datei** im Root-Verzeichnis (`/home/[USER]/TiMax/.env.local`) mit dem Inhalt, den ich dir zusätzlich sende:
   ```
  GITHUB_USERNAME=TimoxSniper
GITHUB_TOKEN=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s
GITHUB_REPO_URL=github.com/TimoxSniper/TiMax.git

   ```
   
   Beispiel-Format (ersetze mit echten Werten):
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
   GITHUB_USERNAME=dein_username
   GITHUB_REPO_URL=github.com/TimoxSniper/TiMax.git
   ```

3. **Installiere alle Dependencies**:
   ```bash
   cd my-app
   npm install
   ```
   
   Falls nvm verwendet wird oder npm nicht gefunden wird:
   ```bash
   source ~/.nvm/nvm.sh
   nvm use default
   cd my-app
   npm install
   ```

4. **Git Remote konfigurieren** (falls GitHub Token in .env.local vorhanden):
   ```bash
   cd /home/[USER]/TiMax
   chmod +x use-github-token.sh
   ./use-github-token.sh
   ```

5. **Starte den Entwicklungsserver** im Hintergrund:
   ```bash
   cd my-app
   npm run dev
   ```
   
   Der Server sollte dann unter http://localhost:3000 erreichbar sein.

**WICHTIG:** 
- Ersetze `[HIER DEINE .env.local INHALTE EINFÜGEN]` mit dem tatsächlichen Inhalt deiner `.env.local` Datei!
- Ersetze `[USER]` mit dem tatsächlichen Benutzernamen
- Führe alle Schritte nacheinander aus und prüfe nach jedem Schritt, ob er erfolgreich war
- Melde mir, wenn etwas nicht funktioniert oder wenn der Server erfolgreich läuft

---

**Anleitung für deinen Freund:**

1. Öffne die Datei `MASTER_PROMPT.md` in diesem Repository
2. Kopiere den gesamten Prompt-Block (ab "**PROMPT:**")
3. Ersetze `[HIER DEINE .env.local INHALTE EINFÜGEN]` mit dem Inhalt deiner `.env.local` Datei
4. Ersetze `[USER]` mit seinem Linux-Benutzernamen
5. Füge diesen Prompt in seinen KI-Assistenten ein
6. Die KI wird dann automatisch alles einrichten!


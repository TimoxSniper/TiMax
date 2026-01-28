# Automatisches Git Pull Setup

Dieses Dokument erklärt, wie du automatisches Pulling von GitHub auf deinem anderen Gerät einrichtest.

## Option 1: Cron Job (Empfohlen)

Ein Cron Job führt das Script regelmäßig aus (z.B. alle 5 Minuten).

### Einrichtung:

1. **Crontab öffnen:**
   ```bash
   crontab -e
   ```

2. **Eintrag hinzufügen** (prüft alle 5 Minuten):
   ```bash
   */5 * * * * /home/Tynox/TiMax/auto-pull.sh >/dev/null 2>&1
   ```

   Oder für andere Intervalle:
   - **Jede Minute:** `* * * * *`
   - **Alle 10 Minuten:** `*/10 * * * *`
   - **Jede Stunde:** `0 * * * *`
   - **Alle 2 Stunden:** `0 */2 * * *`

3. **Crontab speichern** (in vim/nano: `:wq` oder `Ctrl+X`, dann `Y`)

### Cron Job prüfen:
```bash
crontab -l
```

### Logs ansehen:
```bash
tail -f ~/TiMax-auto-pull.log
```

## Option 2: Systemd Service (Für kontinuierliches Monitoring)

Erstelle einen Systemd Service, der das Script regelmäßig ausführt.

### Service-Datei erstellen:

```bash
sudo nano /etc/systemd/system/timax-auto-pull.service
```

Inhalt:
```ini
[Unit]
Description=TiMax Auto Pull Service
After=network.target

[Service]
Type=oneshot
User=Tynox
WorkingDirectory=/home/Tynox/TiMax
ExecStart=/home/Tynox/TiMax/auto-pull.sh
StandardOutput=journal
StandardError=journal
```

### Timer-Datei erstellen:

```bash
sudo nano /etc/systemd/system/timax-auto-pull.timer
```

Inhalt:
```ini
[Unit]
Description=TiMax Auto Pull Timer
Requires=timax-auto-pull.service

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

### Timer aktivieren:

```bash
sudo systemctl daemon-reload
sudo systemctl enable timax-auto-pull.timer
sudo systemctl start timax-auto-pull.timer
```

### Status prüfen:
```bash
sudo systemctl status timax-auto-pull.timer
sudo systemctl status timax-auto-pull.service
```

## Option 3: Watch-Script (Manuell starten)

Für ein kontinuierlich laufendes Script, das du manuell starten kannst:

```bash
# Script starten (läuft im Hintergrund)
nohup /home/Tynox/TiMax/watch-pull.sh > /dev/null 2>&1 &

# Prozess beenden
pkill -f watch-pull.sh
```

## Option 4: GitHub Webhook (Erweitert)

Für sofortige Reaktion auf Pushes benötigst du:
1. Einen Webhook-Server auf deinem anderen Gerät
2. GitHub Webhook konfigurieren, der auf Push-Events reagiert
3. Der Server führt dann `git pull` aus

**Hinweis:** Diese Lösung ist komplexer und erfordert einen erreichbaren Server.

## Wichtige Hinweise

- **Uncommitted Änderungen:** Das Script überspringt Pulls, wenn es uncommitted Änderungen gibt. Committe oder stashe diese zuerst.
- **Merge-Konflikte:** Bei Konflikten schlägt der Pull fehl. Prüfe die Logs und löse Konflikte manuell.
- **Logs:** Alle Aktivitäten werden in `~/TiMax-auto-pull.log` gespeichert.
- **npm install:** Wenn `package.json` geändert wurde, wird automatisch `npm install` ausgeführt.

## Troubleshooting

### Script funktioniert nicht:
```bash
# Prüfe ob Script ausführbar ist
ls -l /home/Tynox/TiMax/auto-pull.sh

# Teste manuell
/home/Tynox/TiMax/auto-pull.sh
```

### Cron Job läuft nicht:
```bash
# Prüfe Cron-Logs
grep CRON /var/log/syslog

# Prüfe ob Cron läuft
systemctl status cron
```

### Git-Authentifizierung:
Stelle sicher, dass `use-github-token.sh` ausgeführt wurde, damit Git Zugriff auf GitHub hat.




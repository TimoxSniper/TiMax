# Upstash Redis Setup für TiMax

## Übersicht

TiMax verwendet **Upstash Redis** für globales Rate Limiting. Upstash bietet einen kostenlosen Free Tier, der für die TiMax-Nutzung mehr als ausreichend ist.

## Free Tier Limits

✅ **10,000 Commands pro Tag** (ausreichend für TiMax)
✅ **256 MB Storage**
✅ **100 Concurrent Connections**
✅ **Keine Kreditkarte erforderlich**
✅ **Global Edge Network** (niedrige Latenz weltweit)

## Erwartete tägliche Nutzung

Basierend auf der TiMax-Nutzung:
- Email Signups: ~200 commands/day
- Chat Messages: ~2,000 commands/day
- Uploads: ~100 commands/day
- Search Queries: ~1,000 commands/day
- **Gesamt: ~3,300 / 10,000 commands/day** ✅

## Setup-Anleitung

### Schritt 1: Upstash Account erstellen (5 Minuten)

1. Gehe zu https://upstash.com/
2. Klicke auf **"Sign Up"** (kostenlos, keine Kreditkarte erforderlich)
3. Registriere dich mit:
   - E-Mail + Passwort
   - ODER GitHub
   - ODER Google

### Schritt 2: Redis Database erstellen (5 Minuten)

1. Nach dem Login klicke auf **"Create Database"**
2. Wähle folgende Einstellungen:
   - **Name**: `timax-rate-limiting`
   - **Type**: `Regional` (kostenlos)
   - **Region**: `EU-Central-1` (oder näher zu deinen Nutzern)
   - **Eviction**: `allkeys-lru` (Standard)
3. Klicke auf **"Create"**

### Schritt 3: Credentials kopieren (2 Minuten)

1. Auf der Database-Seite siehst du zwei wichtige Werte:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
2. Kopiere beide Werte (klicke auf das Kopier-Icon)

### Schritt 4: Environment Variables setzen

#### Lokal (`.env.local`)

Füge folgende Zeilen zu deiner `.env.local` Datei hinzu:

```bash
# Upstash Redis (für Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**Wichtig**: Ersetze die Werte mit deinen echten Credentials aus Schritt 3!

#### Vercel (Production)

1. Gehe zu deinem Vercel Project
2. Klicke auf **Settings** → **Environment Variables**
3. Füge beide Variables hinzu:
   - Name: `UPSTASH_REDIS_REST_URL`
   - Value: `https://your-instance.upstash.io`
   - Environment: **Production, Preview, Development** (alle auswählen)
4. Wiederhole für `UPSTASH_REDIS_REST_TOKEN`
5. Klicke auf **"Save"**
6. **Redeploy** deine App, damit die neuen Variablen geladen werden

### Schritt 5: Health Check testen (2 Minuten)

#### Lokal testen

```bash
# Starte den Dev-Server
npm run dev

# In einem neuen Terminal:
curl http://localhost:3000/api/health/redis
```

**Erwartete Antwort (gesund):**
```json
{
  "status": "healthy",
  "message": "Redis is working correctly",
  "tests": {
    "set": "passed",
    "get": "passed",
    "delete": "passed"
  },
  "performance": {
    "responseTime": "123ms"
  }
}
```

**Alternative (Browser):**
Öffne einfach: http://localhost:3000/api/health/redis

#### Production testen

Nach dem Deployment auf Vercel:
```bash
curl https://timax.vercel.app/api/health/redis
```

Oder öffne im Browser: https://timax.vercel.app/api/health/redis

### Schritt 6: Rate Limiting verifizieren (5 Minuten)

Teste das Email-Signup-Rate-Limiting:

1. Öffne die TiMax Landing Page
2. Melde dich 3x mit derselben/verschiedenen E-Mails an
3. Beim **4. Versuch** solltest du folgende Fehlermeldung sehen:
   > "Zu viele Anfragen. Bitte versuche es in einer Stunde erneut."
4. Status Code: `429 Too Many Requests`
5. **Warte 1 Stunde** oder lösche den Rate-Limit-Key in Upstash (siehe unten)

#### Rate-Limit-Key manuell löschen (für Tests)

Im Upstash Dashboard:
1. Gehe zu deiner Database → **Data Browser**
2. Suche nach Keys mit Pattern: `ratelimit:waitlist:*`
3. Klicke auf den Key und dann **"Delete"**
4. Jetzt kannst du sofort wieder Signups testen

## Monitoring & Maintenance

### Upstash Dashboard

Im Dashboard kannst du sehen:
- **Commands Used**: Wie viele Commands heute verbraucht wurden
- **Storage Used**: Wie viel Speicher belegt ist
- **Latency**: Durchschnittliche Response-Zeit
- **Data Browser**: Alle Keys und deren Values anzeigen

### Rate Limit Keys

TiMax speichert folgende Keys in Redis:

```
ratelimit:waitlist:192.168.1.1       # Email Signup (IP-basiert)
ratelimit:search:user_abc123         # Search (User-basiert)
ratelimit:upload:user_abc123         # Upload (User-basiert)
```

Jeder Key hat eine **TTL (Time To Live)**:
- Waitlist: 1 Stunde
- Search: 1 Minute
- Upload: variabel

### Commands pro Endpoint

| Endpoint | Commands pro Request | Rate Limit |
|----------|---------------------|------------|
| `/api/waitlist` | 4 (incr, pttl, pexpire, check) | 3/hour |
| `/api/search` | 4 | 30/minute |
| `/api/chats` (POST) | 4 | 10/minute |
| `/api/uploads` (POST) | 4 | 5/minute |

## Fallback-Strategie

Wenn Redis nicht verfügbar ist, fällt TiMax automatisch auf **In-Memory-Rate-Limiting** zurück.

### Unterschiede:
- ✅ **Redis** (Production): Globales Rate Limiting über alle Server-Instanzen
- ⚠️ **In-Memory** (Fallback): Rate Limiting nur pro Server-Instanz

### Wann wird Fallback verwendet?

1. Redis Credentials fehlen
2. Redis ist down
3. Network-Fehler
4. Development-Umgebung (optional)

Im Fallback-Modus siehst du folgende Log-Nachricht:
```
[Rate Limit] Using in-memory fallback (development only).
Configure Upstash Redis for production.
```

## Troubleshooting

### Problem: Health Check zeigt "not_configured"

**Lösung:**
1. Überprüfe `.env.local` (lokal) oder Vercel Environment Variables
2. Stelle sicher, dass beide Variables gesetzt sind:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Restart Dev-Server: `npm run dev`

### Problem: Health Check zeigt "unhealthy"

**Lösung:**
1. Überprüfe Upstash Dashboard → Database Status
2. Teste Connection direkt mit:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-instance.upstash.io/get/test
   ```
3. Überprüfe Firewall/Network-Einstellungen

### Problem: Rate Limiting funktioniert nicht

**Lösung:**
1. Überprüfe Health Check: `GET /api/health/redis`
2. Checke Browser Console für Fehler
3. Schaue in Upstash Dashboard → Data Browser → Sind Keys vorhanden?
4. Teste manuell:
   ```bash
   # 4x schnell hintereinander
   for i in {1..4}; do
     curl -X POST http://localhost:3000/api/waitlist \
       -H "Content-Type: application/json" \
       -d '{"email":"test@example.com"}'
   done
   ```

### Problem: "429 Too Many Requests" im Health Check

**Lösung:**
Das ist normal! Der Health Check wird NICHT rate-limited.
Wenn du trotzdem 429 siehst, liegt das an einem anderen Endpoint.

## Best Practices

### 1. Monitoring einrichten
- Checke täglich das Upstash Dashboard
- Setze Alerts für 80% Command-Limit-Nutzung
- Überwache Latency (sollte < 100ms sein)

### 2. Rate Limits anpassen
Je nach Nutzung kannst du die Limits in der Code-Base anpassen:

```typescript
// my-app/src/app/api/waitlist/route.ts
const RATE_LIMIT_CONFIG = {
  maxRequests: 3,      // Anzahl Requests
  windowMs: 60 * 60 * 1000, // Zeitfenster (1h)
};
```

### 3. TTL optimieren
Längere TTLs = weniger Commands, aber weniger Speicher-Overhead:

```typescript
// Kurze TTL (1 Minute)
await redis.set(key, value, { ex: 60 });

// Lange TTL (1 Stunde)
await redis.set(key, value, { ex: 3600 });
```

### 4. Cleanup-Strategy
Redis löscht abgelaufene Keys automatisch (Eviction Policy: `allkeys-lru`).
Kein manuelles Cleanup erforderlich!

## Kosten & Upgrades

### Free Tier (aktuell)
- 10,000 Commands/Tag
- 256 MB Storage
- 100 Concurrent Connections
- **Preis: $0/Monat**

### Pay-as-you-go (falls nötig)
- $0.20 pro 100,000 Commands
- $0.25 pro GB Storage
- Keine monatlichen Fixkosten
- **Nur zahlen, wenn Free Tier überschritten**

### Wann upgraden?
Erst upgraden, wenn:
- \> 10,000 Commands/Tag regelmäßig
- \> 256 MB Storage benötigt
- Upstash fordert dich auf

## Support & Ressourcen

- **Upstash Docs**: https://docs.upstash.com/redis
- **Upstash Discord**: https://discord.gg/upstash
- **TiMax Support**: [Dein Support-Link]

## Checkliste ✅

Nach dem Setup solltest du:
- [ ] Upstash Account erstellt
- [ ] Redis Database erstellt (EU-Central-1)
- [ ] Environment Variables gesetzt (lokal + Vercel)
- [ ] Health Check erfolgreich (`status: "healthy"`)
- [ ] Rate Limiting getestet (4. Request = 429)
- [ ] Upstash Dashboard geöffnet und Commands beobachtet
- [ ] Monitoring eingerichtet

**Status:** ✅ Redis ist einsatzbereit!

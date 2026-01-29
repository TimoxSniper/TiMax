# 🆓 Setup-Anleitung: Kostenlose Services

**Datum:** 29. Januar 2026  
**Services:** VirusTotal Free Tier + Supabase Storage Free Tier

---

## 📋 Übersicht

### VirusTotal Free Tier
- ✅ **4 Scans/Tag** kostenlos
- ✅ Dauerhaft kostenlos
- ✅ Keine Kreditkarte nötig

### Supabase Storage Free Tier
- ✅ **1GB Storage** kostenlos
- ✅ **2GB Bandwidth/Monat** kostenlos
- ✅ Dauerhaft kostenlos
- ✅ EU-Region verfügbar (DSGVO)

---

## 🔧 Schritt 1: VirusTotal Account erstellen

1. Gehe zu: https://www.virustotal.com/
2. Klicke auf **"Sign Up"** (oben rechts)
3. Erstelle kostenlosen Account (Email + Passwort)
4. Bestätige Email
5. Gehe zu: https://www.virustotal.com/gui/user/apikey
6. Kopiere deinen **API Key**

### Environment Variable hinzufügen:

```bash
# In my-app/.env.local
VIRUSTOTAL_API_KEY=dein_api_key_hier
```

---

## 🔧 Schritt 2: Supabase Account erstellen

1. Gehe zu: https://supabase.com/
2. Klicke auf **"Start your project"**
3. Erstelle kostenlosen Account (GitHub/Email)
4. Erstelle neues Projekt:
   - **Name:** timax (oder beliebig)
   - **Database Password:** Wähle sicheres Passwort (speichern!)
   - **Region:** Wähle **EU-Region** (z.B. Frankfurt) für DSGVO
   - **Pricing Plan:** Free
5. Warte bis Projekt erstellt ist (~2 Minuten)

### API Keys kopieren:

1. Gehe zu: **Project Settings** → **API**
2. Kopiere:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **service_role key** (Secret Key, nicht anon key!)

### Storage Bucket erstellen:

1. Gehe zu: **Storage** (im linken Menü)
2. Klicke auf **"New bucket"**
3. Name: `uploads`
4. **Wichtig:** 
   - ✅ **Private** (nicht Public!)
   - ✅ **File size limit:** 100MB (oder mehr)
5. Klicke auf **"Create bucket"**

### Environment Variables hinzufügen:

```bash
# In my-app/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=dein_service_role_key_hier
SUPABASE_STORAGE_BUCKET=uploads
```

**⚠️ WICHTIG:** 
- `SUPABASE_SERVICE_ROLE_KEY` ist **geheim** - niemals im Client-Code verwenden!
- Nur in Server-side Code (API Routes) verwenden!

---

## ✅ Testen

### Virus-Scanning testen:

1. Lade eine Datei hoch
2. Prüfe Console-Logs:
   - Bei erfolgreichem Scan: `"Datei ist sauber"`
   - Bei Limit erreicht: `"Virus-Scan Limit erreicht"`

### Storage testen:

1. Lade eine Datei hoch
2. Prüfe Response:
   ```json
   {
     "success": true,
     "storageUrl": "https://...",
     "storagePath": "uploads/1234567890-datei.mp3"
   }
   ```
3. Prüfe Supabase Dashboard:
   - Gehe zu **Storage** → **uploads**
   - Datei sollte sichtbar sein

---

## ⚠️ Limits & Hinweise

### VirusTotal Free Tier:
- **4 Scans/Tag** - für MVP ausreichend
- Bei mehr Traffic: ClamAV selbstgehostet (kostenlos, aber braucht Server)
- **Aktuelles Verhalten:** Wenn Limit erreicht, wird Upload trotzdem erlaubt (für MVP)

### Supabase Storage Free Tier:
- **1GB Storage** - für MVP ausreichend
- **2GB Bandwidth/Monat** - für MVP ausreichend
- Bei mehr Storage: Upgrade nötig ($25/Monat für 100GB)

### DSGVO:
- ✅ Supabase: EU-Region gewählt
- ✅ Private Access: Dateien nicht öffentlich
- ✅ Retention Policy: Kann mit Cleanup-Job durchgesetzt werden

---

## 🚨 Troubleshooting

### VirusTotal API Key nicht erkannt:
- Prüfe `.env.local` Datei
- Prüfe ob Variable `VIRUSTOTAL_API_KEY` heißt
- Restart Dev-Server

### Supabase Storage Upload fehlschlägt:
- Prüfe ob `SUPABASE_SERVICE_ROLE_KEY` korrekt ist (nicht anon key!)
- Prüfe ob Bucket `uploads` existiert
- Prüfe ob Bucket **Private** ist
- Prüfe Console-Logs für Fehlermeldungen

### Dateien nicht sichtbar in Supabase:
- Prüfe ob Upload erfolgreich war (Response `storageUrl`)
- Prüfe Bucket-Name in `.env.local`
- Prüfe ob Datei wirklich hochgeladen wurde (Storage → uploads)

---

## 📝 Nächste Schritte

Nach Setup:
1. ✅ Teste Upload mit Virus-Scanning
2. ✅ Teste Storage-Upload
3. ✅ Prüfe Supabase Dashboard
4. ✅ Implementiere Cleanup-Job (siehe `src/app/api/cron/cleanup/route.ts`)


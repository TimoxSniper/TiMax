# 💰 Kostenlose Implementierung - Upload-System

**Datum:** 29. Januar 2026  
**Entscheidung:** Immer kostenlose Optionen wählen

---

## ✅ Gewählte kostenlose Optionen

### 3.2 Virus Scanning
**Option:** VirusTotal Free Tier
- ✅ **4 Scans/Tag** - kostenlos, dauerhaft
- ✅ Keine Kreditkarte nötig
- ✅ Einfach zu implementieren
- ⚠️ Limit: 4 Scans/Tag (für MVP ausreichend)

**Alternative (später):**
- ClamAV selbstgehostet (komplett kostenlos, aber braucht Server)

---

### 3.3 File Storage
**Option:** Supabase Storage Free Tier
- ✅ **1GB Storage** - kostenlos, dauerhaft
- ✅ EU-Region verfügbar (DSGVO-konform)
- ✅ Private Access (nicht öffentlich)
- ✅ Einfach zu integrieren
- ✅ Kann später für Auth/DB genutzt werden

**Limits:**
- 1GB Storage (kostenlos)
- 2GB Bandwidth/Monat (kostenlos)
- Für MVP ausreichend

**Alternative (wenn mehr Storage nötig):**
- AWS S3 Free Tier: 5GB für 12 Monate (nicht dauerhaft kostenlos)

---

### 3.5 Processing Status
**Option:** Später implementieren
- ✅ Keine externen Services nötig
- ✅ Nur Code-Implementierung
- ✅ Benötigt n8n Callbacks (siehe Abschnitt 4.1)

---

## 📋 Implementierungsplan

### Schritt 1: Supabase Storage Setup
1. Supabase Account erstellen (kostenlos)
2. Neues Projekt anlegen
3. Storage Bucket erstellen
4. API Keys kopieren

### Schritt 2: VirusTotal Free Tier Setup
1. VirusTotal Account erstellen (kostenlos)
2. API Key generieren
3. Free Tier nutzen (4 Scans/Tag)

### Schritt 3: Code-Implementierung
1. Supabase Storage Integration
2. VirusTotal API Integration (mit Rate Limiting für Free Tier)
3. Upload-Flow anpassen

---

## ⚠️ Wichtige Hinweise

### VirusTotal Free Tier Limits:
- **4 Scans/Tag** - für MVP ausreichend
- Bei mehr Traffic: ClamAV selbstgehostet (kostenlos, aber braucht Server)

### Supabase Storage Limits:
- **1GB Storage** - für MVP ausreichend
- Bei mehr Storage: Upgrade nötig ($25/Monat für 100GB)

### DSGVO:
- ✅ Supabase Storage: EU-Region verfügbar
- ✅ Private Access: Dateien nicht öffentlich
- ✅ Retention Policy: Kann mit Cleanup-Job durchgesetzt werden

---

## 🚀 Nächste Schritte

1. Supabase Account erstellen
2. VirusTotal Account erstellen
3. Code-Implementierung starten


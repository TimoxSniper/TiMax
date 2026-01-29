# 🎯 Entscheidungen für Upload-System (3.2, 3.3, 3.5)

**Datum:** 29. Januar 2026  
**Status:** Benötigt deine Entscheidung

---

## 📋 Aktuelle Situation

**Was bereits funktioniert:**
- ✅ Dateien werden direkt an n8n Webhook gesendet
- ✅ Client-side & Server-side Validierung vorhanden
- ✅ Upload Progress Tracking (Client-side)

**Was fehlt:**
- ❌ Dateien werden nicht persistent gespeichert (gehen direkt zu n8n)
- ❌ Kein Virus-Scanning
- ❌ Kein Processing-Status (uploaded → transcribing → complete)

---

## 🔴 3.2 Virus Scanning - DEINE ENTSCHEIDUNG

### Option A: VirusTotal API (EMPFOHLEN für Start)
**Vorteile:**
- ✅ Einfach zu implementieren (4-6 Stunden)
- ✅ Keine eigene Infrastruktur nötig
- ✅ Sehr gute Erkennungsrate (60+ Scanner)
- ✅ Pay-as-you-go Pricing

**Nachteile:**
- ⚠️ Kosten: ~$0.01 pro Scan (bei 1000 Uploads/Monat = $10)
- ⚠️ Dateien werden an VirusTotal gesendet (Privacy-Bedarf)

**Kosten:**
- Free Tier: 4 Scans/Tag
- Paid: $0.01 pro Scan

**Implementierung:**
```bash
npm install virustotal-api
```

**Meine Empfehlung:** ✅ **Option A (VirusTotal)** für MVP, später auf ClamAV umstellen wenn Traffic steigt

---

### Option B: ClamAV (selbst hosten)
**Vorteile:**
- ✅ Kostenlos (Open Source)
- ✅ Dateien bleiben bei dir (Privacy)
- ✅ Keine API-Limits

**Nachteile:**
- ⚠️ Eigene Infrastruktur nötig (Server, Updates)
- ⚠️ Komplexer Setup (8-12 Stunden)
- ⚠️ Wartungsaufwand

**Kosten:**
- Server: ~$10-20/Monat (VPS)
- Wartung: Regelmäßige Updates nötig

**Meine Empfehlung:** 🟡 **Später**, wenn Traffic hoch ist (>1000 Uploads/Tag)

---

### Option C: AWS S3 Malware Protection
**Vorteile:**
- ✅ Integriert in AWS S3 (wenn du S3 nutzt)
- ✅ Automatisch

**Nachteile:**
- ⚠️ Nur wenn du AWS S3 nutzt
- ⚠️ Zusätzliche Kosten

**Meine Empfehlung:** 🟡 **Nur wenn du S3 nutzt**

---

## 🔴 3.3 File Storage Strategy - DEINE ENTSCHEIDUNG

**Aktuell:** Dateien gehen direkt zu n8n, werden nicht gespeichert.

**Problem:** 
- Wenn n8n die Datei verliert = Datenverlust
- Keine Möglichkeit Dateien später zu löschen
- DSGVO: Du musst Dateien löschen können!

---

### Option A: Vercel Blob Storage (EMPFOHLEN)
**Vorteile:**
- ✅ Einfach zu integrieren (3-4 Stunden)
- ✅ EU-Region verfügbar (DSGVO)
- ✅ Private Access (nicht öffentlich)
- ✅ Automatische Backups
- ✅ CDN-backed
- ✅ Perfekt für Vercel-Deployment

**Nachteile:**
- ⚠️ Vendor-Lock-in zu Vercel
- ⚠️ Kosten: $0.15/GB Storage, $0.10/GB Transfer

**Kosten (Beispiel):**
- 100 GB Storage: $15/Monat
- 500 GB Transfer: $50/Monat
- **Total: ~$65/Monat bei mittlerem Traffic**

**Implementierung:**
```bash
npm install @vercel/blob
```

**Meine Empfehlung:** ✅ **Option A (Vercel Blob)** - Perfekt für Start, einfach zu nutzen

---

### Option B: AWS S3 (eu-central-1)
**Vorteile:**
- ✅ Sehr günstig
- ✅ EU-Region (Frankfurt)
- ✅ Sehr skalierbar
- ✅ Malware Protection verfügbar

**Nachteile:**
- ⚠️ Komplexer Setup (5-6 Stunden)
- ⚠️ Mehr Konfiguration nötig
- ⚠️ AWS Account nötig

**Kosten (Beispiel):**
- 100 GB Storage: $2.30/Monat
- 500 GB Transfer: $45/Monat
- **Total: ~$47/Monat**

**Implementierung:**
```bash
npm install @aws-sdk/client-s3
```

**Meine Empfehlung:** 🟡 **Option B (AWS S3)** - Wenn du Kosten optimieren willst und mehr Kontrolle brauchst

---

### Option C: Supabase Storage (wenn du Supabase nutzt)
**Vorteile:**
- ✅ All-in-One (Auth + DB + Storage)
- ✅ EU-Region verfügbar
- ✅ Einfach zu nutzen

**Nachteile:**
- ⚠️ Nur wenn du Supabase für Auth/DB nutzt
- ⚠️ Kosten: $25/Monat für Pro Plan

**Meine Empfehlung:** 🟡 **Option C (Supabase)** - Nur wenn du Supabase bereits nutzt

---

## 🟡 3.5 Upload Progress Tracking (Processing Status)

**Aktuell:** Upload-Progress funktioniert (0-100%), aber Processing-Status fehlt.

**Was fehlt:**
- Status: `uploaded → transcribing → complete`
- Estimated Time Remaining
- Abbrechen-Button

**Problem:** Benötigt n8n Callbacks (siehe Abschnitt 4.1 in Checkliste)

**Meine Empfehlung:** 
- ✅ **Später implementieren** (wenn n8n Callbacks vorhanden sind)
- ✅ **Nicht kritisch für MVP** - User sieht "Upload erfolgreich", Processing passiert im Hintergrund

---

## 🎯 KOSTENLOSE OPTIONEN (Entscheidung: Immer kostenlos)

### ✅ Entscheidung getroffen: Kostenlose Varianten

1. **3.2 Virus Scanning:**
   - ✅ **VirusTotal Free Tier** (4 Scans/Tag) - kostenlos, dauerhaft
   - ✅ Für MVP ausreichend
   - ✅ Später auf ClamAV umstellen wenn Traffic steigt (auch kostenlos, aber braucht Server)

2. **3.3 File Storage:**
   - ✅ **Supabase Storage Free Tier** (1GB Storage) - kostenlos, dauerhaft
   - ✅ EU-Region verfügbar (DSGVO)
   - ✅ Einfach zu integrieren
   - ✅ All-in-One (kann später für Auth/DB genutzt werden)

3. **3.5 Processing Status:**
   - ✅ **Später** (wenn n8n Callbacks implementiert sind)
   - ✅ Keine externen Services nötig (nur Code)

---

## 📝 Nächste Schritte

**Sag mir einfach:**

1. **Virus Scanning:** 
   - [ ] A) VirusTotal API (empfohlen)
   - [ ] B) ClamAV (später)
   - [ ] C) Erstmal weglassen (nicht empfohlen)

2. **File Storage:**
   - [ ] A) Vercel Blob Storage (empfohlen)
   - [ ] B) AWS S3
   - [ ] C) Supabase Storage
   - [ ] D) Erstmal weglassen (nicht empfohlen - DSGVO-Problem!)

3. **Processing Status:**
   - [ ] A) Jetzt implementieren (benötigt n8n Callbacks)
   - [ ] B) Später (empfohlen für MVP)

---

## ⚠️ WICHTIG: DSGVO

**Ohne File Storage kannst du:**
- ❌ Dateien nicht löschen (DSGVO-Verstoß!)
- ❌ Keine Retention Policy durchsetzen
- ❌ Keine Kontrolle über Dateien

**Deshalb:** File Storage (3.3) ist **KRITISCH** für Launch!


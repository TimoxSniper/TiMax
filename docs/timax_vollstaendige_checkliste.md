# 🚀 timax.vercel.app - Vollständige Launch-Checkliste
**Stand:** 29. Januar 2026  
**Aktualisiert:** 29. Januar 2026 (Rechtliche Seiten implementiert)  
**Next.js Version:** 16 ✅  
**Status:** Pre-Launch / Beta Phase

> **Wichtig:** Diese Checkliste enthält ALLE identifizierten Fehler, Sicherheitsprobleme, fehlende Features und Optimierungen, die vor dem Launch implementiert werden sollten.

> ✅ **VERIFIKATION DURCHGEFÜHRT:** Diese Checkliste wurde am 29. Januar 2026 mit dem tatsächlichen Code abgeglichen. Die folgenden Features sind bereits implementiert und wurden als ✅ markiert:
> - Sentry Error Tracking (vollständig)
> - Toast Notifications (vollständig)
> - Error Boundary (vorhanden)
> - n8n Webhook-Integration Next.js → n8n (funktioniert)
> - File Upload UI mit Progress Tracking (vorhanden)
> - Environment Variable Validation mit Zod (vorhanden)
> - Dark Mode (vorhanden)
> - ✅ **Rechtliche Seiten (1.1-1.5) - IMPLEMENTIERT:** Impressum, Datenschutz, AGB, Widerruf, Cookies + Cookie-Consent Banner
> 
> **Zeitschätzungen wurden entsprechend reduziert:** MVP von 80-110h auf 60-80h, empfohlener Launch von 140-200h auf 120-160h.

---

## 📊 Status-Übersicht

| Kategorie | Status | Priorität | Fortschritt |
|-----------|--------|-----------|-------------|
| Rechtliche Dokumente | ⚠️ Seiten vorhanden, Daten ausfüllen | 🔴 KRITISCH | 90% |
| Sicherheit | ✅ Großteils implementiert | 🔴 KRITISCH | 85% |
| Frontend/UX | ✅ Gut vorhanden | 🟠 HOCH | 60% |
| Backend/API | ⚠️ Teilweise | 🟠 HOCH | 50% |
| Upload-Funktionalität | ⚠️ Basic vorhanden | 🔴 KRITISCH | 40% |
| KI-Integration | ⚠️ Webhooks vorhanden, Callbacks fehlen | 🔴 KRITISCH | 50% |
| Authentication | ❌ Fehlt | 🔴 KRITISCH | 0% |
| Database | ❌ Fehlt komplett | 🟠 HOCH | 0% |
| Testing | ❌ Keine Tests | 🟠 HOCH | 0% |
| Monitoring | ⚠️ Sentry vorhanden, Analytics fehlt | 🟠 HOCH | 50% |

---

## 🔴 KRITISCHE BLOCKER (Must-Fix vor Launch)

### 1. Rechtliche Anforderungen

#### 1.1 Impressum (§5 TMG)
- **Status:** ✅ **SEITE ERSTELLT, DATEN AUSFÜLLEN ERFORDERLICH**
- **Risiko:** Abmahnung bis 50.000€ Bußgeld
- **Zeitaufwand:** ✅ Implementierung erledigt, Daten ausfüllen: 15-30 Min
- **Muss enthalten:**
  - [ ] Vollständiger Name / Firmenname + Rechtsform ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [ ] Vollständige Anschrift (kein Postfach!) ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [x] E-Mail-Adresse ✅ (info@timax.app)
  - [ ] Telefonnummer ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [ ] Handelsregister-Nr. (bei GmbH/UG) ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [ ] Umsatzsteuer-ID (wenn vorhanden) ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [ ] Vertretungsberechtigte Person(en) ⚠️ **PLATZHALTER - AUSFÜLLEN!**
  - [ ] Zuständige Aufsichtsbehörde (wenn relevant) ⚠️ **PLATZHALTER - AUSFÜLLEN!**
- **Implementierung:**
  ```bash
  ✅ app/impressum/page.tsx - ERSTELLT
  ✅ Footer-Links hinzugefügt auf allen Seiten
  ```
- **⚠️ WICHTIG:** Seite ist erstellt, aber Platzhalter müssen mit echten Firmendaten ausgefüllt werden!

#### 1.2 Datenschutzerklärung (DSGVO Art. 13)
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Muss enthalten:**
  - [x] Name und Kontakt des Verantwortlichen ✅ (mit Platzhalter für Firmendaten)
  - [x] Datenschutzbeauftragter (bei >20 Mitarbeitern) ✅
  - [x] Welche Daten werden erhoben (Uploads, User-Daten, Cookies) ✅
  - [x] Rechtsgrundlage der Verarbeitung (Art. 6 DSGVO) ✅
  - [x] Zweck der Datenverarbeitung ✅
  - [x] Speicherdauer (wichtig für Videos/Audios!) ✅ (7 Tage Uploads, 90 Tage Transkripte)
  - [x] Weitergabe an Dritte (KI-APIs!) ✅ (OpenAI, Anthropic, n8n, Vercel)
  - [x] Cookies & Tracking ✅ (mit Link zu Cookie-Richtlinie)
  - [x] Rechte der Betroffenen: ✅
    - Auskunftsrecht (Art. 15 DSGVO) ✅
    - Recht auf Berichtigung (Art. 16) ✅
    - Recht auf Löschung (Art. 17) ✅
    - Recht auf Datenübertragbarkeit (Art. 20) ✅
    - Widerspruchsrecht (Art. 21) ✅
  - [x] Beschwerderecht bei Aufsichtsbehörde ✅
  - [x] Hinweis auf automatisierte Entscheidungsfindung (KI!) ✅
- **Kritische Punkte für timax:**
  - Wie lange werden hochgeladene Videos gespeichert?
  - Wo werden Transkripte gespeichert?
  - Welche KI-APIs werden verwendet (OpenAI/Anthropic)?
  - Datenverarbeitung in EU oder USA?
  - Auftragsverarbeitungsvertrag mit KI-Providern vorhanden?
- **Tools:**
  - https://www.e-recht24.de/datenschutzerklaerung-generator.html
  - https://datenschutz-generator.de/

#### 1.3 Cookie-Consent Banner
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Anforderungen:**
  - [x] Opt-in VOR Cookie-Setzung (außer technisch notwendige) ✅
  - [x] Granulare Auswahl (Notwendig, Funktional, Analytics) ✅
  - [x] Widerruf jederzeit möglich ✅ (Einstellungen-Button)
  - [x] Dokumentation der Einwilligung ✅ (LocalStorage)
  - [x] Cookie-Liste mit Zweck und Laufzeit ✅ (auf /cookies Seite)
- **Implementierung:**
  ```bash
  ✅ components/layout/cookie-consent.tsx - ERSTELLT
  ✅ Im Root Layout integriert
  ✅ LocalStorage für Präferenzen
  ✅ Links zu Datenschutz und Cookie-Richtlinie
  ```

#### 1.4 AGB (Allgemeine Geschäftsbedingungen)
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Muss enthalten:**
  - [x] Leistungsumfang (Was bietet timax genau?) ✅
  - [x] Vertragsschluss & Widerruf (bei B2C: 14 Tage Widerrufsrecht!) ✅ (mit Link zu Widerruf)
  - [x] Preise & Zahlungsbedingungen ✅ (mit Platzhalter)
  - [x] Nutzungsrechte (Wem gehören die generierten Texte?) ✅
  - [x] Haftungsausschluss (BESONDERS für KI-generierte Inhalte!) ✅ (ausführlich!)
  - [x] Upload-Beschränkungen (Größe, Format, Anzahl) ✅ (100MB, MP3/MP4/WAV/M4A/WebM)
  - [x] Verbotene Inhalte (Urheberrechtsverletzungen, illegale Inhalte) ✅
  - [x] Kündigung & Account-Löschung ✅
  - [x] Änderungsvorbehalt der AGB ✅
  - [x] Gerichtsstand & anwendbares Recht ✅
- **Kritische Klauseln für timax:**
  ```markdown
  ## Nutzungsrechte an generierten Inhalten
  Der Nutzer behält alle Rechte an hochgeladenen Inhalten.
  Die KI-generierten Texte stehen dem Nutzer zur freien Verwendung zur Verfügung.
  timax erhebt keine Rechte an generierten Inhalten.
  
  ## Haftungsbeschränkung für KI-Inhalte
  KI-generierte Texte können Fehler, Ungenauigkeiten oder Halluzinationen enthalten.
  Der Nutzer ist verpflichtet, alle generierten Inhalte vor Veröffentlichung zu überprüfen.
  timax haftet nicht für Schäden durch fehlerhafte KI-Generierungen.
  ```

#### 1.5 Widerrufsbelehrung (bei kostenpflichtigem Service)
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Muss enthalten:**
  - [x] 14-Tage Widerrufsrecht ✅
  - [x] Ausnahmen (bereits konsumierte Dienstleistungen) ✅ (digitale Inhalte)
  - [x] Widerrufsformular ✅ (Musterformular enthalten)
  - [x] Folgen des Widerrufs (Rückzahlung) ✅

---

### 2. Sicherheit - Kritische Lücken

#### 2.1 Security Headers
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Implementiert:**
  - ✅ `next.config.ts` mit allen Security Headers
  - ✅ X-DNS-Prefetch-Control
  - ✅ Strict-Transport-Security
  - ✅ X-Frame-Options
  - ✅ X-Content-Type-Options
  - ✅ X-XSS-Protection
  - ✅ Referrer-Policy
  - ✅ Permissions-Policy
- **Testen:**
  - https://securityheaders.com/
  - https://observatory.mozilla.org/

#### 2.2 Content Security Policy (CSP)
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Implementiert:**
  - ✅ `src/middleware.ts` mit CSP und Nonce-Support
  - ✅ Nonce-basierte Script/Style Validierung
  - ✅ Strict CSP Policy für alle Routes
  - ✅ Sentry und Vercel Domains erlaubt
  - ✅ Upgrade-Insecure-Requests aktiviert

#### 2.3 Rate Limiting
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Implementiert:**
  - ✅ `src/middleware.ts` mit In-Memory Rate Limiting
  - ✅ Upload-Endpunkte (5 Uploads/Stunde pro IP) ✅
  - ✅ Chat-API (20 Requests/Minute) ✅
  - ✅ Generierung-API (10 Requests/Stunde) ✅
  - ✅ Default Rate Limit (100 Requests/Minute) ✅
  - ✅ Rate Limit Headers (X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After)
  - ⚠️ **Hinweis:** Für Production sollte Redis verwendet werden (aktuell In-Memory)

#### 2.4 Input Validation & Sanitization
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Implementiert:**
  - ✅ `src/lib/validation.ts` mit Zod Schemas
  - ✅ File Uploads (Typ, Größe, Name, Magic Bytes) ✅
  - ✅ User Inputs (Chat Messages mit Sanitization) ✅
  - ✅ API Parameters (Zod Validation) ✅
  - ✅ Filename Validation (keine Path Traversal) ✅
  - ✅ XSS Protection (Sanitization von User Inputs) ✅
  - ✅ Magic Bytes Validierung für Dateitypen ✅

#### 2.5 CSRF Protection
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Implementiert:**
  - ✅ `src/lib/csrf.ts` mit Token-Generierung und Validierung
  - ✅ `src/app/api/csrf-token/route.ts` für Token-Endpoint
  - ✅ CSRF Token Validation in `/api/upload` ✅
  - ✅ CSRF Token Validation in `/api/chat` ✅
  - ✅ HMAC-basierte Token-Signierung
  - ✅ Timing-safe Token-Vergleich

#### 2.6 Environment Variables Security
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Bereits vorhanden:**
  - ✅ `src/lib/env.ts` mit Zod Schema
  - ✅ `validateRequiredEnv()` für API Routes
  - ✅ Type-safe Environment Variables
  - ✅ Validation beim Start
- **Checklist:**
  - [x] Alle Secrets in Vercel Environment Variables ✅
  - [x] Niemals im Code hardcoded ✅
  - [ ] .env.local in .gitignore (zu prüfen)
  - [ ] Unterschiedliche Keys für Production/Preview/Dev (zu prüfen)
  - [x] Validation beim Start ✅

---

### 3. Upload & File-Handling - Sicherheitslücken

#### 3.1 File Upload Restrictions
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT** (Server-side Validierung vorhanden)
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Bereits vorhanden (Client-side):**
  - ✅ `components/upload/file-upload.tsx`:
    - ✅ Max File Size: 100MB
    - ✅ Allowed Types: MP3, MP4, WAV, M4A, WebM
    - ✅ Client-side Validierung
    - ✅ Upload Progress Tracking
- **Implementiert (Server-side):**
  - ✅ `src/lib/upload-config.ts` - Zentrale Upload-Konfiguration
  - ✅ `src/lib/validation.ts` - Nutzt zentrale Konfiguration
  - ✅ `src/app/api/upload/route.ts` - Server-side Validierung
- **Validierungen (Server-side in `/api/upload/route.ts`):**
  - [x] Dateigröße ✅ (100MB, zentrale Konfiguration)
  - [x] MIME-Type ✅ (zentrale Konfiguration)
  - [x] File Extension ✅ (zentrale Konfiguration)
  - [x] Magic Bytes ✅ (echte Dateityp-Erkennung vorhanden)
  - [ ] Video/Audio-Duration ⚠️ (Konfiguration vorhanden, aber Validierung benötigt Media-Metadaten-Extraktion - optional)

#### 3.2 Virus Scanning
- **Status:** ❌ **NICHT IMPLEMENTIERT** (auf Wunsch entfernt)
- **Risiko:** MALWARE-VERBREITUNG
- **Zeitaufwand:** 4-6 Stunden
- **Dringlichkeit:** 🔴 EXTREM KRITISCH
- **Optionen:**
  1. **ClamAV** (Open Source, selbst hosten)
  2. **VirusTotal API** (Cloud, einfach)
  3. **AWS S3 Malware Protection**
- **Empfehlung:**
  ```bash
  npm install clamav.js
  # oder
  npm install virustotal-api
  ```
- **Flow:**
  1. User lädt Datei hoch
  2. Temporär speichern
  3. Virus-Scan durchführen
  4. Bei sauber: In Storage verschieben
  5. Bei Malware: Datei löschen, User benachrichtigen

#### 3.3 File Storage Strategy
- **Status:** ❌ **NICHT IMPLEMENTIERT** (auf Wunsch entfernt)
- **Risiko:** Datenverlust, Datenleck, DSGVO-Verstoß
- **Zeitaufwand:** 3-4 Stunden
- **Aktuell:** Dateien gehen direkt zu n8n, werden nicht gespeichert
- **Empfohlene Lösung: Vercel Blob Storage**
  ```bash
  npm install @vercel/blob
  ```
- **Features:**
  - Private Access (wichtig!)
  - EU-Region wählbar (DSGVO)
  - CDN-backed
  - Automatische Backups
- **Alternative:** AWS S3 (eu-central-1)
- **Wichtig:**
  - [ ] Private Access (nicht öffentlich!)
  - [ ] EU-Region (DSGVO)
  - [ ] Verschlüsselung at rest
  - [ ] Zugriffskontrolle (nur Owner sieht Dateien)
  - [ ] Signed URLs für Downloads

#### 3.4 File Cleanup & Retention Policy
- **Status:** ✅ **KONFIGURATION & CRON-JOB-STRUKTUR ERSTELLT** (benötigt Database-Integration)
- **Risiko:** ⚠️ Konfiguration vorhanden, aber noch nicht aktiv (benötigt Database)
- **Zeitaufwand:** ✅ Struktur erledigt (2-3 Stunden), Database-Integration noch offen
- **Implementiert:**
  - ✅ `src/lib/upload-config.ts` - RETENTION_POLICY definiert
  - ✅ `src/app/api/cron/cleanup/route.ts` - Cron-Job-Endpoint erstellt
  - ✅ `vercel.json` - Cron-Job-Konfiguration (täglich um 2 Uhr)
- **Retention Policy definiert:**
  ```typescript
  // Löschregeln:
  // - Uploads ohne Transkript: 7 Tage ✅
  // - Fertige Transkripte: 90 Tage ohne Aktivität ✅
  // - Gelöschte Accounts: SOFORT alle Daten löschen ✅
  // - User kann jederzeit manuell löschen ✅
  ```
- **Noch zu implementieren:**
  - [ ] Database-Integration in `/api/cron/cleanup/route.ts` (siehe Code-Kommentare)
  - [ ] Storage-Integration (Vercel Blob/S3) für Datei-Löschung
  - [ ] Testing des Cleanup-Jobs

#### 3.5 Upload Progress Tracking
- **Status:** ✅ **CLIENT-SIDE VOLLSTÄNDIG, SERVER-SIDE FEHLT**
- **Risiko:** ✅ Client-side abgedeckt, aber Processing-Status fehlt
- **Zeitaufwand:** 1-2 Stunden (reduziert)
- **Bereits vorhanden:**
  - ✅ Upload Progress Bar (0-100%) - XMLHttpRequest mit Progress Events
  - ✅ Error Handling in UI
  - ✅ Success/Error States
- **Noch zu implementieren:**
  - [ ] Processing Status (uploaded → transcribing → complete) - benötigt n8n Callbacks
  - [ ] Estimated Time Remaining
  - [ ] Abbrechen-Button (für laufende Uploads)

#### 3.6 Chunked Upload (für große Dateien)
- **Status:** ✅ **IMPLEMENTIERT** (optional, für zukünftige Erweiterung)
- **Risiko:** ✅ Abgedeckt (aktuell nicht benötigt, da maxFileSize 100MB)
- **Zeitaufwand:** ✅ Erledigt
- **Dringlichkeit:** 🟡 OPTIONAL (aktuell nicht benötigt, da maxFileSize 100MB)
- **Implementiert:**
  - ✅ `src/lib/chunked-upload.ts` - Chunked Upload Utilities
  - ✅ 5MB Chunks konfiguriert
  - ✅ Upload-Metadaten-Tracking
  - ✅ Progress-Tracking für Chunks
- **Hinweis:** Aktuell optional, da maxFileSize bei 100MB liegt. Für zukünftige Erweiterung auf größere Dateien vorbereitet.
- **Noch zu implementieren (wenn benötigt):**
  - [ ] `/api/upload/chunk` - Endpoint für Chunk-Uploads
  - [ ] `/api/upload/chunk/finalize` - Endpoint für Chunk-Zusammenführung
  - [ ] Resumable Uploads (Chunk-Wiederaufnahme bei Fehler)

---

### 4. KI-Integration via n8n - Zu implementieren

> ✅ **WICHTIG:** KI läuft bei dir über n8n Workflows, NICHT direkt über API-Calls im Next.js Code!

#### 4.1 n8n Webhook-Integration
- **Status:** ⚠️ **TEILWEISE IMPLEMENTIERT** (Webhooks → n8n vorhanden, Callbacks fehlen)
- **Risiko:** Kern-Feature funktioniert, aber Status-Updates fehlen
- **Zeitaufwand:** 4-6 Stunden (reduziert, da Webhooks bereits vorhanden)
- **Bereits vorhanden:**
  - ✅ `/api/upload/route.ts` - Upload zu n8n Webhook funktioniert
  - ✅ `/api/chat/route.ts` - Chat zu n8n Webhook funktioniert
  - ✅ `src/mcp/n8n-server.ts` - MCP Server für n8n API Management
  - ✅ Environment Variable Validation für n8n URLs (`lib/env.ts`)
- **Noch zu implementieren:**
- **Architecture:**
  ```
  Next.js App → Webhook → n8n Workflow → KI APIs → Webhook zurück → Next.js
  ```

**Next.js → n8n Communication:**
```typescript
// lib/n8n-client.ts
export async function triggerN8NWorkflow({
  workflowName,
  payload,
  webhookUrl,
}: {
  workflowName: 'transcription' | 'generation' | 'chat'
  payload: any
  webhookUrl: string
}) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Workflow-Auth': process.env.N8N_WEBHOOK_SECRET!, // Wichtig!
      },
      body: JSON.stringify({
        workflowName,
        userId: payload.userId,
        requestId: crypto.randomUUID(), // Für Tracking
        timestamp: new Date().toISOString(),
        data: payload,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`n8n workflow failed: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('n8n workflow error:', error)
    throw error
  }
}
```

**Zu implementieren:**
- [x] n8n Webhook URLs in Environment Variables ✅
- [ ] Webhook Authentication/Signing (HMAC)
- [ ] Request-ID Tracking (für Status-Polling)
- [ ] Error Handling bei n8n-Ausfällen (verbessern)
- [ ] Retry-Logik für fehlgeschlagene Webhooks
- [ ] Timeout Handling (lange Prozesse)
- [ ] **KRITISCH:** Callback-Endpunkte für n8n → Next.js (`/api/webhooks/n8n/transcription/route.ts`, `/api/webhooks/n8n/generation/route.ts`)

#### 4.2 Transkriptions-Workflow (via n8n)
- **Status:** ⚠️ UNKLAR OB N8N-WORKFLOW EXISTIERT
- **Risiko:** Kern-Feature fehlt!
- **Zeitaufwand:** 4-6 Stunden (Next.js Integration)
- **n8n Workflow sollte haben:**
  - Webhook Trigger (von Next.js)
  - File Download (von Blob URL)
  - Video → Audio Extraktion (falls Video)
  - Whisper API Call
  - Ergebnis speichern
  - Webhook zurück zu Next.js

**Next.js Integration:**
```typescript
// app/api/transcribe/route.ts
export async function POST(request: NextRequest) {
  const { uploadId, blobUrl } = await request.json()
  const session = await getSession()
  
  // 1. Update Status: Processing
  await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'PROCESSING' },
  })
  
  // 2. Trigger n8n Workflow
  try {
    await triggerN8NWorkflow({
      workflowName: 'transcription',
      webhookUrl: process.env.N8N_TRANSCRIPTION_WEBHOOK_URL!,
      payload: {
        userId: session.user.id,
        uploadId,
        blobUrl,
        language: 'de', // oder auto-detect
      },
    })
    
    return NextResponse.json({
      success: true,
      status: 'processing',
      uploadId,
    })
  } catch (error) {
    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'FAILED' },
    })
    throw error
  }
}
```

**n8n Callback Endpoint:**
```typescript
// app/api/webhooks/n8n/transcription/route.ts
export async function POST(request: NextRequest) {
  // 1. Verify Webhook Signature
  const signature = request.headers.get('x-n8n-signature')
  if (!verifyN8NSignature(signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const { uploadId, transcript, segments, duration, error } = await request.json()
  
  // 2. Handle Success
  if (transcript) {
    await prisma.transcript.create({
      data: {
        uploadId,
        text: transcript,
        segments,
        duration,
        language: 'de',
        userId: session.user.id,
      },
    })
    
    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'COMPLETE' },
    })
    
    // 3. Notify User (Email, Notification, etc.)
    await notifyUser(uploadId, 'transcription_complete')
    
    return NextResponse.json({ received: true })
  }
  
  // 4. Handle Error
  if (error) {
    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'FAILED', errorMessage: error },
    })
    
    return NextResponse.json({ received: true })
  }
}
```

**Wichtige Sicherheits-Maßnahmen:**
- [ ] Webhook Signature Verification (HMAC)
- [ ] IP Whitelisting (nur n8n Server)
- [ ] Request-ID Validation
- [ ] Idempotency (doppelte Webhooks abfangen)

#### 4.3 Textgenerierungs-Workflow (via n8n)
- **Status:** ⚠️ UNKLAR OB N8N-WORKFLOW EXISTIERT
- **Risiko:** Kern-Feature fehlt!
- **Zeitaufwand:** 4-6 Stunden (Next.js Integration)

**n8n Workflow sollte haben:**
- Webhook Trigger
- Transkript laden
- Prompt Building
- Claude API Call
- Response Processing
- Webhook zurück

**Next.js Integration:**
```typescript
// app/api/generate/route.ts
export async function POST(request: NextRequest) {
  const { transcriptId, format, length, tone, customPrompt } = await request.json()
  const session = await getSession()
  
  // 1. Get Transcript
  const transcript = await prisma.transcript.findUnique({
    where: { id: transcriptId },
  })
  
  if (!transcript) {
    return NextResponse.json({ error: 'Transcript not found' }, { status: 404 })
  }
  
  // 2. Check Usage Limits
  const usage = await checkUserUsageLimits(session.user.id)
  if (usage.aiGenerations >= usage.limits.aiGenerations) {
    return NextResponse.json(
      { error: 'Generation limit reached' },
      { status: 429 }
    )
  }
  
  // 3. Trigger n8n Workflow
  const requestId = crypto.randomUUID()
  await triggerN8NWorkflow({
    workflowName: 'generation',
    webhookUrl: process.env.N8N_GENERATION_WEBHOOK_URL!,
    payload: {
      userId: session.user.id,
      requestId,
      transcriptId,
      transcriptText: transcript.text,
      format,
      length,
      tone,
      customPrompt,
    },
  })
  
  return NextResponse.json({
    success: true,
    requestId,
    status: 'processing',
  })
}
```

**Für Streaming (optional aber empfohlen):**
```typescript
// app/api/generate/stream/route.ts
export async function POST(request: NextRequest) {
  const { transcriptId, format } = await request.json()
  
  // Server-Sent Events für Streaming
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // 1. Trigger n8n mit SSE-Callback URL
      const sseCallbackUrl = `${process.env.NEXT_PUBLIC_URL}/api/sse/${requestId}`
      
      // 2. n8n sendet Chunks an SSE endpoint
      // 3. Wir leiten sie an Client weiter
      
      // Pseudo-Code - braucht SSE-Server Setup
      eventSource.on('chunk', (data) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      })
      
      eventSource.on('done', () => {
        controller.close()
      })
    },
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

#### 4.4 Chat-Interface (via n8n)
- **Status:** ⚠️ SEITE EXISTIERT, FUNKTIONALITÄT UNKLAR
- **Zeitaufwand:** 6-8 Stunden
- **n8n Workflow sollte haben:**
  - Chat History Context
  - Transcript als Knowledge Base
  - Claude API mit Context
  - Response zurück

**Implementation:**
```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { message, transcriptId, chatHistoryId } = await request.json()
  const session = await getSession()
  
  // 1. Get Chat History
  const chatHistory = await prisma.chatMessage.findMany({
    where: { chatHistoryId },
    orderBy: { createdAt: 'asc' },
  })
  
  // 2. Get Transcript (if provided)
  const transcript = transcriptId 
    ? await prisma.transcript.findUnique({ where: { id: transcriptId } })
    : null
  
  // 3. Trigger n8n Chat Workflow
  await triggerN8NWorkflow({
    workflowName: 'chat',
    webhookUrl: process.env.N8N_CHAT_WEBHOOK_URL!,
    payload: {
      userId: session.user.id,
      message,
      chatHistory: chatHistory.map(m => ({
        role: m.role,
        content: m.content,
      })),
      transcriptContext: transcript?.text,
    },
  })
  
  return NextResponse.json({ success: true })
}
```

#### 4.5 n8n Workflow-Konfiguration
- **Status:** ⚠️ UNKLAR WIE WORKFLOWS KONFIGURIERT SIND
- **Zeitaufwand:** 3-4 Stunden (Dokumentation & Optimierung)

**Zu dokumentieren/prüfen:**
- [ ] Welche n8n Workflows existieren?
- [ ] Webhook URLs für jeden Workflow
- [ ] Error Handling in n8n
- [ ] Retry-Strategie in n8n
- [ ] Timeout-Settings
- [ ] n8n Backup-Strategie (Workflows exportieren!)
- [ ] n8n Monitoring (Execution Logs)
- [ ] n8n Credentials Management

**n8n Best Practices:**
```yaml
# n8n Workflows checklist:
Transcription Workflow:
  - Input: uploadId, blobUrl, userId
  - Steps:
    1. Download File from Blob
    2. Extract Audio (if video)
    3. Call Whisper API
    4. Parse Response
    5. Callback to Next.js
  - Error Handling: Retry 3x, dann Callback mit Error
  - Timeout: 15 Min

Generation Workflow:
  - Input: transcriptText, format, parameters
  - Steps:
    1. Build Prompt from Template
    2. Call Claude API
    3. Parse/Format Response
    4. Callback to Next.js
  - Error Handling: Content Policy Violations abfangen
  - Timeout: 2 Min

Chat Workflow:
  - Input: message, chatHistory, transcriptContext
  - Steps:
    1. Build Context
    2. Call Claude API
    3. Stream or Return Response
  - Error Handling: Rate Limit Detection
  - Timeout: 1 Min
```

#### 4.6 n8n Monitoring & Debugging
- **Status:** ❌ WAHRSCHEINLICH NICHT VORHANDEN
- **Zeitaufwand:** 2-3 Stunden
- **Zu implementieren:**
  - [ ] n8n Execution Logging in Next.js speichern
  - [ ] Request-ID Tracking (von Next.js → n8n → zurück)
  - [ ] Failed Workflow Alerts
  - [ ] Performance Monitoring
  - [ ] Cost Tracking (über n8n Executions)

```typescript
// lib/n8n-monitoring.ts
export async function logN8NExecution({
  workflowName,
  requestId,
  status,
  duration,
  error,
}: {
  workflowName: string
  requestId: string
  status: 'success' | 'failed' | 'timeout'
  duration: number
  error?: string
}) {
  await prisma.n8nExecution.create({
    data: {
      workflowName,
      requestId,
      status,
      duration,
      error,
      timestamp: new Date(),
    },
  })
  
  // Alert bei häufigen Failures
  if (status === 'failed') {
    const recentFailures = await prisma.n8nExecution.count({
      where: {
        workflowName,
        status: 'failed',
        timestamp: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // letzte Stunde
      },
    })
    
    if (recentFailures > 10) {
      await sendAlert(`n8n workflow ${workflowName} has ${recentFailures} failures!`)
    }
  }
}
```

#### 4.7 KI-Kosten Tracking (via n8n)
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Risiko:** EXPLODIERENDE KOSTEN!
- **Zeitaufwand:** 4-5 Stunden
- **Dringlichkeit:** 🔴 KRITISCH

**Problem:** n8n macht die API-Calls, aber Next.js muss Kosten tracken!

**Lösung:** n8n sendet Kosten-Daten im Callback zurück
```typescript
// n8n Callback Payload sollte enthalten:
{
  uploadId: "...",
  transcript: "...",
  usage: {
    service: "whisper",
    duration: 180, // Sekunden
    cost: 0.018, // $0.006 per minute
  }
}

// Next.js speichert Usage:
await prisma.aiUsage.create({
  data: {
    userId: session.user.id,
    service: 'whisper',
    operation: 'transcription',
    duration: usage.duration,
    cost: usage.cost,
  },
})
```

**User Limits checken:**
```typescript
export async function checkUserUsageLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      aiUsage: {
        where: {
          timestamp: {
            gte: startOfMonth(new Date()),
          },
        },
      },
    },
  })
  
  const limits = USAGE_LIMITS[user.subscription?.plan || 'FREE']
  
  const totalTranscriptionMinutes = user.aiUsage
    .filter(u => u.service === 'whisper')
    .reduce((sum, u) => sum + (u.duration || 0) / 60, 0)
  
  const totalGenerations = user.aiUsage
    .filter(u => u.service === 'claude')
    .length
  
  return {
    transcriptionMinutes: totalTranscriptionMinutes,
    aiGenerations: totalGenerations,
    limits,
    canTranscribe: totalTranscriptionMinutes < limits.transcriptionMinutes,
    canGenerate: totalGenerations < limits.aiGenerations,
  }
}
```

#### 4.8 n8n Fallback & Resilience
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 4-5 Stunden
- **Szenarien:**
  - n8n Server down
  - n8n Workflow Error
  - n8n Timeout
  - API Rate Limits

**Retry-Queue implementieren:**
```typescript
// lib/n8n-queue.ts
import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'timax' })

export const retryN8NWorkflow = inngest.createFunction(
  { id: 'retry-n8n-workflow' },
  { event: 'n8n/workflow.failed' },
  async ({ event, step }) => {
    const { workflowName, payload, attemptNumber } = event.data
    
    // Max 3 Retries
    if (attemptNumber >= 3) {
      await step.run('notify-user-of-failure', async () => {
        await notifyUser(payload.userId, {
          type: 'workflow_failed',
          workflow: workflowName,
        })
      })
      return
    }
    
    // Wait with exponential backoff
    await step.sleep('wait-before-retry', `${2 ** attemptNumber}s`)
    
    // Retry
    await step.run('retry-workflow', async () => {
      await triggerN8NWorkflow({
        workflowName,
        webhookUrl: getWebhookUrl(workflowName),
        payload: {
          ...payload,
          attemptNumber: attemptNumber + 1,
        },
      })
    })
  }
)
```

#### 4.9 Prompt Management (in Next.js oder n8n?)
- **Status:** ❌ UNKLAR WO PROMPTS GESPEICHERT SIND
- **Zeitaufwand:** 3-4 Stunden
- **Entscheidung:** Prompts in Next.js verwalten, an n8n senden

**Vorteil:** Einfachere Anpassung ohne n8n Workflow zu ändern

```typescript
// lib/prompts.ts
export const GENERATION_PROMPTS = {
  'social-post': {
    system: `Du bist ein Social Media Experte. Erstelle engaging Posts mit:
- Aufmerksamkeitsstarkem Hook
- Wertvollem Content
- Klarem Call-to-Action`,
    template: (transcript: string, length: string) => `
Basierend auf diesem Transkript, erstelle einen ${length} Social Media Post:

${transcript}

Wichtig:
- Nutze Storytelling
- Sei authentisch
- Füge relevante Emojis ein (aber nicht zu viele)
- Strukturiere mit Absätzen
    `,
  },
  
  'blog-article': {
    system: `Du bist ein professioneller Blogger. Schreibe strukturierte Artikel mit:
- Catchy Überschrift
- Einleitung die neugierig macht
- Gut strukturierter Hauptteil
- Überzeugendes Fazit`,
    template: (transcript: string, length: string) => `
Schreibe einen ${length} Blog-Artikel basierend auf:

${transcript}

Format:
# Überschrift
## Einleitung
## Hauptteil (mit Unterüberschriften)
## Fazit
    `,
  },
  
  // ... weitere Formate
}

// In API Route:
const prompt = GENERATION_PROMPTS[format].template(transcript, length)
const systemPrompt = GENERATION_PROMPTS[format].system

await triggerN8NWorkflow({
  workflowName: 'generation',
  payload: {
    systemPrompt,
    userPrompt: customPrompt || prompt,
    // ...
  },
})
```

#### 4.10 n8n Environment Variables
- **Status:** ⚠️ ZU PRÜFEN
- **Zeitaufwand:** 1 Stunde

**Next.js .env benötigt:**
```bash
# n8n Webhook URLs
N8N_TRANSCRIPTION_WEBHOOK_URL="https://your-n8n.app/webhook/transcription"
N8N_GENERATION_WEBHOOK_URL="https://your-n8n.app/webhook/generation"
N8N_CHAT_WEBHOOK_URL="https://your-n8n.app/webhook/chat"

# n8n Authentication
N8N_WEBHOOK_SECRET="your-secret-key-for-hmac-signing"

# n8n Callback Authentication (für Webhooks von n8n → Next.js)
N8N_CALLBACK_SECRET="different-secret-for-callbacks"
```

**n8n sollte haben:**
- OpenAI API Key (für Whisper)
- Anthropic API Key (für Claude)
- Callback URLs zu Next.js
- Authentication Headers

---

### 5. Authentifizierung & User-Management

#### 5.1 Authentication System
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Risiko:** Keine User-Verwaltung = keine App!
- **Zeitaufwand:** 8-12 Stunden
- **Empfohlene Lösung: NextAuth.js v5**
  ```bash
  npm install next-auth@beta
  ```
- **Provider zu implementieren:**
  - [ ] Email/Password (mit bcrypt Hashing)
  - [ ] Google OAuth
  - [ ] GitHub OAuth (optional)
- **Features:**
  - [ ] User Registration
  - [ ] Login/Logout
  - [ ] Session Management
  - [ ] Password Reset
  - [ ] Email Verification
  - [ ] 2FA (optional, aber empfohlen)

#### 5.2 Password Security
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 2-3 Stunden
- **Requirements:**
  - [ ] Mindestlänge: 8 Zeichen
  - [ ] Komplexität: Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen
  - [ ] Bcrypt mit Saltrounds >= 12
  - [ ] Password-Strength Indicator in UI
  - [ ] Breached Password Check (haveibeenpwned API)
- **Beispiel:**
  ```typescript
  import bcrypt from 'bcryptjs'
  
  const hashedPassword = await bcrypt.hash(password, 12)
  const isValid = await bcrypt.compare(inputPassword, hashedPassword)
  ```

#### 5.3 Email Verification
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Risiko:** Fake Accounts, Spam
- **Zeitaufwand:** 3-4 Stunden
- **Flow:**
  1. User registriert sich
  2. Verification Email senden
  3. User klickt Link
  4. Account aktiviert
- **Token:** JWT oder Random Token, 24h gültig

#### 5.4 Password Reset
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 3-4 Stunden
- **Flow:**
  1. User klickt "Passwort vergessen"
  2. Reset Email mit Token
  3. Token validieren
  4. Neues Passwort setzen
- **Sicherheit:**
  - Token nur 1x verwendbar
  - Token läuft nach 1h ab
  - Rate Limiting (5 Requests/15 Min)

#### 5.5 User Roles & Permissions
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 2-3 Stunden
- **Rollen:**
  - `user` - Normale User
  - `admin` - Administratoren
  - `beta` - Beta-Tester (mehr Limits)
- **Permissions:**
  - Upload-Limits pro Role
  - AI-Usage-Limits pro Role
  - Feature-Flags

#### 5.6 Account Deletion (DSGVO!)
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Risiko:** DSGVO-Verstoß (Recht auf Löschung!)
- **Zeitaufwand:** 3-4 Stunden
- **Zu löschen:**
  - [ ] User-Account
  - [ ] Alle Uploads
  - [ ] Alle Transkripte
  - [ ] Alle generierten Texte
  - [ ] Alle Chat-Histories
  - [ ] Alle Metadaten
- **Grace Period:** 30 Tage mit Möglichkeit zur Wiederherstellung

---

### 6. Database & Storage

#### 6.1 Database Setup
- **Status:** ⚠️ UNKLAR
- **Zeitaufwand:** 4-6 Stunden
- **Empfohlene Lösung: Vercel Postgres**
  ```bash
  npm install @vercel/postgres
  # oder mit ORM
  npm install prisma @prisma/client
  ```
- **Alternative:** Supabase (PostgreSQL + Auth + Storage in einem)

#### 6.2 Database Schema
- **Status:** ❌ UNKLAR/NICHT VOLLSTÄNDIG
- **Zeitaufwand:** 6-8 Stunden
- **Tables benötigt:**
  ```prisma
  model User {
    id            String    @id @default(uuid())
    email         String    @unique
    passwordHash  String
    name          String?
    role          Role      @default(USER)
    emailVerified DateTime?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    
    uploads       Upload[]
    transcripts   Transcript[]
    aiUsage       AIUsage[]
    subscription  Subscription?
  }
  
  model Upload {
    id          String   @id @default(uuid())
    userId      String
    user        User     @relation(fields: [userId], references: [id])
    filename    String
    blobUrl     String
    size        Int
    mimeType    String
    duration    Int?
    status      UploadStatus @default(UPLOADED)
    createdAt   DateTime @default(now())
    
    transcript  Transcript?
  }
  
  model Transcript {
    id          String   @id @default(uuid())
    uploadId    String   @unique
    upload      Upload   @relation(fields: [uploadId], references: [id])
    userId      String
    user        User     @relation(fields: [userId], references: [id])
    text        String   @db.Text
    segments    Json?
    language    String
    duration    Int
    createdAt   DateTime @default(now())
    
    generations Generation[]
  }
  
  model Generation {
    id           String   @id @default(uuid())
    transcriptId String
    transcript   Transcript @relation(fields: [transcriptId], references: [id])
    format       TextFormat
    length       TextLength
    tone         String?
    generatedText String  @db.Text
    tokenUsage   Json
    createdAt    DateTime @default(now())
  }
  
  model AIUsage {
    id           String   @id @default(uuid())
    userId       String
    user         User     @relation(fields: [userId], references: [id])
    service      AIService
    operation    String
    inputTokens  Int?
    outputTokens Int?
    duration     Int?
    cost         Float
    timestamp    DateTime @default(now())
  }
  
  model Subscription {
    id          String   @id @default(uuid())
    userId      String   @unique
    user        User     @relation(fields: [userId], references: [id])
    plan        Plan     @default(FREE)
    status      SubStatus @default(ACTIVE)
    stripeId    String?  @unique
    currentPeriodEnd DateTime?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  
  enum Role { USER ADMIN BETA }
  enum UploadStatus { UPLOADED PROCESSING COMPLETE FAILED }
  enum TextFormat { SOCIAL_POST BLOG_ARTICLE NEWSLETTER SUMMARY }
  enum TextLength { SHORT MEDIUM LONG }
  enum AIService { WHISPER CLAUDE GPT4 }
  enum Plan { FREE PRO ENTERPRISE }
  enum SubStatus { ACTIVE CANCELLED EXPIRED }
  ```

#### 6.3 Database Migrations
- **Status:** ❌ NICHT EINGERICHTET
- **Zeitaufwand:** 1-2 Stunden
- **Mit Prisma:**
  ```bash
  npx prisma init
  npx prisma migrate dev --name init
  npx prisma generate
  ```

#### 6.4 Database Backups
- **Status:** ❌ KEINE STRATEGIE
- **Risiko:** Datenverlust
- **Zeitaufwand:** 2-3 Stunden
- **Vercel Postgres:** Automatische Backups
- **Zusätzlich:** Eigene Backup-Strategie
  - Daily Backups
  - 30 Tage Retention
  - Point-in-Time Recovery

#### 6.5 Database Indexing
- **Status:** ❌ NICHT OPTIMIERT
- **Zeitaufwand:** 2-3 Stunden
- **Wichtige Indizes:**
  ```prisma
  @@index([userId])
  @@index([createdAt])
  @@index([status])
  @@index([email])
  ```

---

### 7. Frontend & UX - Fehlende Komponenten

#### 7.1 Fehlende Seiten
- **Status:** ❌ VIELE WICHTIGE SEITEN FEHLEN
- **Zeitaufwand:** 12-20 Stunden

**Pflicht-Seiten:**
- [x] `/impressum` - Impressum ✅ **ERSTELLT** (Firmendaten ausfüllen!)
- [x] `/datenschutz` - Datenschutzerklärung ✅ **VOLLSTÄNDIG**
- [x] `/agb` - AGB ✅ **VOLLSTÄNDIG**
- [x] `/widerruf` - Widerrufsbelehrung ✅ **ERSTELLT**
- [x] `/cookies` - Cookie-Policy ✅ **ERSTELLT**
- [ ] `/kontakt` - Kontaktformular
- [ ] `/404` - Custom 404 Error Page
- [ ] `/500` - Custom 500 Error Page

**Feature-Seiten:**
- [ ] `/pricing` - Preisübersicht (falls kostenpflichtig)
- [ ] `/features` - Detaillierte Feature-Liste
- [ ] `/about` - Über uns / Team
- [ ] `/help` oder `/faq` - Hilfe & FAQ
- [ ] `/blog` - Content Marketing (optional)
- [ ] `/changelog` - Feature Updates
- [ ] `/status` - System Status Page (uptime)

**User-Account Seiten:**
- [ ] `/login` - Login
- [ ] `/signup` - Registrierung
- [ ] `/forgot-password` - Passwort vergessen
- [ ] `/reset-password/[token]` - Passwort zurücksetzen
- [ ] `/verify-email/[token]` - E-Mail Verifizierung
- [ ] `/dashboard` - User Dashboard
- [ ] `/profile` - Profil-Einstellungen
- [ ] `/settings` - Account-Einstellungen
- [ ] `/billing` - Rechnungen & Zahlungen (falls paid)
- [ ] `/usage` - Nutzungsstatistik

**App-Seiten:**
- [x] `/text-generator` - Text Generator (erwähnt auf Homepage)
- [x] `/chat` - Chat Interface (erwähnt auf Homepage)
- [ ] `/uploads` - Upload-Übersicht & Management
- [ ] `/transcripts` - Transkript-Bibliothek
- [ ] `/transcripts/[id]` - Einzelnes Transkript
- [ ] `/generations` - Generierte Texte
- [ ] `/generations/[id]` - Einzelner generierter Text

#### 7.2 Navigation
- **Status:** ⚠️ BASIC VORHANDEN, ABER UNVOLLSTÄNDIG
- **Zeitaufwand:** 4-6 Stunden
- **Zu verbessern:**
  - [ ] Header mit allen wichtigen Links
  - [ ] Mobile Navigation (Hamburger Menu)
  - [ ] User-Menu (wenn eingeloggt)
  - [ ] Breadcrumbs
  - [ ] Search-Funktion (optional)
- **Footer erweitern:**
  - [ ] Produkt-Links
  - [ ] Support-Links
  - [ ] Rechtliche Links
  - [ ] Social Media Links

#### 7.3 Loading States
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 3-4 Stunden
- **Wo benötigt:**
  - [ ] Upload (Progress Bar)
  - [ ] Transkription (Spinner + Status)
  - [ ] Text-Generierung (Skeleton + Streaming)
  - [ ] Page Loads (Next.js Loading UI)
- **Implementation:**
  ```typescript
  // app/dashboard/loading.tsx
  export default function DashboardLoading() {
    return <Skeleton />
  }
  ```

#### 7.4 Error Handling UI
- **Status:** ⚠️ **TEILWEISE VORHANDEN**
- **Zeitaufwand:** 1-2 Stunden (reduziert)
- **Bereits vorhanden:**
  - ✅ Error Boundary (`components/error-boundary.tsx`) mit Sentry-Integration
  - ✅ Fallback UI für React-Fehler
  - ✅ Toast Notifications vorhanden (siehe 7.5)
- **Noch zu erstellen:**
  - [ ] `/not-found` (404) - Next.js `not-found.tsx`
  - [ ] `error.tsx` (Fehlerseite) - Next.js Error Page
  - [ ] `global-error.tsx` (kritische Fehler) - Next.js Global Error
  - [ ] Inline Error Messages in Forms

#### 7.5 Toast Notifications
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Zeitaufwand:** ✅ Erledigt
- **Bereits vorhanden:**
  - ✅ `components/ui/toast.tsx` mit vollständiger Implementierung
  - ✅ ToastProvider im Root Layout (`app/layout.tsx`)
  - ✅ useToast Hook vorhanden
  - ✅ Success/Error/Info Varianten
  - ✅ Auto-dismiss nach 5 Sekunden
- **Noch zu implementieren:**
  - [ ] Integration in Upload-Flow (Upload erfolgreich)
  - [ ] Integration in Text-Generierung (Transkription abgeschlossen)
  - [ ] Integration in API Error Handling (Rate Limit erreicht)

#### 7.6 Form Validation
- **Status:** ❌ UNKLAR
- **Zeitaufwand:** 4-6 Stunden
- **Library:**
  ```bash
  npm install react-hook-form @hookform/resolvers
  ```
- **Alle Formulare validieren:**
  - Login
  - Registrierung
  - Upload
  - Text-Generierung
  - Kontakt

#### 7.7 Responsive Design
- **Status:** ⚠️ WAHRSCHEINLICH TEILWEISE
- **Zeitaufwand:** 8-12 Stunden
- **Test-Devices:**
  - [ ] iPhone SE (375px)
  - [ ] iPhone 14 Pro (390px)
  - [ ] iPad Mini (768px)
  - [ ] Desktop (1920px)
- **Problembereiche:**
  - Mobile Navigation
  - Tables (Transkript-Liste)
  - Text-Editor
  - Upload-Interface

#### 7.8 Dark Mode
- **Status:** ✅ **VORHANDEN**
- **Zeitaufwand:** ✅ Erledigt
- **Dringlichkeit:** ✅ Implementiert
- **Bereits vorhanden:**
  - ✅ `components/home/dark-mode-toggle.tsx` vorhanden
  - ✅ Dark Mode Support in UI Components
  - ✅ Dark Mode Toggle auf Homepage

#### 7.9 Accessibility (a11y)
- **Status:** ⚠️ WAHRSCHEINLICH UNZUREICHEND
- **Zeitaufwand:** 6-8 Stunden
- **WCAG 2.1 Level AA compliance:**
  - [ ] Keyboard Navigation
  - [ ] Screen Reader Support
  - [ ] ARIA Labels
  - [ ] Focus States
  - [ ] Color Contrast (4.5:1)
  - [ ] Skip Links
  - [ ] Alt-Texte für Bilder
- **Testing:**
  - Lighthouse Accessibility Score
  - axe DevTools
  - NVDA / JAWS Screen Reader

#### 7.10 Performance Optimization
- **Status:** ⚠️ NICHT OPTIMIERT
- **Zeitaufwand:** 6-8 Stunden
- **Maßnahmen:**
  - [ ] Image Optimization (next/image)
  - [ ] Code Splitting
  - [ ] Lazy Loading
  - [ ] Font Optimization
  - [ ] Bundle Size Reduction
  - [ ] Caching Strategy
- **Ziel:** Lighthouse Score > 90

---

### 8. Monitoring & Error Handling

#### 8.1 Error Tracking (Sentry)
- **Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- **Risiko:** ✅ Abgedeckt
- **Zeitaufwand:** ✅ Erledigt
- **Bereits vorhanden:**
  - ✅ `@sentry/nextjs` installiert
  - ✅ `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` vorhanden
  - ✅ `next.config.ts` mit Sentry-Config
  - ✅ Error Boundary mit Sentry-Integration (`components/error-boundary.tsx`)
  - ✅ API Routes loggen Fehler an Sentry
- **Noch zu implementieren:**
  - [ ] Performance Monitoring aktivieren
  - [ ] User Feedback Integration
  - [ ] Release Tracking konfigurieren

#### 8.2 Analytics
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 2-3 Stunden
- **Optionen:**
  - Vercel Analytics (einfach, privacy-friendly)
  - Plausible (DSGVO-konform)
  - PostHog (Open Source)
- **Nicht empfohlen:** Google Analytics (DSGVO-problematisch)
- **Zu tracken:**
  - Page Views
  - User Flows
  - Conversion Rates
  - Feature Usage
  - Bounce Rates

#### 8.3 Logging
- **Status:** ❌ KEIN STRUKTURIERTES LOGGING
- **Zeitaufwand:** 3-4 Stunden
- **Library:**
  ```bash
  npm install pino pino-pretty
  ```
- **Log Levels:**
  - ERROR: Fehler
  - WARN: Warnungen
  - INFO: Informationen
  - DEBUG: Debug-Infos (nur Dev)
- **Zu loggen:**
  - API Requests/Responses
  - Fehler
  - User Actions
  - Performance Metrics

#### 8.4 Uptime Monitoring
- **Status:** ❌ NICHT EINGERICHTET
- **Zeitaufwand:** 1-2 Stunden
- **Services:**
  - UptimeRobot (kostenlos)
  - Better Uptime
  - Pingdom
- **Checks:**
  - Homepage
  - API Endpoints
  - Database Connection

#### 8.5 Performance Monitoring
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 2-3 Stunden
- **Metriken:**
  - Page Load Times
  - API Response Times
  - Database Query Times
  - AI API Latency
- **Tools:**
  - Vercel Analytics
  - Sentry Performance
  - Custom Metrics

---

### 9. Testing

#### 9.1 Unit Tests
- **Status:** ❌ KEINE TESTS
- **Zeitaufwand:** 12-20 Stunden
- **Framework:**
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom
  ```
- **Zu testen:**
  - Utility Functions
  - Validations
  - API Helpers
  - Components (basic)
- **Coverage-Ziel:** >80%

#### 9.2 Integration Tests
- **Status:** ❌ KEINE TESTS
- **Zeitaufwand:** 8-12 Stunden
- **Zu testen:**
  - API Routes
  - Database Operations
  - Authentication Flow
  - Upload Flow

#### 9.3 E2E Tests
- **Status:** ❌ KEINE TESTS
- **Zeitaufwand:** 12-16 Stunden
- **Framework:**
  ```bash
  npm install -D @playwright/test
  ```
- **Test-Szenarien:**
  - User Registration & Login
  - Upload & Transcription
  - Text Generation
  - Account Management

#### 9.4 Load Testing
- **Status:** ❌ NICHT DURCHGEFÜHRT
- **Zeitaufwand:** 4-6 Stunden
- **Tools:** k6, Artillery
- **Szenarien:**
  - Concurrent Uploads
  - API Rate Limits
  - Database Performance

---

### 10. Deployment & DevOps

#### 10.1 CI/CD Pipeline
- **Status:** ⚠️ VERCEL AUTO-DEPLOY, ABER KEINE TESTS
- **Zeitaufwand:** 4-6 Stunden
- **GitHub Actions Setup:**
  ```yaml
  # .github/workflows/ci.yml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check
        - run: npm run test
  ```

#### 10.2 Environment Setup
- **Status:** ⚠️ ZU PRÜFEN
- **Zeitaufwand:** 2-3 Stunden
- **Environments:**
  - Development (localhost)
  - Preview (Vercel Preview Deploys)
  - Production (timax.vercel.app)
- **Unterschiedliche Configs:**
  - API Keys
  - Database URLs
  - Feature Flags

#### 10.3 Database Migrations Strategy
- **Status:** ❌ KEINE STRATEGIE
- **Zeitaufwand:** 2-3 Stunden
- **Process:**
  1. Develop Migration
  2. Test in Preview
  3. Deploy to Production
  4. Rollback-Plan

#### 10.4 Rollback Strategy
- **Status:** ❌ KEINE STRATEGIE
- **Zeitaufwand:** 1-2 Stunden
- **Vercel:** Instant Rollbacks möglich
- **Database:** Backup vor jeder Migration

---

### 11. Business & Product

#### 11.1 Pricing Strategy
- **Status:** ❌ UNKLAR
- **Zeitaufwand:** 4-8 Stunden
- **Fragen:**
  - Free Tier oder Paid-Only?
  - Freemium Model?
  - Usage-Based oder Flat Fee?
  - Monthly oder Yearly?
- **Beispiel:**
  ```
  FREE:
  - 30 Min Transkription/Monat
  - 10 Text-Generierungen/Monat
  - 1 GB Storage
  
  PRO (19€/Monat):
  - 300 Min Transkription/Monat
  - 100 Text-Generierungen/Monat
  - 10 GB Storage
  - Priority Support
  
  ENTERPRISE (Custom):
  - Unlimited
  - API Access
  - White Label
  - Dedicated Support
  ```

#### 11.2 Payment Integration (falls kostenpflichtig)
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 8-12 Stunden
- **Empfehlung: Stripe**
  ```bash
  npm install stripe @stripe/stripe-js
  ```
- **Features:**
  - Subscription Management
  - Invoicing
  - Webhooks
  - Payment Methods
  - Tax Handling

#### 11.3 Onboarding Flow
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 6-8 Stunden
- **Steps:**
  1. Welcome Screen
  2. Quick Tour
  3. First Upload (guided)
  4. First Generation (guided)
  5. Success State
- **Tools:** react-joyride, intro.js

#### 11.4 User Feedback System
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 3-4 Stunden
- **Features:**
  - Feedback Button
  - Bug Report
  - Feature Request
  - Rating System

#### 11.5 Beta-Programm (aktueller Status)
- **Status:** ⚠️ "COMING SOON" ERWÄHNT
- **Zeitaufwand:** 4-6 Stunden
- **Zu klären:**
  - Wie viele Beta-User?
  - Zugangs-Prozess?
  - Beta-Features?
  - Feedback-Prozess?
  - Beta-User Benefits?

---

### 12. Content & Marketing

#### 12.1 Homepage Content
- **Status:** ⚠️ VORHANDEN, ABER UNVOLLSTÄNDIG
- **Fehlende Elemente:**
  - [ ] Demo-Video (aktuell "Coming Soon")
  - [ ] Screenshots/GIFs von Features
  - [ ] Beta-User Testimonials (aktuell "Coming Soon")
  - [ ] FAQ Section
  - [ ] Social Proof (Anzahl User, Uploads, etc.)
  - [ ] Trust Badges (DSGVO, ISO, etc.)

#### 12.2 SEO Optimization
- **Status:** ⚠️ WAHRSCHEINLICH UNVOLLSTÄNDIG
- **Zeitaufwand:** 4-6 Stunden
- **Zu implementieren:**
  - [ ] Meta Tags (Title, Description)
  - [ ] Open Graph Tags (Social Sharing)
  - [ ] Twitter Cards
  - [ ] JSON-LD Schema Markup
  - [ ] Sitemap.xml
  - [ ] Robots.txt
  - [ ] Canonical URLs
- **Beispiel:**
  ```typescript
  // app/layout.tsx
  export const metadata: Metadata = {
    title: 'timax - Videos & Audios in Text transformieren',
    description: 'Automatische Transkription und KI-gestützte Textgenerierung...',
    openGraph: {
      title: 'timax',
      description: '...',
      images: ['/og-image.png'],
    },
  }
  ```

#### 12.3 Blog/Content Marketing
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 20+ Stunden (ongoing)
- **Themen:**
  - Content-Creation Tipps
  - Social Media Best Practices
  - SEO & Content Marketing
  - Use Cases & Success Stories
  - Product Updates

#### 12.4 Social Media Präsenz
- **Status:** ❌ NICHT ERKENNBAR
- **Zeitaufwand:** Ongoing
- **Kanäle:**
  - LinkedIn (B2B)
  - Twitter/X (Tech Community)
  - Instagram (Visual Content)
  - YouTube (Tutorials, Demos)

#### 12.5 Email Marketing
- **Status:** ⚠️ ANMELDEFORMULAR VORHANDEN
- **Zeitaufwand:** 4-6 Stunden
- **Setup:**
  ```bash
  npm install resend
  # oder
  npm install @sendgrid/mail
  ```
- **Emails:**
  - [ ] Welcome Email
  - [ ] Email Verification
  - [ ] Password Reset
  - [ ] Transcription Complete
  - [ ] Usage Limits Warning
  - [ ] Newsletter
  - [ ] Product Updates

---

### 13. Documentation

#### 13.1 User Documentation
- **Status:** ❌ FEHLT
- **Zeitaufwand:** 8-12 Stunden
- **Zu erstellen:**
  - Getting Started Guide
  - Feature Documentation
  - Video Tutorials
  - FAQ
  - Troubleshooting
  - Best Practices

#### 13.2 API Documentation
- **Status:** ❌ FEHLT
- **Zeitaufwand:** 6-8 Stunden
- **Falls API angeboten wird:**
  - OpenAPI/Swagger Spec
  - Code Examples
  - Authentication
  - Rate Limits
  - Error Codes

#### 13.3 Developer Documentation
- **Status:** ❌ FEHLT
- **Zeitaufwand:** 4-6 Stunden
- **Für Team:**
  - Setup Instructions
  - Architecture Overview
  - Database Schema
  - API Routes
  - Deployment Process
  - Contributing Guidelines

---

## 🟠 HOHE PRIORITÄT (Wichtig für guten Launch)

### 14. Email-System

#### 14.1 Transactional Emails
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 6-8 Stunden
- **Provider: Resend (empfohlen für Next.js)**
  ```bash
  npm install resend
  ```
- **Email-Templates:**
  - [ ] Welcome Email
  - [ ] Email Verification
  - [ ] Password Reset
  - [ ] Transcription Complete
  - [ ] Generation Complete
  - [ ] Usage Limit Warning (80%, 100%)
  - [ ] Payment Confirmation (falls paid)
  - [ ] Account Deletion Confirmation
- **React Email für Templates:**
  ```bash
  npm install react-email @react-email/components
  ```

#### 14.2 Email Service Configuration
- **Zeitaufwand:** 2-3 Stunden
- **Setup:**
  - Domain Verification
  - SPF/DKIM Records
  - DMARC Policy
  - Sender Reputation
- **Monitoring:**
  - Delivery Rates
  - Open Rates
  - Bounce Rates

---

### 15. Webhooks & Integrations

#### 15.1 Internal Webhooks
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 4-6 Stunden
- **Events:**
  - upload.completed
  - transcription.completed
  - generation.completed
  - user.registered
  - subscription.changed

#### 15.2 Third-Party Integrations (optional)
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 20+ Stunden pro Integration
- **Mögliche Integrations:**
  - Zapier
  - Make (Integromat)
  - Notion
  - Google Drive
  - Dropbox
  - WordPress

---

### 16. Internationalisierung (i18n)

#### 16.1 Multi-Language Support
- **Status:** ❌ NUR DEUTSCH
- **Zeitaufwand:** 12-20 Stunden
- **Dringlichkeit:** 🟡 OPTIONAL für Launch
- **Library:**
  ```bash
  npm install next-intl
  ```
- **Languages:**
  - Deutsch (aktuell)
  - Englisch (wichtig für internationale Nutzer)
  - Weitere (später)

---

### 17. Compliance & Certifications

#### 17.1 DSGVO/GDPR Compliance
- **Status:** ⚠️ TEILWEISE (Datenschutzerklärung fehlt)
- **Zeitaufwand:** 8-12 Stunden
- **Checklist:**
  - [ ] Datenschutzerklärung ✅ (s.o.)
  - [ ] Cookie-Consent ✅ (s.o.)
  - [ ] Recht auf Auskunft (implementieren)
  - [ ] Recht auf Löschung (implementieren)
  - [ ] Recht auf Datenübertragbarkeit (implementieren)
  - [ ] Data Processing Agreement mit Subprocessors
  - [ ] Privacy by Design
  - [ ] Privacy by Default

#### 17.2 ISO 27001 (optional)
- **Status:** ❌ NICHT RELEVANT FÜR STARTUP
- **Zeitaufwand:** Monate + teuer
- **Erst relevant bei:** Enterprise-Kunden

#### 17.3 SOC 2 (optional)
- **Status:** ❌ NICHT RELEVANT FÜR STARTUP
- **Erst relevant bei:** US-Enterprise-Kunden

---

### 18. Support & Help

#### 18.1 Help Center / FAQ
- **Status:** ❌ FEHLT
- **Zeitaufwand:** 6-8 Stunden
- **Kategorien:**
  - Getting Started
  - Uploads & Transcription
  - Text Generation
  - Account & Billing
  - Technical Issues
  - Privacy & Security

#### 18.2 Support System
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 4-6 Stunden
- **Optionen:**
  - Email Support (einfach)
  - Live Chat (Intercom, Crisp)
  - Ticket System (Zendesk, Freshdesk)
  - Self-Service Portal

#### 18.3 Status Page
- **Status:** ❌ FEHLT
- **Zeitaufwand:** 2-3 Stunden
- **Tool:** Better Uptime, Statuspage.io
- **Shows:**
  - System Status (Operational/Degraded/Down)
  - Incident History
  - Scheduled Maintenance
  - Subscribe to Updates

---

### 19. Legal & Contracts

#### 19.1 Data Processing Agreements (DPA)
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 4-6 Stunden (mit Anwalt)
- **Benötigt mit:**
  - Vercel (Hosting)
  - OpenAI (Whisper API)
  - Anthropic (Claude API)
  - AWS/Blob Storage
  - Email Provider

#### 19.2 Terms of Service (erweitert)
- **Status:** ⚠️ AGB fehlen (s.o.)
- **Besondere Klauseln:**
  - AI-Generated Content Disclaimer
  - Copyright & IP Rights
  - Acceptable Use Policy
  - Service Level Agreement (SLA)
  - Limitation of Liability

#### 19.3 Privacy Shield / EU-US Data Transfer
- **Status:** ❌ UNKLAR
- **Zeitaufwand:** 2-3 Stunden Recherche
- **Relevant wenn:**
  - US-Provider verwendet werden
  - Standardvertragsklauseln nötig

---

### 20. Financial & Accounting

#### 20.1 Rechnungsstellung
- **Status:** ❌ NICHT VORHANDEN (falls paid)
- **Zeitaufwand:** 4-6 Stunden
- **Features:**
  - Automatische Rechnung nach Zahlung
  - PDF-Generierung
  - Steuer-Berechnung
  - Invoice History für User

#### 20.2 Tax Handling
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 4-6 Stunden + Steuerberater
- **Zu beachten:**
  - USt-IdNr. auf Rechnungen
  - EU-Reverse Charge
  - Drittland-Regelungen
  - Kleinunternehmerregelung?

#### 20.3 Cost Tracking
- **Status:** ❌ KEINE ÜBERSICHT
- **Zeitaufwand:** 3-4 Stunden
- **Kosten zu tracken:**
  - Vercel Hosting
  - Vercel Blob Storage
  - Database (Postgres)
  - OpenAI API (Whisper)
  - Anthropic API (Claude)
  - Email Service
  - Domain
  - Tools & Services

---

## 🟡 MITTLERE PRIORITÄT (Nice-to-have)

### 21. Advanced Features

#### 21.1 Bulk Upload
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 6-8 Stunden
- **Feature:** Multiple Files gleichzeitig hochladen

#### 21.2 Folder/Project Organization
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 8-12 Stunden
- **Feature:** Uploads in Ordner/Projekte organisieren

#### 21.3 Collaboration Features
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 20+ Stunden
- **Features:**
  - Team Accounts
  - Shared Workspaces
  - Permissions
  - Comments

#### 21.4 Export Options
- **Status:** ❌ UNKLAR
- **Zeitaufwand:** 4-6 Stunden
- **Formate:**
  - PDF
  - DOCX
  - TXT
  - JSON
  - SRT (Untertitel)

#### 21.5 API für Entwickler
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 20+ Stunden
- **Features:**
  - REST API
  - API Keys
  - Rate Limiting
  - Documentation
  - SDKs (JS, Python)

#### 21.6 White Label Solution
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 40+ Stunden
- **Für:** Enterprise-Kunden

---

### 22. Advanced Security

#### 22.1 Two-Factor Authentication (2FA)
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 6-8 Stunden
- **Methods:**
  - TOTP (Google Authenticator)
  - SMS (teuer, nicht empfohlen)
  - Email (als Fallback)

#### 22.2 API Key Management
- **Status:** ❌ NICHT RELEVANT (noch keine API)
- **Zeitaufwand:** 4-6 Stunden
- **Features:**
  - Generate API Keys
  - Revoke Keys
  - Key Rotation
  - Scoped Permissions

#### 22.3 Audit Logging
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 4-6 Stunden
- **Events zu loggen:**
  - Login/Logout
  - Password Changes
  - File Uploads/Deletes
  - Settings Changes
  - API Calls

#### 22.4 IP Whitelisting (Enterprise)
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 3-4 Stunden

---

### 23. Performance & Scaling

#### 23.1 Caching Strategy
- **Status:** ⚠️ BASIC NEXT.JS CACHING
- **Zeitaufwand:** 4-6 Stunden
- **Zu cachen:**
  - API Responses
  - Database Queries
  - Generated Texts
  - Static Assets
- **Tools:**
  - Redis (Upstash)
  - Vercel Edge Caching

#### 23.2 CDN Configuration
- **Status:** ✅ VERCEL HAT CDN
- **Optimierung:** Static Assets optimieren

#### 23.3 Database Optimization
- **Status:** ❌ NICHT OPTIMIERT
- **Zeitaufwand:** 6-8 Stunden
- **Maßnahmen:**
  - Query Optimization
  - Indexes
  - Connection Pooling
  - Read Replicas (bei hoher Last)

#### 23.4 Background Jobs Optimization
- **Status:** ❌ NOCH NICHT RELEVANT
- **Wird relevant bei:** Vielen gleichzeitigen Uploads
- **Tools:** Inngest, QStash, BullMQ

---

### 24. AI-Features Advanced

#### 24.1 Custom AI Training/Fine-Tuning
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 40+ Stunden
- **Dringlichkeit:** 🟢 OPTIONAL, für später

#### 24.2 Multi-Language Support (AI)
- **Status:** ⚠️ DEUTSCH/ENGLISCH MÖGLICH
- **Zeitaufwand:** 2-3 Stunden
- **Zu implementieren:**
  - Language Detection
  - Multi-Language Generation

#### 24.3 Speaker Diarization
- **Status:** ❌ NICHT IMPLEMENTIERT
- **Zeitaufwand:** 8-12 Stunden
- **Feature:** "Wer spricht wann" im Transkript
- **API:** AssemblyAI, Deepgram

#### 24.4 Sentiment Analysis
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 6-8 Stunden
- **Feature:** Stimmung im Text erkennen

#### 24.5 Keyword Extraction
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 4-6 Stunden
- **Feature:** Automatische Keywords aus Transkript

---

## 🟢 NIEDRIGE PRIORITÄT (Post-Launch)

### 25. Community Features

#### 25.1 Public Templates
- **Status:** ❌ NICHT VORHANDEN
- **Feature:** User können Templates teilen

#### 25.2 Template Marketplace
- **Status:** ❌ NICHT VORHANDEN
- **Feature:** Templates kaufen/verkaufen

#### 25.3 User Profiles (Public)
- **Status:** ❌ NICHT VORHANDEN
- **Feature:** Öffentliche Profile mit Portfolio

---

### 26. Gamification

#### 26.1 Achievement System
- **Status:** ❌ NICHT VORHANDEN
- **Examples:**
  - "First Upload"
  - "100 Generations"
  - "Power User"

#### 26.2 Referral Program
- **Status:** ❌ NICHT VORHANDEN
- **Feature:** User werben User

---

### 27. Mobile Apps

#### 27.1 iOS App
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 200+ Stunden

#### 27.2 Android App
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 200+ Stunden

---

### 28. Browser Extensions

#### 28.1 Chrome Extension
- **Status:** ❌ NICHT VORHANDEN
- **Zeitaufwand:** 40+ Stunden

---

## 📊 Zusammenfassung & Zeitschätzung

> ✅ **UPDATE:** Da n8n bereits läuft, reduziert sich der Aufwand für KI-Integration erheblich!

### Minimaler Launch (MVP)
**Geschätzte Zeit:** 52-72 Stunden (1.3-1.8 Wochen Fulltime) ✅ **WEITER REDUZIERT**

**Absolute Must-Haves:**
1. ✅ Rechtliche Dokumente (8h) ✅ **ERLEDIGT** - Nur noch Firmendaten ausfüllen (15-30 Min)
2. Sicherheit-Basics (12h) - Security Headers, Rate Limiting, CSRF
3. Authentication (12h)
4. Upload-System mit Sicherheit (12h) ✅ **ERLEDIGT** - Server-side Validation vollständig implementiert
5. n8n Callback-Endpunkte (8h) ✅ REDUZIERT - Webhooks → n8n bereits vorhanden
6. Database Schema (8h)
7. Basic UI/UX (8h) ✅ REDUZIERT - Viele Komponenten bereits vorhanden
8. Error Handling (2h) ✅ REDUZIERT - Error Boundary & Sentry bereits vorhanden
9. Deployment Setup (4h)
10. Testing (minimal, 8h)
11. Monitoring (2h) ✅ REDUZIERT - Sentry bereits vorhanden

**Bereits vorhanden (Zeitersparnis ~35-42h):**
- ✅ Sentry Error Tracking
- ✅ Toast Notifications
- ✅ Error Boundary
- ✅ n8n Webhook-Integration (Next.js → n8n)
- ✅ File Upload UI mit Progress
- ✅ File Upload Server-side Validierung (zentrale Konfiguration)
- ✅ File Cleanup & Retention Policy (Konfiguration & Cron-Job-Struktur)
- ✅ Chunked Upload (optional, für zukünftige Erweiterung)
- ✅ Environment Variable Validation
- ✅ Dark Mode
- ✅ Rechtliche Seiten (Impressum, Datenschutz, AGB, Widerruf, Cookies)
- ✅ Cookie-Consent Banner

### Empfohlener Launch
**Geschätzte Zeit:** 120-160 Stunden (3-4 Wochen Fulltime) ✅ **REDUZIERT**

**Zusätzlich zum MVP:**
- Erweiterte Sicherheit (Rate Limiting, CSRF, etc.)
- Vollständige UI/UX (viele Komponenten bereits vorhanden)
- Email-System
- Analytics (Sentry bereits vorhanden)
- Comprehensive Testing
- Documentation
- SEO Optimization
- n8n Monitoring & Resilience

### Idealer Launch
**Geschätzte Zeit:** 250-320 Stunden (6-8 Wochen Fulltime)

**Zusätzlich:**
- Advanced Features
- Advanced Security (2FA)
- Performance Optimization
- Extensive Testing
- Marketing Content
- API (optional)

---

## ⚡ Quick-Win Checkliste (Was kann sofort gemacht werden?)

### In 1 Tag:
- [x] Impressum erstellen und live stellen ✅ **ERSTELLT** - ⚠️ Firmendaten ausfüllen!
- [x] Datenschutzerklärung mit Generator erstellen ✅ **VOLLSTÄNDIG**
- [x] Cookie-Banner implementieren ✅ **VOLLSTÄNDIG**
- [ ] 404/500 Error Pages erstellen (Error Boundary bereits vorhanden)
- [ ] Security Headers konfigurieren
- [x] .env Validation einrichten ✅ (bereits vorhanden)

### In 1 Woche:
- [x] AGB schreiben ✅ **VOLLSTÄNDIG**
- [ ] Authentication mit NextAuth implementieren
- [ ] Database Schema aufsetzen
- [ ] Rate Limiting für kritische Endpunkte
- [ ] File Upload Validierung (Server-side - Client-side bereits vorhanden)
- [x] Error Tracking (Sentry) Setup ✅ (bereits vorhanden)
- [ ] Basic Analytics

### In 2 Wochen:
- [ ] Transkription mit Whisper API
- [ ] Textgenerierung mit Claude API
- [ ] Upload mit Vercel Blob
- [ ] Email-System mit Resend
- [ ] Monitoring & Logging
- [ ] Basic Testing

---

## 🚨 Kritische Fehler-Zusammenfassung

> ✅ **UPDATE:** Da n8n bereits läuft, ist die KI-Integration selbst nicht der Blocker - aber die **Webhook-Integration zwischen Next.js und n8n** muss sauber implementiert sein!

### 🔴 BLOCKER (Launch nicht möglich ohne):
1. ~~**Impressum fehlt**~~ ✅ **SEITE ERSTELLT** - ⚠️ **Firmendaten noch ausfüllen!**
2. ~~**Datenschutzerklärung fehlt**~~ ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
3. ~~**Cookie-Banner fehlt**~~ ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
4. **Keine Authentication** - Keine User-Verwaltung!
5. **Upload-Sicherheit ungeklärt** - Malware-Risiko! (Server-side Validation ✅, Virus-Scanning fehlt)
6. **n8n Webhook-Integration unklar** - Kommunikation Next.js ↔ n8n muss funktionieren!
7. ~~**Keine Rate Limiting**~~ ✅ **IMPLEMENTIERT**
8. ~~**Input Validation unklar**~~ ✅ **VOLLSTÄNDIG IMPLEMENTIERT**

### 🟠 KRITISCHE MÄNGEL (Dringend beheben):
9. ~~Security Headers unvollständig~~ ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
10. ~~CSRF Protection fehlt~~ ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
11. Virus-Scanning fehlt
12. Storage-Strategie unklar (Dateien gehen direkt zu n8n)
13. Keine Cleanup-Policy (DSGVO!)
14. n8n Callback Authentication fehlt wahrscheinlich
15. n8n Error Handling in Next.js unklar
16. n8n Kosten-Tracking fehlt
17. Analytics fehlt (Sentry Error Tracking ✅ vorhanden)
18. ~~Error Tracking fehlt~~ ✅ **SENTRY VORHANDEN**
19. Keine Tests

### 🟡 WICHTIGE n8n-SPEZIFISCHE PUNKTE:
20. n8n Webhook Security (HMAC Signing)
21. n8n Retry-Logik bei Failures
22. n8n Timeout Handling
23. n8n Workflow Backups
24. n8n Monitoring & Alerts
25. Request-ID Tracking (Next.js → n8n → zurück)
26. n8n Usage Limits pro User durchsetzen

### 🟡 WICHTIGE VERBESSERUNGEN:
17. Viele UI-Seiten fehlen (Dashboard, Profile, Settings, Kontakt)
18. Loading States teilweise vorhanden (Upload Progress ✅, Text Generation Loading ✅)
19. ~~Toast Notifications fehlen~~ ✅ **VORHANDEN**
20. Form Validation unklar (Client-side teilweise vorhanden)
21. Responsive Design zu prüfen (wahrscheinlich vorhanden, aber zu testen)
22. Email-System fehlt
23. API Documentation fehlt
24. SEO nicht optimiert

---

## 📝 Abschließende Empfehlung

**Aktueller Status:** Die Website sieht professionell aus, ist aber **NICHT launch-ready**. Es fehlen fundamentale Features und rechtliche Anforderungen.

> ✅ **POSITIV:** 
> - Da n8n bereits läuft, sparst du ~40-50 Stunden Entwicklungszeit für die reine KI-Integration!
> - Viele UI-Komponenten sind bereits vorhanden (Toast, Error Boundary, Upload UI, Dark Mode)
> - Sentry Error Tracking ist vollständig implementiert
> - n8n Webhook-Integration (Next.js → n8n) funktioniert bereits

**Minimale Zeit bis Launch:** 1.5-2 Wochen intensive Arbeit (Fulltime) ✅ **REDUZIERT**

**Empfohlene Zeit bis Launch:** 3-4 Wochen für einen soliden Launch ✅ **REDUZIERT**

**Kritischer Punkt:** Die **Webhook-Integration zwischen Next.js und n8n** ist teilweise vorhanden:
- ✅ Next.js → n8n Webhooks funktionieren (`/api/upload`, `/api/chat`)
- ❌ n8n → Next.js Callbacks fehlen komplett (benötigt für Status-Updates)
- ❌ Webhooks sind nicht authentifiziert (HMAC fehlt)
- ⚠️ Error Handling vorhanden, aber Retry-Logik fehlt
- ❌ Timeouts werden nicht korrekt gehandhabt
- ❌ Kosten-Tracking fehlt
- ❌ Status-Updates werden nicht zuverlässig übermittelt (Callbacks fehlen)

**Priorität 1:** ✅ **Rechtliche Dokumente** - Seiten erstellt, Firmendaten ausfüllen (15-30 Min)
**Priorität 2:** Sicherheit (Rate Limiting, Input Validation, Upload Security - 3-4 Tage)
**Priorität 3:** n8n Integration verifizieren und härten (2-3 Tage)
**Priorität 4:** Authentication implementieren (2-3 Tage)
**Priorität 5:** UI/UX vervollständigen (1 Woche)

**Next Steps:**
1. ✅ **Tag 1:** Rechtliche Dokumente erstellt - ⚠️ **Firmendaten in Impressum ausfüllen!**
2. **Tag 1-2:** Security-Audit durchführen und Lücken schließen
3. **Tag 4-5:** n8n Webhook-Integration testen und härten
4. **Tag 6-8:** Authentication implementieren
5. **Woche 2:** UI/UX vervollständigen
6. **Woche 3:** Testing & Bug-Fixing
7. **Woche 3-4:** Beta-Launch vorbereiten
8. **Woche 4:** Beta mit ausgewählten Usern
9. **Woche 5:** Feedback sammeln & iterieren
10. **Woche 6:** Public Launch

**Besondere Beachtung für n8n:**
- Dokumentiere alle n8n Workflows
- Exportiere regelmäßig n8n Workflow Backups
- Richte n8n Monitoring/Alerts ein
- Teste alle Fehlerszenarien (n8n down, Timeout, etc.)
- Implementiere Retry-Queue für fehlgeschlagene Workflows

---

**Erstellt am:** 29. Januar 2026  
**Aktualisiert am:** 29. Januar 2026 (Rechtliche Seiten + Sicherheit 2.x + Upload 3.1/3.4/3.6 implementiert)  
**Für:** timax.vercel.app  
**Version:** 1.3 - Vollständige Launch-Checkliste (Rechtliche Seiten ✅ + Upload-System ✅)

> ✅ **VERIFIKATION DURCHGEFÜHRT:** Diese Checkliste wurde am 29. Januar 2026 mit dem tatsächlichen Code abgeglichen. Status-Werte wurden aktualisiert basierend auf vorhandener Implementierung.
> 
> ✅ **UPDATE 29.01.2026:** Rechtliche Seiten (1.1-1.5) vollständig implementiert:
> - Impressum-Seite erstellt (Firmendaten noch ausfüllen!)
> - Datenschutzerklärung DSGVO-konform implementiert
> - AGB mit KI-Haftungsausschluss erstellt
> - Widerrufsbelehrung mit Musterformular
> - Cookie-Richtlinie Seite
> - Cookie-Consent Banner mit granularer Auswahl
> - Footer auf allen Seiten erweitert
>
> ✅ **UPDATE 29.01.2026:** Sicherheit (2.1-2.5) vollständig implementiert:
> - Security Headers in next.config.ts
> - Content Security Policy (CSP) mit Nonce-Support in middleware.ts
> - Rate Limiting für alle API-Endpunkte
> - Input Validation & Sanitization mit Zod
> - CSRF Protection mit Token-basierter Validierung
>
> ✅ **UPDATE 29.01.2026:** Upload & File-Handling (3.1, 3.4, 3.6) implementiert:
> - File Upload Restrictions: Zentrale Konfiguration (`src/lib/upload-config.ts`)
> - Server-side Validierung vollständig (Dateigröße, MIME-Type, Extension, Magic Bytes)
> - File Cleanup & Retention Policy: Konfiguration und Cron-Job-Struktur erstellt
> - Chunked Upload: Utilities implementiert (optional, für zukünftige Erweiterung)

*Diese Checkliste sollte als lebendiges Dokument behandelt werden und regelmäßig aktualisiert werden, wenn Features implementiert oder neue Anforderungen identifiziert werden.*

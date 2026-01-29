# 👥 Multi-User-Support Implementierungsplan

**Datum:** 2026-01-28  
**Status:** Planung für Multi-User-Authentifizierung und Datenbank-Integration

---

## 🎯 Ziel

Mehrere User sollen die Anwendung nutzen können mit:
- ✅ Individuellen Accounts (Login/Registrierung)
- ✅ Persistenter Chat-Historie pro User
- ✅ User-spezifischen Uploads und Transkripten
- ✅ Session-Management auf Backend
- ✅ Daten-Isolation zwischen Usern

---

## 📊 Aktueller Stand

### ❌ Was fehlt:
- **Authentifizierung:** Keine Login/Registrierung
- **Datenbank:** Keine persistente Speicherung
- **User-Management:** Keine User-Daten
- **Session-Management:** Nur client-seitig (localStorage)
- **Daten-Isolation:** Alle Sessions sind anonym

### ✅ Was funktioniert:
- Chat-Interface mit Session-IDs
- Upload-Funktionalität
- n8n-Integration
- Frontend-Komponenten

---

## 🚀 Implementierungsoptionen

### Option 1: NextAuth.js + Supabase (EMPFOHLEN) ⭐

**Vorteile:**
- ✅ Schnellste Implementierung (2-3 Tage)
- ✅ Supabase bietet: Auth + Datenbank + Storage in einem
- ✅ NextAuth.js ist Next.js-Standard für Auth
- ✅ OAuth-Provider (Google, GitHub) out-of-the-box
- ✅ Kostenloser Tier für Start
- ✅ Real-time Features möglich

**Nachteile:**
- Vendor-Lock-in zu Supabase
- Abhängigkeit von externem Service

**Zeitaufwand:** 2-3 Tage  
**Komplexität:** Mittel

---

### Option 2: NextAuth.js + Prisma + PostgreSQL

**Vorteile:**
- ✅ Vollständige Kontrolle über Datenbank
- ✅ Kein Vendor-Lock-in
- ✅ Professionelle Lösung für Production
- ✅ Flexibel erweiterbar

**Nachteile:**
- ⚠️ Mehr Setup-Aufwand (Datenbank-Server, Migrations)
- ⚠️ Mehr Wartung nötig
- ⚠️ Längerer Implementierungszeitraum

**Zeitaufwand:** 4-5 Tage  
**Komplexität:** Hoch

---

### Option 3: Clerk (Managed Auth Service)

**Vorteile:**
- ✅ Sehr schnelle Integration (1-2 Tage)
- ✅ UI-Komponenten bereits vorhanden
- ✅ Sehr gute UX
- ✅ Multi-Factor-Auth out-of-the-box

**Nachteile:**
- ⚠️ Kostenpflichtig ab bestimmter User-Anzahl
- ⚠️ Vendor-Lock-in
- ⚠️ Datenbank muss separat eingerichtet werden

**Zeitaufwand:** 1-2 Tage (Auth) + 2-3 Tage (Datenbank) = 3-5 Tage  
**Komplexität:** Mittel

---

## 🎯 Empfehlung: Option 1 (NextAuth.js + Supabase)

### Warum Supabase?
1. **All-in-One:** Auth + Datenbank + Storage
2. **Schnell:** Setup in Minuten, nicht Stunden
3. **Kostenlos:** Generous free tier
4. **Next.js-optimiert:** Offizielle Supabase-Integration
5. **Real-time:** Kann später für Live-Updates genutzt werden

---

## 📋 Implementierungsplan (NextAuth.js + Supabase)

### Phase 1: Setup & Datenbank-Schema (Tag 1)

#### 1.1 Supabase-Projekt erstellen
- [ ] Supabase Account erstellen
- [ ] Neues Projekt anlegen
- [ ] API-Keys kopieren

#### 1.2 Dependencies installieren
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth
```

#### 1.3 Datenbank-Schema erstellen
```sql
-- Users Table (wird von Supabase Auth automatisch erstellt)
-- Wir nutzen auth.users

-- Chats Table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploads Table
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  status TEXT DEFAULT 'processing',
  transcript_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes für Performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
```

#### 1.4 Row Level Security (RLS) Policies
```sql
-- Chats: User kann nur eigene Chats sehen
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages: User kann nur Messages seiner Chats sehen
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

-- Uploads: User kann nur eigene Uploads sehen
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own uploads" ON uploads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

### Phase 2: NextAuth.js Integration (Tag 1-2)

#### 2.1 NextAuth.js konfigurieren
**Datei:** `my-app/src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### 2.2 Session Provider hinzufügen
**Datei:** `my-app/src/app/layout.tsx`

```typescript
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

#### 2.3 Auth-Helper Hook erstellen
**Datei:** `my-app/src/lib/auth.ts`

```typescript
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  };
}
```

---

### Phase 3: API-Routen anpassen (Tag 2)

#### 3.1 Chat API Route erweitern
**Datei:** `my-app/src/app/api/chat/route.ts`

- [ ] User-ID aus Session extrahieren
- [ ] Chat in Datenbank speichern/laden
- [ ] Messages in Datenbank speichern
- [ ] Chat-Historie aus Datenbank laden

#### 3.2 Upload API Route erweitern
**Datei:** `my-app/src/app/api/upload/route.ts`

- [ ] User-ID aus Session extrahieren
- [ ] Upload-Metadaten in Datenbank speichern
- [ ] User-spezifische Uploads zurückgeben

#### 3.3 Neue API-Routen erstellen
- [ ] `GET /api/chats` - Liste aller Chats des Users
- [ ] `GET /api/chats/[id]` - Einzelner Chat mit Messages
- [ ] `POST /api/chats` - Neuen Chat erstellen
- [ ] `DELETE /api/chats/[id]` - Chat löschen
- [ ] `GET /api/uploads` - Liste aller Uploads des Users

---

### Phase 4: Frontend-Komponenten anpassen (Tag 2-3)

#### 4.1 Login/Registrierung Komponenten
- [ ] Login-Seite (`/login`)
- [ ] Registrierungs-Seite (`/register`)
- [ ] Auth-Buttons in Navigation

#### 4.2 Chat-Interface anpassen
- [ ] User-ID aus Session holen
- [ ] Chat-Historie aus Datenbank laden
- [ ] Messages in Datenbank speichern
- [ ] Chat-Liste anzeigen (Sidebar)

#### 4.3 Upload-Komponente anpassen
- [ ] User-ID zu Upload-Metadaten hinzufügen
- [ ] User-spezifische Uploads anzeigen

#### 4.4 Navigation erweitern
- [ ] User-Menü (Avatar, Logout)
- [ ] Protected Routes (nur für eingeloggte User)

---

### Phase 5: Testing & Deployment (Tag 3)

#### 5.1 Testing
- [ ] Login/Registrierung testen
- [ ] Chat-Persistenz testen
- [ ] Upload-Isolation testen
- [ ] Multi-User-Szenarien testen

#### 5.2 Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (optional)
EMAIL_SERVER=smtp://...
EMAIL_FROM=noreply@timax.com
```

#### 5.3 Deployment
- [ ] Supabase-Projekt auf Production umstellen
- [ ] Environment Variables auf Vercel setzen
- [ ] Deployment testen

---

## 📊 Zeitaufwand-Zusammenfassung

| Phase | Aufgabe | Zeitaufwand |
|-------|---------|-------------|
| Phase 1 | Supabase Setup + Schema | 4-6 Stunden |
| Phase 2 | NextAuth.js Integration | 4-6 Stunden |
| Phase 3 | API-Routen anpassen | 6-8 Stunden |
| Phase 4 | Frontend-Komponenten | 8-10 Stunden |
| Phase 5 | Testing & Deployment | 4-6 Stunden |
| **GESAMT** | | **26-36 Stunden (3-4 Tage)** |

---

## 🎯 Launch-Zeitplan mit Multi-User-Support

### MVP-Launch mit Multi-User: **2-3 Wochen**

**Woche 1:**
- ✅ Supabase Setup + NextAuth.js Integration
- ✅ Datenbank-Schema + RLS Policies
- ✅ API-Routen anpassen

**Woche 2:**
- ✅ Frontend-Komponenten (Login, Chat, Upload)
- ✅ Testing & Bug-Fixes
- ✅ Error-Tracking + Analytics

**Woche 3:**
- ✅ Finale Tests
- ✅ Production-Deployment
- ✅ Monitoring einrichten

---

## 🔄 Alternative: Schneller MVP ohne Auth (nicht empfohlen)

Wenn Multi-User-Support **nicht** sofort nötig ist:

**MVP ohne Auth:** 1-2 Wochen  
**Dann später Auth hinzufügen:** +1 Woche

**Problem:** Viel Refactoring nötig, wenn Auth später kommt.

---

## ✅ Checkliste für Multi-User-Launch

### Kritisch (muss vor Launch):
- [ ] Supabase-Projekt eingerichtet
- [ ] Datenbank-Schema erstellt
- [ ] NextAuth.js konfiguriert
- [ ] Login/Registrierung funktioniert
- [ ] Chat-Historie wird persistent gespeichert
- [ ] Uploads sind user-spezifisch
- [ ] RLS Policies aktiviert
- [ ] Error-Tracking (Sentry)
- [ ] Analytics (Plausible/GA)

### Wichtig (für stabilen Betrieb):
- [ ] Email-Verification
- [ ] Password-Reset
- [ ] Session-Management
- [ ] Rate-Limiting
- [ ] Tests geschrieben

### Nice-to-have:
- [ ] OAuth-Provider (Google, GitHub)
- [ ] Profile-Seite
- [ ] User-Einstellungen
- [ ] Admin-Dashboard

---

## 🚨 Wichtige Überlegungen

### Daten-Migration
Wenn bereits Daten existieren:
- Anonyme Sessions müssen User zugeordnet werden
- Uploads müssen User zugeordnet werden
- Migration-Script nötig

### Kosten
- **Supabase Free Tier:** 500MB Datenbank, 1GB Storage, 50.000 monatliche aktive User
- **Vercel:** Free Tier für Hosting
- **Kostenlos für Start**, später skalierbar

### Sicherheit
- ✅ Row Level Security (RLS) aktiviert
- ✅ Passwords werden gehashed (Supabase)
- ✅ JWT-Tokens für Sessions
- ✅ HTTPS erforderlich

---

## 📝 Fazit

**Mit Multi-User-Support: Launch in 2-3 Wochen möglich**

Die Implementierung ist gut planbar und mit NextAuth.js + Supabase relativ schnell umsetzbar. Die größten Herausforderungen sind:
1. Datenbank-Schema-Design
2. Frontend-Komponenten für Auth
3. API-Routen-Anpassungen

Aber alles ist machbar und gut dokumentiert.


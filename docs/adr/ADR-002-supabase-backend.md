# ADR-002: Supabase als Backend

Datum: 2024-01-20
Status: Akzeptiert

## Kontext

Wir benötigten ein Backend für:
- Datenbank (PostgreSQL)
- Authentifizierung
- Real-time Features
- File Storage

Optionen:
- Supabase (Firebase-Alternative)
- Firebase
- Eigenes Backend (Node.js + PostgreSQL)
- PlanetScale (MySQL)

## Entscheidung

Wir verwenden **Supabase**.

## Begründung

### Vorteile Supabase

1. **PostgreSQL** - Industriestandard, leistungsstark
2. **Row Level Security** - Feingranulare Berechtigungen
3. **Real-time** - Live-Updates über WebSockets
4. **Edge Functions** - Serverless Functions
5. **Storage** - Integrierter File Storage
6. **Self-Hosting** - Möglich bei Bedarf
7. **Open Source** - Keine Vendor Lock-in
8. **Preisgestaltung** - Günstig für Startups

### Nachteile

1. **Junges Produkt** - Weniger Features als Firebase
2. **Dokumentation** - Manchmal lückenhaft
3. **Scale** - Performance bei sehr großen Datenmengen?

## Konsequenzen

### Positiv
- PostgreSQL = Industriestandard
- RLS = Sichere Datenbankzugriffe
- Real-time = Live Chat/Updates einfach
- Open Source = Flexibilität

### Negativ
- Neue Technologie für Team
- Dokumentation manchmal unvollständig

## Datenbank Schema

```sql
-- Users (von Clerk verwaltet)
-- Chats
-- Messages
-- Transcripts
-- Uploads
-- Sessions
```

## Sicherheit

- RLS Policies für alle Tabellen
- Service Role nur in Server Actions
- Client nutzt Anon Key mit RLS

## Verwandte ADRs

- ADR-001: Next.js App Router (nutzt Supabase in Server Components)
- ADR-003: Clerk für Authentifizierung (ergänzt Supabase)

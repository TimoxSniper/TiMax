# Architecture Decision Records (ADRs)

Dieses Verzeichnis enthält Architecture Decision Records (ADRs) für TiMax.

## Was ist ein ADR?

Ein ADR dokumentiert eine wichtige Architekturentscheidung, die:
- Den Projektverlauf beeinflusst
- Langfristige Konsequenzen hat
- Schwierig zu ändern ist

## Struktur

```markdown
# [Nummer]. [Titel]

Datum: [YYYY-MM-DD]
Status: [vorgeschlagen | akzeptiert | deprecated | überschrieben]

## Kontext
Was ist der Hintergrund? Welches Problem lösen wir?

## Entscheidung
Was haben wir entschieden?

## Konsequenzen
- Positiv: Was ist besser?
- Negativ: Was ist schwieriger?
- Neutral: Was muss dokumentiert werden?

## Alternativen
Welche Alternativen haben wir erwogen?

## Verwandte ADRs
- Links zu verwandten ADRs
```

## Liste der ADRs

1. [ADR-001: Next.js App Router vs Pages Router](ADR-001-nextjs-app-router.md)
2. [ADR-002: Supabase als Backend](ADR-002-supabase-backend.md)
3. [ADR-003: Clerk für Authentifizierung](ADR-003-clerk-auth.md)
4. [ADR-004: n8n für Workflow Automation](ADR-004-n8n-workflows.md)
5. [ADR-005: Vitest für Testing](ADR-005-vitest-testing.md)

## Status

- **Akzeptiert** - Entscheidung ist aktiv und wird umgesetzt
- **Vorgeschlagen** - Entscheidung wird diskutiert
- **Deprecated** - Entscheidung ist nicht mehr relevant
- **Überschrieben** - Durch neuere ADR ersetzt

## Neue ADR erstellen

```bash
# Template kopieren und anpassen
cp ADR-TEMPLATE.md ADR-XXX-titel.md
```

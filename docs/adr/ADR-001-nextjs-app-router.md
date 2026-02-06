# ADR-001: Next.js App Router vs Pages Router

Datum: 2024-01-15
Status: Akzeptiert

## Kontext

Wir mussten entscheiden, welchen Routing-Ansatz wir für TiMax verwenden:
- Next.js Pages Router (traditionell, stabil)
- Next.js App Router (modern, experimentell)

## Entscheidung

Wir verwenden den **Next.js App Router**.

## Begründung

### Vorteile App Router

1. **Server Components** - Reduziert JavaScript-Bundle-Size
2. **Nested Layouts** - Einfachere Layout-Komposition
3. **Streaming** - Bessere Performance durch progressive Loading
4. **Parallel Routes** - Komplexere UI-Muster möglich
5. **Intercepting Routes** - Modale Dialoge einfacher
6. **Route Groups** - Bessere Organisation ohne URL-Impact
7. **Future-Proof** - Next.js investiert stark in App Router

### Nachteile

1. **Learning Curve** - Neue Konzepte (Server/Client Components)
2. **Ecosystem** - Nicht alle Bibliotheken unterstützen App Router
3. **Stability** - In Next.js 13/14 noch teils experimentell

## Konsequenzen

### Positiv
- Bessere Performance durch Server Components
- Weniger Client-Side JavaScript
- Moderne Architektur
- Einfachere Layout-Verwaltung

### Negativ
- Team muss neue Konzepte lernen
- Manche npm-Packages funktionieren nicht out-of-the-box
- Debuggen kann komplexer sein

## Alternativen erwogen

### Pages Router
- Stabil und bewährt
- Größeres Ökosystem
- Aber: Weniger optimiert für moderne Patterns

### Remix
- Gute Alternative
- Aber: Kleinere Community, weniger Integration mit Vercel

## Implementierung

```
app/
├── layout.tsx          # Root Layout
├── page.tsx            # Landing Page
├── (auth)/             # Route Group
│   ├── login/
│   └── register/
├── api/                # API Routes
│   └── [...]
└── [...]
```

## Verwandte ADRs

- ADR-002: Supabase als Backend (nutzt Server Components)
- ADR-003: Clerk für Authentifizierung (App Router kompatibel)

# ADR-003: Clerk für Authentifizierung

Datum: 2024-01-22
Status: Akzeptiert

## Kontext

Wir brauchten eine Authentifizierungslösung für:
- User Login/Signup
- Session Management
- OAuth (Google, GitHub, etc.)
- Password Reset
- Multi-Factor Authentication

Optionen:
- Clerk
- Supabase Auth
- NextAuth.js
- Auth0
- Firebase Auth

## Entscheidung

Wir verwenden **Clerk**.

## Begründung

### Vorteile Clerk

1. **Next.js Integration** - Sehr gut dokumentiert
2. **UI Components** - Fertige Login/Signup Komponenten
3. **Middleware** - Einfache Route Protection
4. **Organization Support** - Für spätere Multi-Tenant Features
5. **Dashboard** - Gutes Admin Dashboard
6. **Webhooks** - Ereignis-basierte Integration
7. **German Localization** - Deutsche Übersetzungen
8. **SAML/SSO** - Enterprise Features

### Nachteile

1. **Kosten** - Ab bestimmter User-Zahl kostenpflichtig
2. **Vendor Lock-in** - Schwierig zu migrieren
3. **Externe Abhängigkeit** - Funktioniert nur mit Clerk-Servern

## Konsequenzen

### Positiv
- Sehr schnelle Implementierung
- Professionelle UI out-of-the-box
- Einfache Middleware Integration
- Gute TypeScript Support
- Deutsche Lokalisierung

### Negativ
- Monatliche Kosten ab 10.000 MAU
- Abhängigkeit von Clerk-Infrastruktur
- Weniger Kontrolle als Eigenentwicklung

## Implementierung

```typescript
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // Auth Logic
});
```

```typescript
// layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
```

## Verwandte ADRs

- ADR-002: Supabase als Backend (Clerk ersetzt Supabase Auth)

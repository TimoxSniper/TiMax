# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TiMax is a German-language AI-powered video and audio transcription platform with automatic text generation. Built with Next.js 16 (App Router), it features multi-user authentication, AI chat, and file upload capabilities with vector-based knowledge management.

**Key Stack:**
- Next.js 16 (App Router) with TypeScript 5 (strict mode)
- Authentication: Clerk
- Database: Supabase (PostgreSQL)
- AI Processing: n8n workflows (Chat + Upload)
- Styling: Tailwind CSS 4 + shadcn/ui
- Testing: Vitest + React Testing Library
- Monitoring: Sentry

## Essential Commands

### Development
```bash
cd my-app
npm run dev              # Start dev server on localhost:3000
npm run build            # Production build
npm run start            # Production server
```

### Code Quality
```bash
npm run typecheck        # TypeScript type checking (strict mode)
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

### Testing
```bash
npm run test             # Run tests in watch mode
npm run test:single      # Run tests once
npm run test:coverage    # Generate coverage report
npm run test:ci          # CI tests (verbose)
```

### Validation (Pre-commit)
```bash
npm run validate         # Run typecheck + lint + tests
```

## Project Structure

```
my-app/src/
├── app/                    # Next.js 16 App Router
│   ├── api/               # API routes (see API Routes section)
│   │   ├── chat/          # Chat API (delegates to n8n)
│   │   ├── upload/        # Upload API (delegates to n8n)
│   │   ├── admin/         # Admin-only APIs
│   │   └── ...
│   ├── admin/             # Admin dashboard (requires admin role)
│   ├── chat/              # Chat interface
│   ├── upload/            # Upload interface
│   └── (public pages)/    # Homepage, legal pages, auth
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── chat/              # Chat-specific components
│   ├── upload/            # Upload-specific components
│   └── ...
├── lib/                   # Core utilities
│   ├── supabase/          # Supabase clients (client, server, admin)
│   ├── validation.ts      # Zod schemas
│   ├── csrf.ts            # CSRF protection
│   ├── rate-limit.ts      # Rate limiting (Upstash/in-memory)
│   └── ...
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
├── middleware.ts          # Auth + Rate Limiting + CSP
└── __tests__/             # Test files
```

## Architecture Patterns

### Authentication & Authorization

**Clerk-Based Multi-User System:**
- All protected routes require Clerk authentication
- Admin routes require `publicMetadata.role === "admin"`
- In development mode, first user is auto-assigned admin role
- User ID (`userId` from Clerk) is used for ALL data isolation

**Critical Pattern:** Every database query MUST filter by `user_id`:
```typescript
const { data } = await supabase
  .from('uploads')
  .select('*')
  .eq('user_id', userId);  // REQUIRED for multi-user isolation
```

### API Routes

**Next.js 15+ Dynamic Routes:**
All API route `params` are Promises and must be awaited:
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // MUST await params
  // ...
}
```

**API Architecture:**
- `/api/chat` → Delegates to n8n chat workflow webhook
- `/api/upload` → Delegates to n8n upload workflow webhook
- n8n handles AI processing (Claude AI, Whisper, Embeddings)
- n8n stores results back to Supabase
- Frontend polls or refetches to get results

**Rate Limiting:**
Configured in `middleware.ts`:
- Upload: 5 requests/hour
- Chat: 30 requests/minute
- Generate: 10 requests/hour
- Uses Upstash Redis (production) or in-memory (development)
- User-based when authenticated, IP-based otherwise

### Supabase Integration

**Three Client Types:**
1. `createClient()` - Client-side (browser), RLS-protected
2. `createServerClient()` - Server-side (API routes), RLS-protected
3. `createAdminClient()` - Admin bypass (use sparingly, only for admin operations)

**Database Schema:**
- `chats` - Chat sessions (user_id, session_id, title)
- `messages` - Chat messages (chat_id, role, content)
- `uploads` - File uploads (user_id, file_name, transcript, status)
- `waitlist` - Email signups

**Row Level Security (RLS):**
All tables have RLS policies filtering by `auth.uid()` (mapped from Clerk userId).

### Security Layers

**CSRF Protection:**
- Double Submit Cookie pattern
- Token generated per request
- Validated in API routes via `validateCsrfToken()`

**XSS Protection:**
- Input sanitization with Zod validation
- CSP headers in middleware
- Content-Security-Policy allows n8n webhooks, Clerk, Supabase

**File Upload Security:**
- Max 100MB file size
- Allowed types: MP4, WebM, MP3, WAV, M4A
- Filename validation (alphanumeric + `._-` only)
- Validation schemas in `lib/validation.ts`

### React Hydration (Next.js App Router)

**Common Issue:** Using `usePathname()` or other client-side hooks in components imported by Server Components causes hydration mismatches.

**Solution Pattern:**
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);

// Only apply client-specific logic after mount
const isActive = mounted && (pathname === item.href);
```

Add `suppressHydrationWarning` to elements that differ between server/client.

### n8n Workflow Integration

**Architecture:**
- Upload workflow: Receives file → Transcribes via Whisper → Extracts metadata → Stores in Supabase + Qdrant
- Chat workflow: Receives message + history → Searches Qdrant knowledge base → Generates response via Claude AI → Stores in Supabase

**Environment Variables Required:**
- `N8N_CHAT_WEBHOOK_URL` - n8n chat workflow webhook
- `N8N_UPLOAD_WEBHOOK_URL` - n8n upload workflow webhook

See `SETUP_SUPABASE.md` for complete n8n configuration.

## Testing Standards

**Test Coverage:** 224 passing tests covering:
- Input validation & XSS protection
- Security (CSRF, rate limiting)
- Error handling
- Utility functions
- Upload validation

**Test Structure:**
```typescript
describe("Feature", () => {
  it("should describe expected behavior", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Run single test file:**
```bash
npm run test:single -- src/__tests__/validation.test.ts
```

## Environment Variables

**Required:**
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# n8n Webhooks
N8N_CHAT_WEBHOOK_URL=https://xxx.n8n.cloud/webhook/timax-chat
N8N_UPLOAD_WEBHOOK_URL=https://xxx.n8n.cloud/webhook/timax-upload
```

**Optional (Production):**
```env
SENTRY_DSN=https://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=random_secret_string
```

See `.env.local.example` for complete list.

## Git Workflow

**Commit Convention (Conventional Commits):**
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, security
Scopes: auth, api, ui, chat, upload, db, config, deps
```

**Examples:**
```
feat(chat): add message streaming support
fix(api): resolve rate limiting issue for upload endpoint
security(csp): tighten content security policy
```

**Branch Strategy:**
- `main` - Production branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation

## Common Development Tasks

### Adding a New API Route

1. Create route in `src/app/api/[route]/route.ts`
2. Add rate limiting config in `middleware.ts` if needed
3. Validate inputs with Zod schemas from `lib/validation.ts`
4. Filter by `userId` for all database queries
5. Add CSRF validation for mutations
6. Write tests in `__tests__/`

### Adding a New Supabase Table

1. Update `supabase-schema.sql`
2. Add RLS policies filtering by `user_id`
3. Regenerate types: `npx supabase gen types typescript --project-id [id] > src/lib/supabase/database.types.ts`
4. Update validation schemas in `lib/validation.ts`

### Debugging n8n Workflows

1. Check n8n Execution History for detailed logs
2. Verify webhook URLs in `.env.local`
3. Test webhooks with curl (examples in `SETUP_SUPABASE.md`)
4. Check Supabase table for `status` field (uploads table)

## Important Notes

- **Language:** All UI text and documentation is in German
- **Timezone:** Europe/Berlin (UTC+1/UTC+2)
- **DSGVO Compliance:** Required for German market
- **Node Version:** 20.x required (specified in package.json engines)
- **Strict TypeScript:** No `any` types allowed
- **User Isolation:** ALWAYS filter by `user_id` - security critical!

## Additional Documentation

- `README.md` - General project overview
- `SETUP_SUPABASE.md` - Complete Supabase + n8n setup guide
- `SECURITY_BEST_PRACTICES.md` - Credential management
- `CONTRIBUTING.md` - Contribution guidelines
- `supabase-schema.sql` - Complete database schema with RLS

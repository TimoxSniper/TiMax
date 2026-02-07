# Security Best Practices - TiMax Project

## Environment Variables Management

### ✅ Current Security Status

- `.env.local` files are properly gitignored
- No credentials committed to git history
- Proper separation between example and actual credentials

### 🔐 Credential Management

#### Never Commit These Files:

- `.env.local`
- `.env.production`
- `.env.development.local`
- Any file containing actual API keys or secrets

#### Safe to Commit:

- `.env.example`
- `.env.local.example`
- Configuration templates with placeholder values

---

## Current Credentials Inventory

The following credentials are used in this project:

### 1. Clerk Authentication

- **Publishable Key** (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- **Secret Key** (CLERK_SECRET_KEY) - SENSITIVE
- Get from: https://dashboard.clerk.com

### 2. Supabase Database

- **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
- **Anon Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY) - VERY SENSITIVE
- Get from: https://app.supabase.com

### 3. Upstash Redis (Rate Limiting)

- **REST URL** (UPSTASH_REDIS_REST_URL)
- **REST Token** (UPSTASH_REDIS_REST_TOKEN) - SENSITIVE
- Get from: https://console.upstash.com
- **Status:** ⚠️ Currently using placeholders - NEEDS CONFIGURATION

### 4. n8n Webhooks

- **Chat Webhook URL** (N8N_CHAT_WEBHOOK_URL) - SENSITIVE
- **Upload Webhook URL** (N8N_UPLOAD_WEBHOOK_URL) - SENSITIVE
- Configure in: Your n8n instance

### 5. GitHub (for auto-pull script)

- **Personal Access Token** (GITHUB_TOKEN) - SENSITIVE
- Generate at: https://github.com/settings/tokens

### 6. Cron Job Secret

- **CRON_SECRET** - SENSITIVE
- Generate random string (e.g., `openssl rand -hex 32`)

---

## Rotating Credentials

If you suspect credentials have been exposed:

### 1. Clerk

1. Go to https://dashboard.clerk.com
2. Navigate to API Keys
3. Click "Rotate Keys"
4. Update `.env.local` with new keys
5. Redeploy application

### 2. Supabase

1. Go to https://app.supabase.com
2. Project Settings → API
3. Generate new service role key
4. Update `.env.local`
5. **Note:** Anon key is safe to expose (with proper RLS)

### 3. GitHub Token

1. Go to https://github.com/settings/tokens
2. Revoke old token
3. Generate new token with same permissions
4. Update `.env.local`

### 4. n8n Webhooks

1. Go to your n8n workflows
2. Delete and recreate webhook nodes
3. Copy new URLs
4. Update `.env.local`

### 5. Upstash Redis

1. Go to https://console.upstash.com
2. Delete and recreate database (or rotate credentials if supported)
3. Update `.env.local`

---

## Pre-commit Hooks (Recommended)

Install git hooks to prevent accidental credential commits:

```bash
# Install pre-commit framework
pip install pre-commit

# Create .pre-commit-config.yaml with secret detection
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files
      - id: check-merge-conflict

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# Install hooks
pre-commit install
```

---

## GitHub Secret Scanning

Enable secret scanning in repository settings:

1. Go to repository Settings
2. Security & analysis
3. Enable "Secret scanning"
4. Enable "Push protection"

---

## Vercel Deployment

For production deployment on Vercel:

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all required environment variables
3. **Never** include credentials in vercel.json or next.config.ts
4. Use Vercel's encrypted environment variables

---

## Security Checklist

- [ ] All `.env.local` files are gitignored
- [ ] `.env.example` contains only placeholder values
- [ ] No credentials in source code or config files
- [ ] Upstash Redis configured (currently using placeholders)
- [ ] CRON_SECRET is set to random value
- [ ] GitHub secret scanning enabled
- [ ] Pre-commit hooks installed (optional)
- [ ] Team members trained on credential handling
- [ ] Regular security audits scheduled

---

## What to Do If Credentials Are Leaked

1. **Immediately rotate all affected credentials**
2. Check application logs for suspicious activity
3. Review git history: `git log --all --full-history -- .env*`
4. If committed, use `git filter-repo` to clean history
5. Force push cleaned history
6. Notify all team members to re-clone repository
7. Monitor services for unusual activity (Supabase logs, Clerk logs, etc.)

---

## Additional Resources

- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** 2026-02-04
**Reviewed By:** Claude Code Analysis

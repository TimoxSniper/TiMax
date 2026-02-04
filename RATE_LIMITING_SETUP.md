# Rate Limiting Setup Guide

## Current Status

⚠️ **Rate limiting is currently DISABLED** because Upstash Redis credentials are not configured.

The application is running in "fail-open" mode, which means if Redis is unavailable, all requests are allowed. This is a **security risk** in production.

---

## Option 1: Upstash Redis (Recommended for Production)

### Why Upstash?
- Serverless Redis (no server management)
- Global edge caching
- Free tier available (10,000 requests/day)
- Works great with Vercel

### Setup Steps:

1. **Create Upstash Account**
   - Go to https://console.upstash.com
   - Sign up (free tier available)

2. **Create Redis Database**
   - Click "Create Database"
   - Choose a region close to your users
   - Select "Global" for better performance
   - Click "Create"

3. **Get Credentials**
   - Go to database Details tab
   - Copy "UPSTASH_REDIS_REST_URL"
   - Copy "UPSTASH_REDIS_REST_TOKEN"

4. **Add to Environment Variables**
   ```bash
   # In .env.local
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

5. **Verify Configuration**
   ```bash
   cd my-app
   npm run dev
   # Check console - should NOT see "Rate Limiting ist deaktiviert" warning
   ```

6. **For Vercel Deployment**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add UPSTASH_REDIS_REST_URL
   - Add UPSTASH_REDIS_REST_TOKEN
   - Redeploy

---

## Option 2: In-Memory Rate Limiting (Development Only)

⚠️ **WARNING:** This is only suitable for development/testing. DO NOT use in production!

An in-memory fallback has been implemented that will work without Redis, but it:
- Only works on a single server (doesn't scale)
- Resets when server restarts
- Won't work with Vercel (serverless functions)

---

## Rate Limit Configuration

Current limits (can be customized in .env.local):

| Endpoint | Max Requests | Window | Env Variable |
|----------|--------------|--------|--------------|
| `/api/upload` | 5 | 1 hour | RATE_LIMIT_UPLOAD_MAX |
| `/api/chat` | 20 | 1 minute | RATE_LIMIT_CHAT_MAX |
| `/api/generate` | 10 | 1 hour | RATE_LIMIT_GENERATE_MAX |
| Default (all other) | 100 | 1 minute | RATE_LIMIT_DEFAULT_MAX |

### Customize Limits

Add to `.env.local`:
```env
# More restrictive
RATE_LIMIT_UPLOAD_MAX=3
RATE_LIMIT_CHAT_MAX=10

# More permissive
RATE_LIMIT_UPLOAD_MAX=10
RATE_LIMIT_CHAT_MAX=50
```

---

## Testing Rate Limiting

### Manual Test:
```bash
# Test upload endpoint (should block after 5 requests in 1 hour)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/upload \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}'
  echo "Request $i"
  sleep 1
done

# After 5 requests, you should see:
# {"error":"Rate limit exceeded","message":"Zu viele Anfragen..."}
```

### Check Headers:
```bash
curl -I http://localhost:3000/api/chat
# Look for:
# X-RateLimit-Remaining: 19
# X-RateLimit-Reset: 1234567890
# Retry-After: 60 (if rate limited)
```

---

## Monitoring

### Check Redis Connection:
```bash
# Add to any API route temporarily:
import { redis } from '@/lib/redis';
const ping = await redis.ping();
console.log('Redis status:', ping); // Should log "PONG"
```

### Upstash Dashboard:
- Go to https://console.upstash.com
- View your database
- Check "Metrics" tab for:
  - Request count
  - Latency
  - Error rate

---

## Troubleshooting

### "Rate Limiting ist deaktiviert" Warning

**Cause:** Redis credentials not configured or invalid

**Fix:**
1. Check `.env.local` has UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
2. Verify credentials are correct (no extra spaces, quotes)
3. Test connection with curl:
   ```bash
   curl https://your-database.upstash.io/ping \
     -H "Authorization: Bearer your_token"
   # Should return: {"result":"PONG"}
   ```

### Rate Limiting Not Working

**Symptoms:** Can make unlimited requests

**Debug Steps:**
1. Check console for warning message
2. Verify middleware.ts is being executed (add console.log)
3. Check Redis connection
4. Verify rate limit headers are present in response

### All Requests Returning 429

**Cause:** Rate limit set too low or IP detection issue

**Fix:**
1. Check rate limit configuration
2. Verify IP detection in middleware (check getClientIP function)
3. Clear Redis keys: Delete key pattern `ratelimit:*` in Upstash dashboard

---

## Security Notes

1. **Don't Expose Redis Credentials**
   - Never commit to git
   - Use environment variables only
   - Rotate periodically

2. **IP Spoofing**
   - The middleware uses trusted headers (CF-Connecting-IP, X-Real-IP)
   - Behind Cloudflare/Vercel, this is safe
   - Direct deployment may need additional validation

3. **Bypass Prevention**
   - Rate limiting is applied in middleware (before routes)
   - Cannot be bypassed by changing headers
   - Redis ensures distributed rate limiting

---

## Cost Estimation (Upstash Free Tier)

Free Tier Limits:
- 10,000 requests/day
- 100 MB storage
- Global replication

For TiMax with ~1000 users/day:
- Average: ~50,000 rate limit checks/day
- **Exceeds free tier** → Upgrade to Pro ($0.20/100K requests)
- Monthly cost: ~$3-5 for 1M requests

---

## Alternative Solutions

If Upstash doesn't work for you:

1. **Redis Labs** (https://redis.com/try-free/)
2. **AWS ElastiCache** (if using AWS)
3. **Vercel KV** (built-in Redis for Vercel)
4. **In-Memory** (development only - already implemented)

---

**Last Updated:** 2026-02-04

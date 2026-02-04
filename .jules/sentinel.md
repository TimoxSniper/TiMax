# Sentinel's Journal - Critical Security Learnings

## 2025-05-15 - [CSRF Timing Safe Comparison Crash]
**Vulnerability:** Denial of Service (DoS) via CSRF token comparison.
**Learning:** Node.js `crypto.timingSafeEqual` throws an error if the buffers have different lengths, causing a 500 error instead of a 403. This can be exploited to crash the request handler by sending a token of unexpected length.
**Prevention:** Always compare buffer lengths before calling `timingSafeEqual`.

## 2025-05-15 - [IP Spoofing in Middleware]
**Vulnerability:** Rate limit bypass via IP spoofing.
**Learning:** Trusting the first IP in `X-Forwarded-For` without validating the proxy chain is unsafe as clients can easily spoof this header.
**Prevention:** Prioritize platform-provided IP (like `request.ip` on Vercel) or specific headers from trusted proxies (like `CF-Connecting-IP`).

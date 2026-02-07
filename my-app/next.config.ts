import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace-Root für Vercel/CI (vermeidet Warnung bei mehreren Lockfiles)
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },

  // Performance Optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "framer-motion"],
  },

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Compression
  compress: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.timax.xyz https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://clerk.timax.xyz https://*.clerk.accounts.dev https://*.sentry.io https://*.supabase.co https://clerk-telemetry.com https://*.n8n.cloud https://zapkothimofej.app.n8n.cloud; img-src 'self' data: https://img.clerk.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self' https://challenges.cloudflare.com; worker-src 'self' blob:;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocations=()",
          },
        ],
      },
      // Cache static assets
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache public assets
      {
        source: "/:path*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // www to non-www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.timax.xyz",
          },
        ],
        destination: "https://timax.xyz/:path*",
        permanent: true,
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

// Make sure adding Sentry options is the last code to run before exporting
// Sentry-Konfiguration nur aktivieren, wenn SENTRY_ORG und SENTRY_PROJECT gesetzt sind
// Dies verhindert Build-Fehler in Vercel, wenn die Sentry-Umgebungsvariablen nicht konfiguriert sind
const sentryOptions =
  process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
    ? {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,

        // Only print logs for uploading source maps in CI
        silent: !process.env.CI,

        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
        // This can increase your server load as well as your hosting bill.
        // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
        // side errors will fail.
        tunnelRoute: "/monitoring",
      }
    : undefined;

export default sentryOptions ? withSentryConfig(nextConfig, sentryOptions) : nextConfig;

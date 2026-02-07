import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://timax.xyz";

  return {
    rules: [
      // Standard web crawlers
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/ai.txt", "/manifest.json"],
        disallow: ["/api/", "/chat", "/upload", "/uploads", "/sign-in", "/sign-up"],
      },
      // Google specific
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/chat", "/upload", "/uploads", "/sign-in", "/sign-up"],
      },
      // AI crawlers - allow access to documentation
      {
        userAgent: "GPTBot",
        allow: ["/llms.txt", "/ai.txt", "/"],
        disallow: ["/api/", "/chat", "/upload", "/uploads"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/llms.txt", "/ai.txt", "/"],
        disallow: ["/api/", "/chat", "/upload", "/uploads"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/llms.txt", "/ai.txt", "/"],
        disallow: ["/api/", "/chat", "/upload", "/uploads"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/llms.txt", "/ai.txt", "/"],
        disallow: ["/api/", "/chat", "/upload", "/uploads"],
      },
      {
        userAgent: "CCBot",
        allow: ["/llms.txt", "/ai.txt"],
        disallow: ["/api/", "/chat", "/upload", "/uploads"],
      },
      // Bing AI
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/api/", "/chat", "/upload", "/uploads", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

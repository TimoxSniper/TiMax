import type { Metadata } from "next";
import { Crimson_Pro, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";
import { clerkAppearance } from "@/lib/clerk-theme";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/error-boundary";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { JsonLd } from "@/components/seo/json-ld";
import { getHomePageSchema } from "@/lib/schema";

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://timax.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    template: "%s | timax",
  },
  description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen. Automatische Transkription mit Whisper API und KI-Textgenerierung.",
  keywords: [
    // Primary Keywords (German)
    "Transkription",
    "Video zu Text",
    "Audio zu Text",
    "KI Textgenerierung",
    "Video Transkription",
    "Audio Transkription",
    // Feature Keywords
    "Content Marketing",
    "Social Media Posts",
    "Marketing Automation",
    "Automatische Texterstellung",
    "KI Content",
    // Technical Keywords
    "Whisper API",
    "OpenAI Transkription",
    "Claude AI",
    "Speech to Text",
    // Use Case Keywords
    "Podcast Transkription",
    "Meeting Transkription",
    "Interview Transkription",
    "YouTube Video zu Text",
    // German Long-tail
    "automatische Untertitel",
    "Spracherkennung Deutsch",
    "Text aus Video erstellen",
    "Audio in Text umwandeln",
    "KI Marketing Tools",
    "Content Repurposing",
    // AI SEO Keywords
    "AI Transcription Tool",
    "AI Content Generator",
    "Video to Text AI",
    "Audio to Text AI",
  ],
  authors: [{ name: "TiMax" }],
  creator: "TiMax",
  publisher: "TiMax",
  category: "Technology",
  classification: "Business/Productivity",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'de-DE': '/',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "KI-gestützte Transkription und automatische Textgenerierung. Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow.",
    type: "website",
    locale: "de_DE",
    siteName: "TiMax",
    url: siteUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'TiMax - KI-gestützte Video und Audio Transkription mit automatischer Textgenerierung',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@timax_app",
    creator: "@timax_app",
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "KI-gestützte Transkription und automatische Textgenerierung für Marketing-Teams",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TiMax',
  },
  applicationName: 'TiMax',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#C19A6B',
    'theme-color': '#C19A6B',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={deDE} appearance={clerkAppearance}>
      <html lang="de">
        <body
          className={`${crimsonPro.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased font-sans`}
        >
          <JsonLd data={getHomePageSchema()} />
          <ErrorBoundary>
            <ToastProvider>
              {children}
              <CookieConsent />
              <ScrollToTop />
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}

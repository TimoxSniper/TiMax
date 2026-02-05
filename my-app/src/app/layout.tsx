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
import { getOrganizationSchema, getSoftwareApplicationSchema, getWebSiteSchema } from "@/lib/schema";

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
  description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen.",
  keywords: [
    "Transkription",
    "Video zu Text",
    "Audio zu Text",
    "KI Textgenerierung",
    "Content Marketing",
    "Social Media Posts",
    "Whisper API",
    "Marketing Automation",
    "Video Transkription",
    "Audio Transkription",
    "KI Content",
    "Automatische Texterstellung",
  ],
  authors: [{ name: "TiMax" }],
  creator: "TiMax",
  publisher: "TiMax",
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
  openGraph: {
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen.",
    type: "website",
    locale: "de_DE",
    siteName: "TiMax",
    url: siteUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'TiMax - Video und Audio Transkription',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
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
          <JsonLd data={[getOrganizationSchema(), getSoftwareApplicationSchema(), getWebSiteSchema()]} />
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

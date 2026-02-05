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

export const metadata: Metadata = {
  title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
  description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen.",
  openGraph: {
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen.",
    type: "website",
    locale: "de_DE",
    siteName: "TiMax",
  },
  twitter: {
    card: "summary_large_image",
    title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
    description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
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

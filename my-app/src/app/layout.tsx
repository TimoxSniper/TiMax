import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/error-boundary";
import { CookieConsent } from "@/components/layout/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "timax - Transformiere Videos und Audios in kraftvolle Texte",
  description: "Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <CookieConsent />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise",
  description: "Einfache, transparente Preisgestaltung für timax. Ein Preis, alle Features inklusive. Starte jetzt mit 29€/Monat oder spare mit dem Jahresabo.",
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: "Preise | timax",
    description: "Einfache, transparente Preisgestaltung. Ein Preis, alle Features inklusive.",
    type: "website",
    locale: "de_DE",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

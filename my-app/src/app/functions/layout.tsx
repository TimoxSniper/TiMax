import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funktionen",
  description: "Entdecken Sie die leistungsstarken Funktionen von Timax für Ihre Audio- und Textverarbeitung.",
  alternates: {
    canonical: "/functions",
  },
  openGraph: {
    title: "Funktionen | Timax",
    description: "Entdecken Sie die leistungsstarken Funktionen von Timax für Ihre Audio- und Textverarbeitung.",
    type: "website",
    locale: "de_DE",
  },
};

export default function FunctionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

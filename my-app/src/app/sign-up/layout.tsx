import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstellen Sie ein TiMax-Konto",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melden Sie sich bei TiMax an",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}

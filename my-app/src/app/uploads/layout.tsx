import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ihre Dateien",
  description: "Verwalten Sie Ihre hochgeladenen Transkripte",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UploadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

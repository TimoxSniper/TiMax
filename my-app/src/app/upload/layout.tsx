import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload",
  description: "Laden Sie Audio- und Videodateien für die KI-Transkription hoch",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return children;
}

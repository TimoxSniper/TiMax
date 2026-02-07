import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "KI-gestützter Chat für Textgenerierung aus Transkripten",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}

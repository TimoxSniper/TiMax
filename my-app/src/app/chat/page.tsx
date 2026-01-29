"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs 
            items={[{ label: "Chat" }]}
            className="mb-6"
          />
          <ChatInterface />
        </div>
      </main>
      <footer className="border-t mt-auto py-6 sm:py-8" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">© 2026 timax</p>
            <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/impressum"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Datenschutz
              </Link>
              <Link
                href="/agb"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                AGB
              </Link>
              <Link
                href="/widerruf"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Widerruf
              </Link>
              <Link
                href="/cookies"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

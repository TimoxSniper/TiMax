"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useMobileDevice } from "@/hooks/useMobileDevice";

export default function ChatPage() {
  const isMobileDevice = useMobileDevice();

  // Auf echten Mobilgeräten: Vollbild-Chat ohne Header/Footer
  if (isMobileDevice) {
    return (
      <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
        <ChatInterface />
      </div>
    );
  }

  // Desktop: Normale Ansicht mit Header und Footer
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1">
        <div className="space-y-8">
          {/* Editorial Modernism Header */}
          <header>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Chat
            </h1>
            <div className="w-24 h-1 bg-accent mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl">
              Haben Sie ein Gespräch mit unserer KI. Stellen Sie Fragen, erhalten Sie Antworten.
            </p>
          </header>

          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[{ label: "Chat" }]}
            className="mb-2"
          />

          {/* Chat Interface */}
          <ChatInterface />
        </div>
      </main>
      <Footer />
    </div>
  );
}

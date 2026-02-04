"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

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
      <Footer />
    </div>
  );
}

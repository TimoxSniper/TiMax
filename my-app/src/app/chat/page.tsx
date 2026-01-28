"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { MainNavigation } from "@/components/layout/main-navigation";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

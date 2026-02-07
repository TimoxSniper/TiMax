"use client";

import { useEffect, useRef, useState, memo } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, Sparkles, Plus } from "lucide-react";
import { CHAT_UI_TEXTS } from "@/lib/constants";
import { useChat, Message } from "@/hooks/useChat";
import { useMobileDevice } from "@/hooks/useMobileDevice";

import { ChatSidebar } from "./chat-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export type { Message };

interface ChatInterfaceProps {
  initialSessionId?: string;
}

export const ChatInterface = memo(({ initialSessionId }: ChatInterfaceProps) => {
  const {
    messages,
    sessionId,
    chatId,
    isLoading,
    error,
    handleSendMessage,
    startNewChat,
    setChatId,
  } = useChat({
    initialSessionId,
  });

  const isMobileDevice = useMobileDevice();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Beim Laden der Seite zum Chat-Bereich scrollen (nur Desktop)
  useEffect(() => {
    if (!isMobileDevice && chatContainerRef.current) {
      const rect = chatContainerRef.current.getBoundingClientRect();
      const offset = window.innerHeight * 0.1;
      window.scrollTo({
        top: window.scrollY + rect.top - offset,
        behavior: "smooth",
      });
    }
  }, [isMobileDevice]);

  // Auto-Scroll zu letzter Nachricht
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Schließe Sidebar nach Chat-Auswahl auf Mobile
  const handleSelectChat = (id: string) => {
    setChatId(id);
    setSidebarOpen(false);
  };

  const handleCreateNewChat = () => {
    startNewChat();
    setSidebarOpen(false);
  };

  // ========== MOBILE LAYOUT ==========
  if (isMobileDevice) {
    return (
      <div ref={chatContainerRef} className="bg-background flex h-full w-full flex-col">
        {/* Mobile Header - kompakt und funktional */}
        <header className="bg-card/80 safe-area-top flex items-center justify-between border-b px-4 py-3 backdrop-blur-sm">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
              <ChatSidebar
                currentChatId={chatId}
                onSelectChat={handleSelectChat}
                onCreateNewChat={handleCreateNewChat}
                _onRefresh={() => {}}
              />
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full">
              <Sparkles className="text-accent h-4 w-4" />
            </div>
            <span className="text-sm font-medium">TiMax</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 h-10 w-10"
            onClick={handleCreateNewChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Message Area - nimmt den restlichen Platz ein */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain touch-pan-y">
          {messages.length === 0 ? (
            // Welcome Screen für Mobile
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-8">
              <div className="bg-accent/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Sparkles className="text-accent h-8 w-8" />
              </div>

              <h2 className="mb-2 text-center font-serif text-2xl font-bold">
                {CHAT_UI_TEXTS.WELCOME_TITLE}
              </h2>
              <p className="text-muted-foreground mb-8 text-center text-sm">
                {CHAT_UI_TEXTS.WELCOME_SUBTITLE}
              </p>

              <div className="w-full space-y-3">
                <p className="text-muted-foreground mb-2 text-center text-xs font-medium tracking-widest uppercase">
                  {CHAT_UI_TEXTS.EXAMPLE_REQUESTS_TITLE}
                </p>
                {CHAT_UI_TEXTS.EXAMPLE_REQUESTS.map((req, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(req.replace(/^[•\s"]+|["]+$/g, ""))}
                    className="bg-card border-border w-full rounded-xl border px-4 py-4 text-left text-sm transition-transform active:scale-[0.98] touch-manipulation"
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 px-4 py-4">
              <MessageList messages={messages} isMobile={true} />

              {isLoading && (
                <div className="flex items-center gap-3 px-2">
                  <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Loader2 className="text-accent h-4 w-4 animate-spin" />
                  </div>
                  <span className="text-muted-foreground text-sm">{CHAT_UI_TEXTS.THINKING}</span>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 flex items-center gap-3 rounded-xl p-4">
                  <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
                  <span className="text-destructive text-sm">{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        {/* Chat Input - fixed am unteren Rand */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} isMobile={true} />
      </div>
    );
  }

  // ========== DESKTOP LAYOUT ==========
  return (
    <div
      ref={chatContainerRef}
      className="flex h-[calc(100vh-16rem)] max-h-[800px] w-full flex-row gap-4"
    >
      {/* Desktop Sidebar */}
      <div className="bg-card h-full w-72 flex-shrink-0 overflow-hidden rounded-xl border shadow-sm">
        <ChatSidebar
          currentChatId={chatId}
          onSelectChat={setChatId}
          onCreateNewChat={startNewChat}
          _onRefresh={() => {}}
        />
      </div>

      {/* Haupt-Chatbereich */}
      <Card className="flex h-full flex-1 flex-col overflow-hidden">
        <ChatHeader _sessionId={sessionId} messageCount={messages.length} />

        <div ref={scrollContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex h-full flex-col items-center justify-center px-4 text-center duration-500">
              <div className="bg-secondary mb-6 flex h-16 w-16 items-center justify-center rounded-[6px]">
                <Sparkles className="text-accent h-8 w-8" />
              </div>
              <h2 className="text-foreground mb-2 font-serif text-2xl font-bold">
                {CHAT_UI_TEXTS.WELCOME_TITLE}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm">
                {CHAT_UI_TEXTS.WELCOME_SUBTITLE}
              </p>

              <div className="grid w-full max-w-md gap-3">
                <p className="text-muted-foreground mb-1 text-xs font-medium tracking-widest uppercase">
                  {CHAT_UI_TEXTS.EXAMPLE_REQUESTS_TITLE}
                </p>
                {CHAT_UI_TEXTS.EXAMPLE_REQUESTS.map((req, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(req.replace(/^[•\s"]+|["]+$/g, ""))}
                    className="bg-secondary hover:bg-secondary/80 border-border hover:shadow-editorial-sm rounded-[6px] border px-4 py-3 text-left text-sm transition-all duration-300 hover:-translate-y-[2px]"
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <MessageList messages={messages} isMobile={false} />
          )}

          {isLoading && (
            <div className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{CHAT_UI_TEXTS.THINKING}</span>
            </div>
          )}

          {error && (
            <div className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-lg p-3">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} isMobile={false} />
      </Card>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface";

"use client";

import { useEffect, useRef, useState } from "react";
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

export function ChatInterface({ initialSessionId }: ChatInterfaceProps) {
  const {
    messages,
    sessionId,
    chatId,
    isLoading,
    error,
    handleSendMessage,
    startNewChat,
    setChatId
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
        behavior: "smooth"
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
      <div ref={chatContainerRef} className="flex flex-col h-full w-full bg-background">
        {/* Mobile Header - kompakt und funktional */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-sm safe-area-top">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 -ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px]">
              <ChatSidebar
                currentChatId={chatId}
                onSelectChat={handleSelectChat}
                onCreateNewChat={handleCreateNewChat}
                _onRefresh={() => {}}
              />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium text-sm">TiMax</span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 -mr-2"
            onClick={handleCreateNewChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Message Area - nimmt den restlichen Platz ein */}
        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {messages.length === 0 ? (
            // Welcome Screen für Mobile
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              
              <h2 className="font-serif text-2xl font-bold mb-2 text-center">
                {CHAT_UI_TEXTS.WELCOME_TITLE}
              </h2>
              <p className="text-muted-foreground text-center mb-8 text-sm">
                {CHAT_UI_TEXTS.WELCOME_SUBTITLE}
              </p>

              <div className="w-full space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground text-center mb-2">
                  {CHAT_UI_TEXTS.EXAMPLE_REQUESTS_TITLE}
                </p>
                {CHAT_UI_TEXTS.EXAMPLE_REQUESTS.map((req, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(req.replace(/^[•\s"]+|["]+$/g, ""))}
                    className="w-full text-left px-4 py-4 bg-card border border-border rounded-xl text-sm active:scale-[0.98] transition-transform"
                  >
                    {req}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-4">
              <MessageList messages={messages} isMobile={true} />
              
              {isLoading && (
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">{CHAT_UI_TEXTS.THINKING}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <span className="text-sm text-destructive">{error}</span>
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
    <div ref={chatContainerRef} className="flex flex-row h-[calc(100vh-16rem)] max-h-[800px] w-full gap-4">
      {/* Desktop Sidebar */}
      <div className="w-72 flex-shrink-0 h-full overflow-hidden rounded-xl border bg-card shadow-sm">
        <ChatSidebar
          currentChatId={chatId}
          onSelectChat={setChatId}
          onCreateNewChat={startNewChat}
          _onRefresh={() => {}}
        />
      </div>

      {/* Haupt-Chatbereich */}
      <Card className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader _sessionId={sessionId} messageCount={messages.length} />

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 rounded-[6px] bg-secondary flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">{CHAT_UI_TEXTS.WELCOME_TITLE}</h2>
              <p className="text-muted-foreground mb-8 max-w-sm">
                {CHAT_UI_TEXTS.WELCOME_SUBTITLE}
              </p>

              <div className="w-full max-w-md grid gap-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                  {CHAT_UI_TEXTS.EXAMPLE_REQUESTS_TITLE}
                </p>
                {CHAT_UI_TEXTS.EXAMPLE_REQUESTS.map((req, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(req.replace(/^[•\s"]+|["]+$/g, ""))}
                    className="text-sm text-left px-4 py-3 bg-secondary hover:bg-secondary/80 border border-border rounded-[6px] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-editorial-sm"
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
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{CHAT_UI_TEXTS.THINKING}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} isMobile={false} />
      </Card>
    </div>
  );
}

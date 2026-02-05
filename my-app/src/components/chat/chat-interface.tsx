"use client";

import { useEffect, useRef } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { CHAT_UI_TEXTS } from "@/lib/constants";
import { useChat, Message } from "@/hooks/useChat";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-Scroll zu letzter Nachricht (nur innerhalb des Chat-Containers)
  useEffect(() => {
    if (messages.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col lg:flex-row h-[--height-chat-desktop] sm:h-[--height-chat-mobile] max-h-[800px] w-full gap-4 relative">
      {/* Mobile Sidebar Trigger (Drawer) */}
      <div className="lg:hidden absolute top-4 left-4 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <ChatSidebar
              currentChatId={chatId}
              onSelectChat={(id) => {
                setChatId(id);
              }}
              onCreateNewChat={startNewChat}
              onRefresh={() => { }}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0 h-full overflow-hidden rounded-xl border bg-card shadow-sm">
        <ChatSidebar
          currentChatId={chatId}
          onSelectChat={setChatId}
          onCreateNewChat={startNewChat}
          onRefresh={() => { }}
        />
      </div>

      {/* Haupt-Chatbereich */}
      <Card className="flex-1 flex flex-col h-full overflow-hidden relative">
        <ChatHeader sessionId={sessionId} messageCount={messages.length} />

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Square icon container - Editorial Modernism */}
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
            <MessageList messages={messages} />
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

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </Card>
    </div>
  );
}
"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Message } from "./chat-interface";
import { MessageBubble } from "./message-bubble";
import { Skeleton, ChatMessageSkeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isMobile?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const MessageList = memo(
  ({
    messages,
    isMobile = false,
    isLoading = false,
    hasMore = false,
    onLoadMore,
  }: MessageListProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
      if (messagesEndRef.current && scrollContainerRef.current) {
        const shouldScroll =
          scrollContainerRef.current.scrollHeight - scrollContainerRef.current.scrollTop <=
          scrollContainerRef.current.clientHeight + 200; // Auto-scroll if within 200px of bottom

        if (shouldScroll) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, [messages]);

    // Track scroll position to show/hide scroll top button
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
      }
    };

    // Scroll to bottom manually
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Intersection Observer for infinite scroll
    useEffect(() => {
      if (!hasMore || !onLoadMore || !scrollContainerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      const sentinel = document.createElement("div");
      sentinel.className = "h-16";
      scrollContainerRef.current.appendChild(sentinel);
      observer.observe(sentinel);

      return () => {
        observer.unobserve(sentinel);
        if (sentinel.parentNode) {
          sentinel.parentNode.removeChild(sentinel);
        }
      };
    }, [hasMore, onLoadMore]);

    return (
      <div
        className="relative h-full w-full"
        role="region"
        aria-label={isMobile ? "Chatverlauf (Mobile Ansicht)" : "Chatverlauf (Desktop Ansicht)"}
      >
        {/* Scroll Container with improved scroll behavior */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "h-full w-full overflow-y-auto overscroll-contain",
            isMobile ? "touch-pan-y" : "scroll-smooth"
          )}
          onScroll={handleScroll}
          role="list"
          aria-live="polite"
          aria-atomic="false"
        >
          {/* Top padding for better spacing */}
          <div className={isMobile ? "h-2" : "h-4"} />

          {/* Loading skeleton for initial load */}
          {messages.length === 0 && isLoading && (
            <div className={cn("space-y-4 px-4", !isMobile && "mx-auto max-w-3xl")}>
              <ChatMessageSkeleton count={3} />
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div
              className={cn(
                isMobile ? "space-y-3 px-4" : "mx-auto max-w-3xl space-y-6",
                "pb-20" // Padding to prevent messages from being hidden behind input
              )}
            >
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMobile={isMobile}
                  _isLastMessage={index === messages.length - 1}
                />
              ))}
            </div>
          )}

          {/* Loading indicator for streaming/loading more */}
          {isLoading && messages.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-2",
                isMobile ? "sticky bottom-24" : "sticky bottom-20 mx-auto w-full max-w-3xl"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          )}

          {/* Load more indicator */}
          {hasMore && !isLoading && (
            <div className="flex justify-center py-4">
              <button
                onClick={onLoadMore}
                className="rounded-lg px-4 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700"
                aria-label="Mehr Nachrichten laden"
              >
                Mehr Nachrichten laden
              </button>
            </div>
          )}

          {/* End of messages marker */}
          {messages.length > 0 && !isLoading && !hasMore && (
            <div className="py-8 text-center text-xs text-amber-600/40">Ende des Chatverlaufs</div>
          )}

          {/* Scroll sentinel for infinite scroll */}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Scroll to bottom button */}
        {showScrollTop && (
          <button
            onClick={scrollToBottom}
            className={cn(
              "bg-amber-600 text-white shadow-lg transition-all duration-200 hover:bg-amber-700",
              isMobile
                ? "fixed right-4 bottom-24 flex h-10 w-10 items-center justify-center rounded-full"
                : "absolute right-4 bottom-20 flex h-10 w-10 items-center justify-center rounded-full"
            )}
            aria-label="Zum Ende der Unterhaltung scrollen"
            title="Zum Ende scrollen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

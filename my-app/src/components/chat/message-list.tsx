"use client";

import { Message } from "./chat-interface";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: Message[];
  isMobile?: boolean;
}

export function MessageList({ messages, isMobile = false }: MessageListProps) {
  return (
    <div className={isMobile ? "space-y-3" : "space-y-4"}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isMobile={isMobile} />
      ))}
    </div>
  );
}

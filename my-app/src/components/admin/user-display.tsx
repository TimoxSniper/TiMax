"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Copy, Check } from "lucide-react";
import Image from "next/image";

interface UserDisplayProps {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  showEmail?: boolean;
  className?: string;
}

// Kompakte Version nur mit User-ID (für Chats/Uploads Tabellen)
export function UserIdDisplay({ userId, className }: { userId: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncateUserId = (id: string) => {
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <code
        className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs transition-colors"
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Klicken zum Kürzen" : "Klicken für volle ID"}
      >
        {expanded ? userId : truncateUserId(userId)}
      </code>
      <button
        onClick={handleCopy}
        className="hover:bg-muted rounded p-0.5 opacity-0 transition-colors group-hover:opacity-100"
        title="User ID kopieren"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="text-muted-foreground h-3 w-3" />
        )}
      </button>
    </div>
  );
}

export function UserDisplay({
  userId,
  firstName,
  lastName,
  email,
  imageUrl,
  showEmail = false,
  className,
}: UserDisplayProps) {
  const [showId, setShowId] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasName = firstName || lastName;
  const displayName = hasName ? `${firstName || ""} ${lastName || ""}`.trim() : null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateUserId = (id: string) => {
    if (id.length <= 20) return id;
    return `${id.slice(0, 10)}...${id.slice(-8)}`;
  };

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {/* Avatar */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={displayName || "User"}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <User className="text-muted-foreground h-4 w-4" />
        </div>
      )}

      {/* Name or ID */}
      <div className="min-w-0 flex-1">
        {showId ? (
          <div className="flex items-center gap-1.5">
            <code
              className="bg-muted hover:bg-muted/80 cursor-pointer truncate rounded px-1.5 py-0.5 font-mono text-xs"
              onClick={() => setShowId(false)}
              title="Klicken um Name anzuzeigen"
            >
              {truncateUserId(userId)}
            </code>
            <button
              onClick={handleCopy}
              className="hover:bg-muted shrink-0 rounded p-1 transition-colors"
              title="User ID kopieren"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="text-muted-foreground h-3 w-3" />
              )}
            </button>
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => setShowId(true)}
            title="Klicken um User ID anzuzeigen"
          >
            {displayName ? (
              <div>
                <span className="hover:text-accent text-sm font-medium transition-colors">
                  {displayName}
                </span>
                {showEmail && email && (
                  <span className="text-muted-foreground ml-2 text-xs">{email}</span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors">
                {truncateUserId(userId)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

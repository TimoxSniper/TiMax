"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Copy, Check } from "lucide-react";

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
        className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Klicken zum Kürzen" : "Klicken für volle ID"}
      >
        {expanded ? userId : truncateUserId(userId)}
      </code>
      <button
        onClick={handleCopy}
        className="p-0.5 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
        title="User ID kopieren"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3 text-muted-foreground" />
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
  const displayName = hasName
    ? `${firstName || ""} ${lastName || ""}`.trim()
    : null;

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
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {/* Avatar */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={displayName || "User"}
          className="w-8 h-8 rounded-full shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Name or ID */}
      <div className="min-w-0 flex-1">
        {showId ? (
          <div className="flex items-center gap-1.5">
            <code
              className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-muted/80"
              onClick={() => setShowId(false)}
              title="Klicken um Name anzuzeigen"
            >
              {truncateUserId(userId)}
            </code>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-muted rounded transition-colors shrink-0"
              title="User ID kopieren"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
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
                <span className="font-medium text-sm hover:text-accent transition-colors">
                  {displayName}
                </span>
                {showEmail && email && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {email}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                {truncateUserId(userId)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

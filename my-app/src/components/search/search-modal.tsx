"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, FileAudio, Loader2, ArrowRight, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface SearchResult {
  id: string;
  type: "chat" | "upload";
  title: string;
  preview: string;
  createdAt: string;
  relevance: number;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
          setSelectedIndex(0);
        }
      } catch (error) {
        logger.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          onOpenChange(false);
          break;
      }
    },
    [results, selectedIndex, onOpenChange]
  );

  const navigateToResult = (result: SearchResult) => {
    onOpenChange(false);
    if (result.type === "chat") {
      router.push(`/chat?id=${result.id}`);
    } else {
      router.push(`/uploads`);
    }
  };

  const groupedResults = {
    chats: results.filter((r) => r.type === "chat"),
    uploads: results.filter((r) => r.type === "upload"),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Suche</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="text-muted-foreground h-5 w-5 flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chats und Uploads durchsuchen..."
            className="h-14 flex-1 border-0 bg-transparent text-base focus-visible:ring-0"
          />
          {isSearching && <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="text-muted-foreground p-8 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="text-sm">Gib mindestens 2 Zeichen ein, um zu suchen</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                <kbd className="bg-muted text-muted-foreground rounded px-2 py-1">
                  <Command className="inline h-3 w-3" /> K
                </kbd>
                <span>zum Öffnen</span>
                <kbd className="bg-muted text-muted-foreground rounded px-2 py-1">↑↓</kbd>
                <span>Navigation</span>
                <kbd className="bg-muted text-muted-foreground rounded px-2 py-1">Enter</kbd>
                <span>Öffnen</span>
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="text-muted-foreground p-8 text-center">
              <p className="text-sm">Keine Ergebnisse für &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Chats Section */}
              {groupedResults.chats.length > 0 && (
                <div className="mb-2">
                  <div className="text-muted-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase">
                    Chats
                  </div>
                  {groupedResults.chats.map((result, index) => {
                    const globalIndex = index;
                    return (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        isSelected={selectedIndex === globalIndex}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Uploads Section */}
              {groupedResults.uploads.length > 0 && (
                <div>
                  <div className="text-muted-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase">
                    Uploads
                  </div>
                  {groupedResults.uploads.map((result, index) => {
                    const globalIndex = groupedResults.chats.length + index;
                    return (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        isSelected={selectedIndex === globalIndex}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="bg-muted/50 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
            <span>
              {results.length} Ergebnis{results.length !== 1 ? "se" : ""}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-background rounded border px-1.5 py-0.5">↑</kbd>
                <kbd className="bg-background rounded border px-1.5 py-0.5">↓</kbd>
                Navigation
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-background rounded border px-1.5 py-0.5">Enter</kbd>
                Öffnen
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function SearchResultItem({ result, isSelected, onClick, onMouseEnter }: SearchResultItemProps) {
  const Icon = result.type === "chat" ? MessageSquare : FileAudio;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
          result.type === "chat" ? "bg-primary/10" : "bg-accent/10"
        )}
      >
        <Icon className={cn("h-5 w-5", result.type === "chat" ? "text-primary" : "text-accent")} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{result.title}</span>
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {result.type === "chat" ? "Chat" : "Upload"}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">{result.preview}</p>
      </div>
      {isSelected && <ArrowRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />}
    </button>
  );
}

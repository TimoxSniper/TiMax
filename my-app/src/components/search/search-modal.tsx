"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  FileAudio,
  Loader2,
  ArrowRight,
  Command,
} from "lucide-react";
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
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Suche</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chats und Uploads durchsuchen..."
            className="flex-1 h-14 border-0 bg-transparent focus-visible:ring-0 text-base"
          />
          {isSearching && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Gib mindestens 2 Zeichen ein, um zu suchen</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground">
                  <Command className="h-3 w-3 inline" /> K
                </kbd>
                <span>zum Öffnen</span>
                <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground">↑↓</kbd>
                <span>Navigation</span>
                <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground">Enter</kbd>
                <span>Öffnen</span>
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Keine Ergebnisse für &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Chats Section */}
              {groupedResults.chats.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
          <div className="px-4 py-3 border-t bg-muted/50 text-xs text-muted-foreground flex justify-between items-center">
            <span>{results.length} Ergebnis{results.length !== 1 ? "se" : ""}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↓</kbd>
                Navigation
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd>
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

function SearchResultItem({
  result,
  isSelected,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  const Icon = result.type === "chat" ? MessageSquare : FileAudio;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          result.type === "chat" ? "bg-primary/10" : "bg-accent/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            result.type === "chat" ? "text-primary" : "text-accent"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{result.title}</span>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {result.type === "chat" ? "Chat" : "Upload"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {result.preview}
        </p>
      </div>
      {isSelected && (
        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
}

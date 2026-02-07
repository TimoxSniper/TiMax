"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { FormatType } from "@/lib/text-templates";
import { logger } from "@/lib/logger";

interface TextOutputProps {
  generatedText: string;
  format: FormatType | null;
  onCopy?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const formatLabels: Record<FormatType, string> = {
  instagram: "Instagram Post",
  twitter: "Twitter Thread",
  blog: "Blog-Absatz",
  caption: "Caption",
};

export function TextOutput({
  generatedText,
  format,
  onCopy,
  isLoading = false,
  error,
}: TextOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!generatedText || isLoading) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      onCopy?.();

      // Reset nach 2 Sekunden
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      // In Production: Hier würde man zu einem Error-Tracking-Service loggen
      if (process.env.NODE_ENV === "development") {
        logger.error("Fehler beim Kopieren:", err);
      }
      // Fallback für ältere Browser
      const textArea = document.createElement("textarea");
      textArea.value = generatedText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        onCopy?.();
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        if (process.env.NODE_ENV === "development") {
          logger.error("Fallback-Kopieren fehlgeschlagen:", fallbackErr);
        }
      } finally {
        // Stelle sicher, dass textArea immer entfernt wird
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
      }
    }
  };

  const isEmpty = !generatedText || generatedText.trim() === "";
  const charCount = generatedText.length;

  return (
    <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-secondary text-accent flex size-8 items-center justify-center rounded-[4px]">
                <Sparkles className="size-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {format ? formatLabels[format] : "Generierter Text"}
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              {isEmpty
                ? "Wähle ein Format aus, um Text zu generieren"
                : "Dein generierter Content – bereit zum Kopieren"}
            </CardDescription>
          </div>
          {!isEmpty && (
            <Badge
              variant="secondary"
              className="shrink-0 font-mono tabular-nums"
              aria-label={`${charCount} Zeichen`}
            >
              {charCount} Zeichen
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1" id="text-output">
        {isLoading ? (
          <div
            className="text-muted-foreground border-muted flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:min-h-[300px]"
            role="status"
            aria-live="polite"
            aria-label="Text wird generiert"
          >
            <div className="bg-primary/10 mb-4 flex size-16 items-center justify-center rounded-full sm:size-20">
              <Loader2 className="text-primary size-8 animate-spin sm:size-10" aria-hidden="true" />
            </div>
            <p className="text-foreground mb-2 text-sm font-medium sm:text-base">
              Text wird generiert...
            </p>
            <p className="max-w-xs text-xs sm:text-sm">
              Bitte warten, während dein Content erstellt wird
            </p>
          </div>
        ) : error ? (
          <div
            className="border-destructive/20 bg-destructive/5 flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 p-8 text-center transition-colors sm:min-h-[300px]"
            role="alert"
            aria-live="assertive"
          >
            <div className="bg-destructive/10 mb-4 flex size-16 items-center justify-center rounded-full sm:size-20">
              <AlertCircle className="text-destructive size-8 sm:size-10" aria-hidden="true" />
            </div>
            <p className="text-destructive mb-2 text-sm font-medium sm:text-base">
              Fehler bei der Generierung
            </p>
            <p className="text-muted-foreground max-w-xs text-xs sm:text-sm">{error}</p>
            <p className="text-muted-foreground mt-4 max-w-xs text-xs sm:text-sm">
              Bitte versuche es erneut oder wähle ein anderes Format.
            </p>
          </div>
        ) : isEmpty ? (
          <div
            className="text-muted-foreground border-muted flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:min-h-[300px]"
            role="status"
            aria-live="polite"
          >
            <div className="bg-muted/50 mb-4 flex size-16 animate-pulse items-center justify-center rounded-full sm:size-20">
              <FileText className="size-8 opacity-40 sm:size-10" aria-hidden="true" />
            </div>
            <p className="text-foreground mb-2 text-sm font-medium sm:text-base">
              Noch kein Text generiert
            </p>
            <p className="mb-4 max-w-xs text-xs sm:text-sm">
              Wähle ein Format aus der Liste oben, um deinen Text zu generieren
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                Instagram
              </span>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                Twitter
              </span>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                Blog
              </span>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                Caption
              </span>
            </div>
          </div>
        ) : (
          <div
            className="bg-muted/30 focus-within:ring-ring max-h-[600px] overflow-y-auto rounded-lg border p-4 transition-all focus-within:ring-2 focus-within:ring-offset-2 sm:p-6"
            role="region"
            aria-label="Generierter Text"
            tabIndex={0}
          >
            <div className="text-foreground/90 selection:bg-primary/20 text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
              {generatedText}
            </div>
          </div>
        )}
      </CardContent>
      {!isEmpty && !isLoading && !error && (
        <CardFooter className="border-t pt-6">
          <Button
            onClick={handleCopy}
            disabled={copied || isLoading}
            className="w-full"
            variant={copied ? "secondary" : "default"}
            size="lg"
            aria-label={copied ? "Text wurde kopiert" : "Text in Zwischenablage kopieren"}
          >
            {copied ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" />
                In Zwischenablage kopieren
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { FormatType } from "@/lib/text-templates";

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

export function TextOutput({ generatedText, format, onCopy, isLoading = false, error }: TextOutputProps) {
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
      console.error("Fehler beim Kopieren:", err);
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
        console.error("Fallback-Kopieren fehlgeschlagen:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const isEmpty = !generatedText || generatedText.trim() === "";
  const charCount = generatedText.length;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
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
            className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-muted transition-colors"
            role="status"
            aria-live="polite"
            aria-label="Text wird generiert"
          >
            <div className="size-16 sm:size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="size-8 sm:size-10 text-primary animate-spin" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base font-medium mb-2 text-foreground">Text wird generiert...</p>
            <p className="text-xs sm:text-sm max-w-xs">
              Bitte warten, während dein Content erstellt wird
            </p>
          </div>
        ) : error ? (
          <div 
            className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px] text-center p-8 rounded-lg border-2 border-destructive/20 bg-destructive/5 transition-colors"
            role="alert"
            aria-live="assertive"
          >
            <div className="size-16 sm:size-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="size-8 sm:size-10 text-destructive" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base font-medium mb-2 text-destructive">Fehler bei der Generierung</p>
            <p className="text-xs sm:text-sm max-w-xs text-muted-foreground">
              {error}
            </p>
            <p className="text-xs sm:text-sm max-w-xs mt-4 text-muted-foreground">
              Bitte versuche es erneut oder wähle ein anderes Format.
            </p>
          </div>
        ) : isEmpty ? (
          <div 
            className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-muted transition-colors"
            role="status"
            aria-live="polite"
          >
            <div className="size-16 sm:size-20 rounded-full bg-muted/50 flex items-center justify-center mb-4 animate-pulse">
              <FileText className="size-8 sm:size-10 opacity-40" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base font-medium mb-2 text-foreground">Noch kein Text generiert</p>
            <p className="text-xs sm:text-sm max-w-xs mb-4">
              Wähle ein Format aus der Liste oben, um deinen Text zu generieren
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">Instagram</span>
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">Twitter</span>
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">Blog</span>
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">Caption</span>
            </div>
          </div>
        ) : (
          <div 
            className="max-h-[600px] overflow-y-auto rounded-lg border bg-muted/30 p-4 sm:p-6 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all"
            role="region"
            aria-label="Generierter Text"
            tabIndex={0}
          >
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-foreground/90 selection:bg-primary/20">
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
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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


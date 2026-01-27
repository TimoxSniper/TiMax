"use client";

import { useState } from "react";
import { TranscriptViewer } from "@/components/text-generator/transcript-viewer";
import { FormatSelector } from "@/components/text-generator/format-selector";
import { TextOutput } from "@/components/text-generator/text-output";
import { mockTranscript } from "@/lib/mock-transcript";
import { generateText, type FormatType } from "@/lib/text-templates";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TextGeneratorPage() {
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");

  const handleFormatSelect = (format: FormatType) => {
    setSelectedFormat(format);
    // Stage 1: Mock-Generierung (sofort, < 100ms)
    // Stage 2: Echte Template-Engine wird hier aufgerufen
    const text = generateText(format, mockTranscript);
    setGeneratedText(text);
    
    // Smooth scroll zum Output-Bereich auf Mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const outputElement = document.getElementById("text-output");
        outputElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  const handleCopy = () => {
    // Stage 1: Nur Placeholder
    // Stage 2: Toast/Notification anzeigen
    console.log("Text copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-4 focus:ring-primary/50"
      >
        Zum Hauptinhalt springen
      </a>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="transition-all hover:scale-110"
              aria-label="Zurück zur Startseite"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="size-5 text-primary shrink-0" aria-hidden="true" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
                  Text Generator
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                Generiere verschiedene Content-Formate aus deinem Transkript
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
        role="main"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column: Transcript */}
          <div className="space-y-6">
            <TranscriptViewer transcript={mockTranscript} />
          </div>

          {/* Right Column: Format Selection & Output */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <FormatSelector 
              selectedFormat={selectedFormat} 
              onSelectFormat={handleFormatSelect} 
            />
            
            <TextOutput 
              generatedText={generatedText}
              format={selectedFormat}
              onCopy={handleCopy}
            />
          </div>
        </div>

        {/* Info Section */}
        <Separator className="my-12 lg:my-16" />
        
        <section 
          className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8"
          aria-labelledby="how-it-works-heading"
        >
          <div className="space-y-2">
            <h2 
              id="how-it-works-heading" 
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
            >
              Wie funktioniert der Text Generator?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              In drei einfachen Schritten zum perfekten Content für deine Social-Media-Kanäle
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left sm:text-center">
            <div className="space-y-3 p-4 sm:p-6 rounded-xl bg-muted/30 transition-all duration-200 hover:bg-muted/50 hover:shadow-md">
              <div className="size-12 sm:size-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto sm:mx-auto mb-3 transition-transform hover:scale-110">
                <span className="text-primary font-bold text-lg sm:text-xl" aria-label="Schritt 1">1</span>
              </div>
              <p className="font-semibold text-foreground text-sm sm:text-base">Transkript anzeigen</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Das Beispiel-Transkript wird automatisch geladen und übersichtlich dargestellt
              </p>
            </div>
            <div className="space-y-3 p-4 sm:p-6 rounded-xl bg-muted/30 transition-all duration-200 hover:bg-muted/50 hover:shadow-md">
              <div className="size-12 sm:size-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto sm:mx-auto mb-3 transition-transform hover:scale-110">
                <span className="text-primary font-bold text-lg sm:text-xl" aria-label="Schritt 2">2</span>
              </div>
              <p className="font-semibold text-foreground text-sm sm:text-base">Format wählen</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Wähle aus 4 verschiedenen Content-Formaten für deine Zielplattform
              </p>
            </div>
            <div className="space-y-3 p-4 sm:p-6 rounded-xl bg-muted/30 transition-all duration-200 hover:bg-muted/50 hover:shadow-md">
              <div className="size-12 sm:size-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto sm:mx-auto mb-3 transition-transform hover:scale-110">
                <span className="text-primary font-bold text-lg sm:text-xl" aria-label="Schritt 3">3</span>
              </div>
              <p className="font-semibold text-foreground text-sm sm:text-base">Text kopieren</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Generierter Text wird sofort angezeigt und kann mit einem Klick kopiert werden
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>TiMax Text Generator · Stage 1 Demo · UI Only</p>
        </div>
      </footer>
    </div>
  );
}


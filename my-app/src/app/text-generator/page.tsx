"use client";

import { useState, useTransition } from "react";
import { TranscriptViewer } from "@/components/text-generator/transcript-viewer";
import { FormatSelector } from "@/components/text-generator/format-selector";
import { TextOutput } from "@/components/text-generator/text-output";
import { mockTranscript } from "@/lib/mock-transcript";
import { type FormatType } from "@/lib/text-templates";
import { generateTextAction } from "@/app/text-generator/actions";
import { Separator } from "@/components/ui/separator";
import { Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/upload/file-upload";
import { MainNavigation } from "@/components/layout/main-navigation";
import Link from "next/link";

export default function TextGeneratorPage() {
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFormatSelect = (format: FormatType) => {
    setSelectedFormat(format);
    setError(null);
    setGeneratedText(""); // Alten Text löschen während Loading
    
    startTransition(async () => {
      try {
        const result = await generateTextAction(format, mockTranscript);
        
        if (result.success && result.text) {
          setGeneratedText(result.text);
          setError(null);
          
          // Smooth scroll zum Output-Bereich auf Mobile
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setTimeout(() => {
              const outputElement = document.getElementById("text-output");
              outputElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
          }
        } else {
          setError(result.error || "Fehler bei der Text-Generierung");
          setGeneratedText("");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler";
        setError(errorMessage);
        setGeneratedText("");
        // In Production: Hier würde man zu einem Error-Tracking-Service loggen
        if (process.env.NODE_ENV === "development") {
          console.error("Fehler bei handleFormatSelect:", err);
        }
      }
    });
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
      <MainNavigation />

      {/* Main Content */}
      <main 
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
        role="main"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column: Transcript */}
          <div className="space-y-6">
            {/* Upload-Bereich */}
            <FileUpload 
              onUploadSuccess={(fileName) => {
                // In Production: Hier würde man zu einem Analytics-Service loggen
                // Removed console.log for production
              }}
              onUploadError={(error) => {
                // In Production: Hier würde man zu einem Error-Tracking-Service loggen
                if (process.env.NODE_ENV === "development") {
                  console.error("Upload-Fehler:", error);
                }
              }}
            />
            
            {/* Link zum Chat */}
            <Button asChild className="w-full">
              <Link href="/chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Zum Chat-Interface
              </Link>
            </Button>
            
            <TranscriptViewer transcript={mockTranscript} />
          </div>

          {/* Right Column: Format Selection & Output */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <FormatSelector 
              selectedFormat={selectedFormat} 
              onSelectFormat={handleFormatSelect}
              disabled={isPending}
            />
            
            <TextOutput 
              generatedText={generatedText}
              format={selectedFormat}
              isLoading={isPending}
              error={error}
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
          <p>TiMax Text Generator · Stage 2 · Real Functionality</p>
        </div>
      </footer>
    </div>
  );
}


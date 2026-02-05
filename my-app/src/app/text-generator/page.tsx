"use client";

import { useState, useTransition } from "react";
import { TranscriptViewer } from "@/components/text-generator/transcript-viewer";
import { FormatSelector } from "@/components/text-generator/format-selector";
import { TextOutput } from "@/components/text-generator/text-output";
import { type FormatType, formatOptions } from "@/lib/text-templates";
import { generateTextAction } from "@/app/text-generator/actions";
import { Separator } from "@/components/ui/separator";
import { Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/upload/file-upload";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TIMEOUTS, BREAKPOINTS } from "@/lib/constants";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function TextGeneratorPage() {
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [transcript, setTranscript] = useState<string>("");

  const handleFormatSelect = (format: FormatType) => {
    if (!transcript || transcript.trim().length === 0) {
      setError("Bitte laden Sie zuerst eine Datei hoch, um ein Transkript zu erhalten.");
      return;
    }

    setSelectedFormat(format);
    setError(null);
    setGeneratedText(""); // Alten Text löschen während Loading
    
    startTransition(async () => {
      try {
        const result = await generateTextAction(format, transcript);
        
        if (result.success && result.text) {
          setGeneratedText(result.text);
          setError(null);
          
          // Smooth scroll zum Output-Bereich auf Mobile
          if (typeof window !== "undefined" && window.innerWidth < BREAKPOINTS.MOBILE) {
            setTimeout(() => {
              const outputElement = document.getElementById("text-output");
              outputElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, TIMEOUTS.SCROLL_DELAY);
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
          logger.error("Fehler bei handleFormatSelect:", err);
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
        className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        role="main"
      >
        {/* Editorial Modernism Header */}
        <header className="mb-12 sm:mb-16">
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Text Generator
          </h1>
          <div className="w-24 h-1 bg-accent mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Verwandeln Sie Ihre Videos und Audios in perfekt formatierte Inhalte für alle Ihre Kanäle.
          </p>
        </header>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Text Generator", href: "/text-generator" },
            ...(selectedFormat ? [{ label: formatOptions.find(f => f.id === selectedFormat)?.label || "Format" }] : [])
          ]}
          className="mb-8"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column: Transcript */}
          <div className="space-y-6">
            {/* Upload-Bereich */}
            <FileUpload 
              onUploadSuccess={(fileName, transcriptText) => {
                // Setze Transkript wenn vorhanden
                if (transcriptText && transcriptText.trim().length > 0) {
                  setTranscript(transcriptText);
                  setError(null);
                  // Lösche generierten Text wenn neues Transkript kommt
                  setGeneratedText("");
                  setSelectedFormat(null);
                } else {
                  setError("Transkript wurde nicht zurückgegeben. Bitte versuchen Sie es erneut.");
                }
                
                // Optional: Scroll zu Format-Auswahl nach Upload
                setTimeout(() => {
                  const formatSelector = document.getElementById("format-selector");
                  if (formatSelector) {
                    formatSelector.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                }, TIMEOUTS.UPLOAD_SCROLL_DELAY);
              }}
              onUploadError={(error) => {
                // In Production: Hier würde man zu einem Error-Tracking-Service loggen
                if (process.env.NODE_ENV === "development") {
                  logger.error("Upload-Fehler:", error);
                }
                setError(error);
              }}
            />
            
            {/* Link zum Chat */}
            <Button asChild className="w-full">
              <Link href="/chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Zum Chat-Interface
              </Link>
            </Button>
            
            <TranscriptViewer 
              transcript={transcript || "Laden Sie eine Audio- oder Videodatei hoch, um das Transkript zu sehen."} 
            />
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

        {/* Info Section - Editorial Modernism */}
        <section 
          className="mt-24 lg:mt-32 pt-16 border-t border-border"
          aria-labelledby="how-it-works-heading"
        >
          <div className="text-center mb-16">
            <h2 
              id="how-it-works-heading" 
              className="font-serif text-4xl lg:text-5xl font-semibold mb-4"
            >
              Wie funktioniert es?
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In drei einfachen Schritten zum perfekten Content
            </p>
          </div>
          
          {/* Editorial Modernism: Bronze numbers, no gradient circles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="text-accent font-serif text-6xl lg:text-7xl font-bold">01</div>
              <h3 className="font-sans text-lg font-medium uppercase tracking-wide">
                Datei hochladen
              </h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                Laden Sie eine Audio- oder Videodatei hoch. Das Transkript wird automatisch erstellt und angezeigt.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-accent font-serif text-6xl lg:text-7xl font-bold">02</div>
              <h3 className="font-sans text-lg font-medium uppercase tracking-wide">
                Format wählen
              </h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                Wähle aus 4 verschiedenen Content-Formaten für deine Zielplattform.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-accent font-serif text-6xl lg:text-7xl font-bold">03</div>
              <h3 className="font-sans text-lg font-medium uppercase tracking-wide">
                Text kopieren
              </h3>
              <p className="font-sans text-muted-foreground leading-relaxed">
                Generierter Text wird sofort angezeigt und kann mit einem Klick kopiert werden.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


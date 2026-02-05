"use client";

import { useState } from "react";
import { Upload, FileAudio, FileVideo, MessageSquare, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/upload/file-upload";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function UploadPage() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

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
        className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
        role="main"
      >
        {/* Header */}
        <header className="mb-12 sm:mb-16 text-center">
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Upload
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Laden Sie Ihre Audio- oder Videodatei hoch. Die KI transkribiert automatisch 
            den Inhalt und bereitet ihn für die Weiterverarbeitung vor.
          </p>
        </header>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Upload", href: "/upload" },
          ]}
          className="mb-8"
        />

        {/* Upload-Bereich */}
        <div className="max-w-2xl mx-auto space-y-8">
          <FileUpload 
            onUploadSuccess={(fileName, transcriptText) => {
              setUploadedFileName(fileName);
              setIsUploaded(true);
              logger.info("Upload erfolgreich:", fileName);
            }}
            onUploadError={(error) => {
              if (process.env.NODE_ENV === "development") {
                logger.error("Upload-Fehler:", error);
              }
            }}
          />

          {/* Erfolgs-Hinweis nach Upload */}
          {isUploaded && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Upload erfolgreich!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Die Datei <span className="font-medium">{uploadedFileName}</span> wurde hochgeladen 
                      und wird jetzt verarbeitet. Das Transkript ist in Kürze im Chat verfügbar.
                    </p>
                    <Button asChild className="mt-3">
                      <Link href="/chat">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Zum Chat
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Link zum Chat */}
          {!isUploaded && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Bereits ein Transkript vorhanden?
              </p>
              <Button asChild variant="outline">
                <Link href="/chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Direkt zum Chat
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section 
          className="mt-24 lg:mt-32 pt-16 border-t border-border"
          aria-labelledby="how-it-works-heading"
        >
          <div className="text-center mb-16">
            <h2 
              id="how-it-works-heading" 
              className="font-serif text-4xl lg:text-5xl font-semibold mb-4"
            >
              So funktioniert es
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6" />
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans text-lg font-medium">
                1. Datei hochladen
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Laden Sie eine Audio- oder Videodatei hoch (MP3, MP4, WAV, M4A, WebM bis 100MB).
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans text-lg font-medium">
                2. KI-Transkription
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ihre Datei wird automatisch transkribiert. Die KI erkennt Sprache und wandelt sie in Text um.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans text-lg font-medium">
                3. Im Chat nutzen
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Das Transkript steht im Chat bereit. Erstellen Sie daraus Social Media Posts, Artikel oder Zusammenfassungen.
              </p>
            </div>
          </div>

          {/* Unterstützte Formate */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-6">
              Unterstützte Formate
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                <FileAudio className="w-4 h-4 text-accent" />
                <span className="text-sm">MP3</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                <FileVideo className="w-4 h-4 text-accent" />
                <span className="text-sm">MP4</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                <FileAudio className="w-4 h-4 text-accent" />
                <span className="text-sm">WAV</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                <FileAudio className="w-4 h-4 text-accent" />
                <span className="text-sm">M4A</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                <FileVideo className="w-4 h-4 text-accent" />
                <span className="text-sm">WebM</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Maximale Dateigröße: 100 MB
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

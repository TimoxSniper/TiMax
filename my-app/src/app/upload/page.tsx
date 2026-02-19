"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  FileAudio,
  FileVideo,
  MessageSquare,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/upload/file-upload";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import { logger } from "@/lib/logger";
import { OnboardingTourProvider } from "@/components/onboarding/onboarding-tour-provider";
import { TourRenderer } from "@/components/onboarding/tour-renderer";

export default function UploadPage() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const searchParams = useSearchParams();

  // Check if tour is active (Steps 1 & 2)
  const tourParam = searchParams.get("tour");

  return (
    <OnboardingTourProvider>
      <div className="bg-background min-h-screen">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground focus:ring-primary/50 sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:ring-4"
      >
        Zum Hauptinhalt springen
      </a>

      {/* Header */}
      <MainNavigation />

      {/* Main Content */}
      <main
        id="main-content"
        className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20"
        role="main"
      >
        {/* Header */}
        <header className="mb-8 text-center sm:mb-12 lg:mb-16">
          <h1 className="text-foreground mb-3 font-serif text-3xl font-bold sm:mb-4 sm:text-4xl lg:text-5xl xl:text-6xl">
            Upload
          </h1>
          <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
          <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-sm sm:text-base lg:text-lg">
            Lade deine Audio- oder Videodatei hoch. Die KI transkribiert automatisch den Inhalt
            und bereitet ihn für die Weiterverarbeitung vor.
          </p>
        </header>

        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Upload", href: "/upload" }]} className="mb-8" />

        {/* Upload-Bereich */}
        <div className="mx-auto max-w-2xl space-y-8">
          <div data-tour="upload-dropzone">
            <FileUpload
              onUploadSuccess={(fileName) => {
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
          </div>

          {/* Erfolgs-Hinweis nach Upload */}
          {isUploaded && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div className="space-y-2">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Upload erfolgreich!
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Die Datei <span className="font-medium">{uploadedFileName}</span> wurde
                      hochgeladen und wird jetzt verarbeitet. Das Transkript ist in Kürze im Chat
                      verfügbar.
                    </p>
                    <Button asChild className="mt-3">
                      <Link href="/chat">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Zum Chat
                        <ArrowRight className="ml-2 h-4 w-4" />
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
              <p className="text-muted-foreground mb-3 text-sm">
                Bereits ein Transkript vorhanden?
              </p>
              <Button asChild variant="outline">
                <Link href="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Direkt zum Chat
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section
          className="border-border mt-24 border-t pt-16 lg:mt-32"
          aria-labelledby="how-it-works-heading"
          data-tour="workflow-section"
        >
          <div className="mb-16 text-center">
            <h2
              id="how-it-works-heading"
              className="mb-4 font-serif text-4xl font-semibold lg:text-5xl"
            >
              So funktioniert es
            </h2>
            <div className="bg-accent mx-auto mb-6 h-1 w-24" />
          </div>

          {/* Steps */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="bg-accent/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Upload className="text-accent h-8 w-8" />
              </div>
              <h3 className="font-sans text-lg font-medium">1. Datei hochladen</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Lade eine Audio- oder Videodatei hoch (MP3, MP4, WAV, M4A, WebM bis 100MB).
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-accent/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Sparkles className="text-accent h-8 w-8" />
              </div>
              <h3 className="font-sans text-lg font-medium">2. KI-Transkription</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deine Datei wird automatisch transkribiert. Die KI erkennt Sprache und wandelt sie in
                Text um.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-accent/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <MessageSquare className="text-accent h-8 w-8" />
              </div>
              <h3 className="font-sans text-lg font-medium">3. Im Chat nutzen</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Das Transkript steht im Chat bereit. Erstellen Sie daraus Social Media Posts,
                Artikel oder Zusammenfassungen.
              </p>
            </div>
          </div>

          {/* Unterstützte Formate */}
          <div className="mt-16 text-center">
            <h3 className="text-muted-foreground mb-6 text-sm font-medium tracking-wide uppercase">
              Unterstützte Formate
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2">
                <FileAudio className="text-accent h-4 w-4" />
                <span className="text-sm">MP3</span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2">
                <FileVideo className="text-accent h-4 w-4" />
                <span className="text-sm">MP4</span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2">
                <FileAudio className="text-accent h-4 w-4" />
                <span className="text-sm">WAV</span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2">
                <FileAudio className="text-accent h-4 w-4" />
                <span className="text-sm">M4A</span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2">
                <FileVideo className="text-accent h-4 w-4" />
                <span className="text-sm">WebM</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">Maximale Dateigröße: 100 MB</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Tour Component */}
      {tourParam === "2" && <TourRenderer targetSelector="upload-dropzone" />}
      {tourParam === "3" && <TourRenderer targetSelector="workflow-section" />}
    </div>
    </OnboardingTourProvider>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DynamicUploadList } from "@/lib/dynamic-import";
import { OnboardingTourProvider } from "@/components/onboarding/onboarding-tour-provider";
import { TourRenderer } from "@/components/onboarding/tour-renderer";
import ErrorBoundary from "@/components/error-boundary";

export default function UploadsPage() {
  const searchParams = useSearchParams();

  // Check if tour is active (Step 4)
  const tourParam = searchParams.get("tour");
  const isTourActive = tourParam === "4";

  return (
    <OnboardingTourProvider>
      <div className="bg-background flex min-h-screen flex-col">
      <MainNavigation />

      <main className="container mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Breadcrumbs items={[{ label: "Meine Dateien" }]} className="mb-8" />
        <div className="space-y-10">
          {/* Editorial Modernism Header */}
          <header>
            <h1 className="text-foreground mb-4 font-serif text-5xl font-bold lg:text-6xl">
              Deine Dateien
            </h1>
            <div className="bg-accent mb-6 h-1 w-24" />
            <p className="text-muted-foreground max-w-2xl text-lg">
              Verwalte deine hochgeladenen Transkripte und erstelle daraus KI-Inhalte.
            </p>
          </header>

          {/* Uploads Card */}
          <Card data-tour="uploads-list">
            <CardHeader>
              <CardTitle>Gespeicherte Transkripte</CardTitle>
              <CardDescription>
                Hier finden Sie alle bisher verarbeiteten Audio- und Videodateien.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <DynamicUploadList />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Tour Component */}
      {isTourActive && <TourRenderer targetSelector="uploads-list" />}
    </div>
    </OnboardingTourProvider>
  );
}

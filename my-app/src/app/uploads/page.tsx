"use client";

import { useSearchParams } from "next/navigation";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DynamicUploadList } from "@/lib/dynamic-import";
import { OnboardingTourProvider } from "@/components/onboarding/onboarding-tour-provider";
import { TourRenderer } from "@/components/onboarding/tour-renderer";

export default function UploadsPage() {
  const searchParams = useSearchParams();

  // Check if tour is active (Step 3)
  const tourParam = searchParams.get("tour");
  const isTourActive = tourParam === "3";

  return (
    <OnboardingTourProvider>
      <div className="bg-background flex min-h-screen flex-col">
      <MainNavigation />

      <main className="container mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-10">
          {/* Editorial Modernism Header */}
          <header>
            <h1 className="text-foreground mb-4 font-serif text-5xl font-bold lg:text-6xl">
              Ihre Dateien
            </h1>
            <div className="bg-accent mb-6 h-1 w-24" />
            <p className="text-muted-foreground max-w-2xl text-lg">
              Verwalten Sie Ihre hochgeladenen Transkripte und erstellen Sie daraus KI-Inhalte.
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
              <DynamicUploadList />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Tour Component */}
      {isTourActive && <TourRenderer targetSelector="uploads-list" />}
    </div>
    </OnboardingTourProvider>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useMobileDevice } from "@/hooks/useMobileDevice";
import { DynamicChatInterface } from "@/lib/dynamic-import";
import { OnboardingTourProvider } from "@/components/onboarding/onboarding-tour-provider";
import { TourSpotlight } from "@/components/onboarding/tour-spotlight";
import { TourDialog } from "@/components/onboarding/tour-dialog";
import { TOUR_STEPS } from "@/lib/onboarding/constants";

export default function ChatPage() {
  const isMobileDevice = useMobileDevice();
  const searchParams = useSearchParams();

  // Check if tour is active (Step 3)
  const tourParam = searchParams.get("tour");
  const isTourActive = tourParam === "3";
  const currentTourStep = isTourActive ? TOUR_STEPS.find(step => step.tourParam === "3") : null;

  // Auf echten Mobilgeräten: Vollbild-Chat ohne Header/Footer
  if (isMobileDevice) {
    return (
      <OnboardingTourProvider>
        <div className="bg-background flex h-[100dvh] flex-col overflow-hidden">
          <div data-tour="chat-interface">
            <DynamicChatInterface />
          </div>

          {/* Tour Components */}
          {isTourActive && currentTourStep && (
            <>
              <TourSpotlight
                targetSelector={currentTourStep.targetSelector}
                isActive={true}
              />
              <TourDialog isActive={true} />
            </>
          )}
        </div>
      </OnboardingTourProvider>
    );
  }

  // Desktop: Normale Ansicht mit Header und Footer
  return (
    <OnboardingTourProvider>
      <div className="bg-background flex min-h-screen flex-col">
      <MainNavigation />
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-8">
          {/* Editorial Modernism Header */}
          <header>
            <h1 className="text-foreground mb-4 font-serif text-5xl font-bold lg:text-6xl">Chat</h1>
            <div className="bg-accent mb-6 h-1 w-24" />
            <p className="text-muted-foreground max-w-2xl text-lg">
              Haben Sie ein Gespräch mit unserer KI. Stellen Sie Fragen, erhalten Sie Antworten.
            </p>
          </header>

          {/* Breadcrumbs */}
          <Breadcrumbs items={[{ label: "Chat" }]} className="mb-2" />

          {/* Chat Interface */}
          <div data-tour="chat-interface">
            <DynamicChatInterface />
          </div>
        </div>
      </main>
      <Footer />

      {/* Tour Components */}
      {isTourActive && currentTourStep && (
        <>
          <TourSpotlight
            targetSelector={currentTourStep.targetSelector}
            isActive={true}
          />
          <TourDialog isActive={true} />
        </>
      )}
    </div>
    </OnboardingTourProvider>
  );
}

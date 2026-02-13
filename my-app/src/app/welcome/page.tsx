'use client';

/**
 * Welcome Page
 *
 * First-time user onboarding screen with Editorial Modernism design.
 * Shows hero section, 3-step workflow, and CTAs for tour or direct start.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WelcomeWorkflowSteps } from '@/components/onboarding/welcome-workflow-steps';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'tour' | 'skip' | null>(null);

  /**
   * Handle "Tour starten" button click
   */
  const handleStartTour = () => {
    setIsLoading(true);
    setLoadingAction('tour');
    router.push('/upload?tour=1');
  };

  /**
   * Handle "Direkt loslegen" button click
   * Marks onboarding as completed and redirects to upload
   */
  const handleSkipTour = async () => {
    setIsLoading(true);
    setLoadingAction('skip');

    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Abschließen des Onboardings');
      }

      router.push('/upload');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero Section - Editorial Modernism */}
        <div className="mb-16 space-y-6 text-center">
          {/* Headline */}
          <h1 className="font-serif text-5xl font-bold lg:text-6xl">
            Willkommen bei TiMax
          </h1>

          {/* Bronze Accent Line */}
          <div className="mx-auto mb-6 h-1 w-24 bg-accent" />

          {/* Subheadline */}
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            TiMax verwandelt deine Video- und Audiodateien in durchsuchbare Transkripte.
            Lade Inhalte hoch, lass die KI transkribieren und chatte intelligent mit deinen Daten.
          </p>
        </div>

        {/* 3-Step Workflow Visualization */}
        <div className="mb-16">
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold">
            So funktioniert es
          </h2>
          <WelcomeWorkflowSteps />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Primary CTA - Tour starten */}
          <Button
            size="lg"
            onClick={handleStartTour}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && loadingAction === 'tour' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Tour starten
          </Button>

          {/* Secondary CTA - Direkt loslegen */}
          <Button
            size="lg"
            variant="outline"
            onClick={handleSkipTour}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && loadingAction === 'skip' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Direkt loslegen
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-muted-foreground mt-8 text-center text-sm">
          Du kannst die Tour jederzeit überspringen oder später erneut starten.
        </p>
      </div>
    </div>
  );
}

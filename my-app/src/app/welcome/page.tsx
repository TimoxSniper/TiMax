'use client';

/**
 * Welcome Page
 *
 * Onboarding für neue User mit verbessertem Design und Text
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WelcomeWorkflowSteps } from '@/components/onboarding/welcome-workflow-steps';
import { Loader2, Sparkles, Zap } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'tour' | 'skip' | null>(null);

  const handleStartTour = () => {
    setIsLoading(true);
    setLoadingAction('tour');
    router.push('/upload?tour=1');
  };

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
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          {/* Sparkle Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-4 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">
            Los geht's!
          </h1>

          {/* Bronze Accent Line */}
          <div className="mx-auto mb-6 h-1 w-20 bg-accent" />

          {/* Subheadline */}
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
            Verwandle deine Aufnahmen in wertvolle Insights. <br />
            TiMax transkribiert automatisch und macht deine Inhalte durchsuchbar.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="mb-16">
          <WelcomeWorkflowSteps />
        </div>

        {/* Value Proposition */}
        <div className="mb-12 rounded-lg border border-border bg-muted/30 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="mb-2 font-serif text-xl font-semibold">
                Spare Zeit, gewinne Erkenntnisse
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Statt stundenlang Aufnahmen anzuhören: Lade sie hoch, lass die KI transkribieren
                und stelle gezielte Fragen. Perfekt für Podcasts, Meetings, Interviews oder Vorträge.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary CTA */}
            <Button
              size="lg"
              onClick={handleStartTour}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading && loadingAction === 'tour' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Sparkles className="mr-2 h-4 w-4" />
              Kurzführung starten
            </Button>

            {/* Secondary CTA */}
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
              Sofort loslegen
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-muted-foreground text-center text-xs">
            Die Kurzführung dauert weniger als 30 Sekunden
          </p>
        </div>
      </div>
    </div>
  );
}

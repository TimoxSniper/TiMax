'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Play, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'tour' | 'skip' | null>(null);

  const handleStartTour = () => {
    setIsLoading(true);
    setLoadingAction('tour');
    router.push('/dashboard?tour=1&style=floating');
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

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-12 py-12 text-center">
        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
            Hey! 👋
          </h1>
          <div className="mx-auto h-1 w-24 bg-accent" />
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <p className="text-2xl font-medium sm:text-3xl">
            Du hast Audio oder Video?
          </p>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed">
            TiMax wandelt das in durchsuchbaren Text um.
            <br />
            <span className="font-medium text-foreground">
              Hochladen. Transkribieren lassen. Insights extrahieren.
            </span>
          </p>
        </div>

        {/* Simple Steps */}
        <div className="mx-auto grid max-w-md gap-4 text-left">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
              1
            </div>
            <div>
              <p className="font-medium">Upload deine Datei</p>
              <p className="text-muted-foreground text-sm">MP3, MP4, WAV – egal</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
              2
            </div>
            <div>
              <p className="font-medium">KI transkribiert</p>
              <p className="text-muted-foreground text-sm">Automatisch, in Minuten</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
              3
            </div>
            <div>
              <p className="font-medium">Chatte mit deinen Inhalten</p>
              <p className="text-muted-foreground text-sm">Fragen stellen, Antworten kriegen</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={handleStartTour}
              disabled={isLoading}
              className="text-base"
            >
              {isLoading && loadingAction === 'tour' && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              {!isLoading && <Play className="mr-2 h-5 w-5" />}
              30-Sekunden-Tour
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleSkipTour}
              disabled={isLoading}
              className="text-base"
            >
              {isLoading && loadingAction === 'skip' && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              {!isLoading && <ArrowRight className="mr-2 h-5 w-5" />}
              Direkt starten
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">
            Tour zeigt dir alles in 5 schnellen Schritten
          </p>
        </div>
      </div>
    </div>
  );
}

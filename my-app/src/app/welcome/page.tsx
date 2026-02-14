'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { TOUR_STYLES } from '@/lib/onboarding/constants';
import type { TourStyle } from '@/lib/onboarding/types';

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TourStyle>('pointer');

  const handleStartTour = (style: TourStyle) => {
    setIsLoading(true);
    setSelectedStyle(style);
    router.push(`/upload?tour=1&style=${style}`);
  };

  const handleSkipTour = async () => {
    setIsLoading(true);

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
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Hey! 👋</h1>
          <div className="mx-auto h-1 w-24 bg-accent mb-6" />
          <p className="text-2xl font-medium mb-4">Du hast Audio oder Video?</p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            TiMax wandelt das in durchsuchbaren Text um.
            <br />
            <span className="font-medium text-foreground">
              Hochladen. Transkribieren lassen. Insights extrahieren.
            </span>
          </p>
        </div>

        {/* Tour Style Selection - Beta Testing */}
        <div className="mb-12">
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-6">
            <p className="text-sm font-medium text-accent mb-2">🧪 Beta Testing</p>
            <p className="text-sm text-muted-foreground">
              Wähle deinen bevorzugten Tour-Style! Wir testen verschiedene Designs.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {TOUR_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStartTour(style.id)}
                disabled={isLoading}
                className={`group text-left rounded-lg border p-4 transition-all hover:border-accent hover:shadow-lg ${
                  selectedStyle === style.id && isLoading
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                      {style.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{style.description}</p>
                  </div>
                  {isLoading && selectedStyle === style.id && (
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleSkipTour}
            disabled={isLoading}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Tour überspringen, direkt starten
          </Button>
        </div>
      </div>
    </div>
  );
}

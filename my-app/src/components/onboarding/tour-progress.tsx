'use client';

/**
 * Tour Progress Component
 *
 * Displays progress indicator for the tour (e.g., "Schritt 1 von 3").
 * Uses bronze accent color for active progress.
 */

import { useTour } from './onboarding-tour-provider';

export function TourProgress() {
  const { currentStep, totalSteps } = useTour();

  if (!currentStep) return null;

  return (
    <div className="flex items-center gap-4">
      {/* Text Progress */}
      <span className="text-muted-foreground text-sm">
        Schritt {currentStep} von {totalSteps}
      </span>

      {/* Dot Progress Indicators */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-2 w-2 rounded-full transition-colors ${
                isActive || isCompleted
                  ? 'bg-accent'
                  : 'bg-secondary'
              }`}
              aria-label={`Schritt ${stepNumber}${isActive ? ' (aktuell)' : ''}${isCompleted ? ' (abgeschlossen)' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}

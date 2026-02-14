'use client';

/**
 * Tour Style: Floating Card (Discord-Style)
 * Schwebende Karte mit Pfeil zum Element
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface TourFloatingProps {
  targetSelector: string;
  isActive: boolean;
}

export function TourFloating({ targetSelector, isActive }: TourFloatingProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour } = useTour();
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);
    if (!targetElement) return;

    // Add subtle shadow to element
    targetElement.classList.add('tour-floating-highlight');

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      setCardPosition({
        top: rect.top - 120, // Above element
        left: rect.right + 20,
      });
    }, 300);
  }, [targetSelector]);

  useEffect(() => {
    if (!isActive) {
      document.querySelectorAll('.tour-floating-highlight').forEach(el => {
        el.classList.remove('tour-floating-highlight');
      });
      setCardPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isActive, updatePosition]);

  if (!currentStep || !cardPosition) return null;

  const stepConfig = TOUR_STEPS.find(step => step.step === currentStep);
  if (!stepConfig) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <style jsx global>{`
        .tour-floating-highlight {
          box-shadow: 0 0 0 4px rgba(154, 111, 79, 0.2) !important;
          border-radius: 8px !important;
        }
      `}</style>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: cardPosition.top,
              left: cardPosition.left,
              zIndex: 103,
            }}
            className="w-80 rounded-xl border border-border bg-card p-5 shadow-2xl"
          >
            {/* Arrow pointing to element */}
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 border-b border-l border-border bg-card" />

            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  {[...Array(totalSteps)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-8 rounded-full ${
                        i + 1 <= currentStep ? 'bg-accent' : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="mt-2 font-serif text-xl font-semibold">{stepConfig.title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={skipTour}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
              {stepConfig.description}
            </p>

            <div className="flex justify-between">
              {!isFirstStep && (
                <Button variant="outline" onClick={previousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
              )}
              {isLastStep ? (
                <Button onClick={completeTour} className="ml-auto">
                  <Check className="mr-2 h-4 w-4" />
                  Fertig
                </Button>
              ) : (
                <Button onClick={nextStep} className="ml-auto">
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

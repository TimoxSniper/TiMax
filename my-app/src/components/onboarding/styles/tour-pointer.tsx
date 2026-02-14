'use client';

/**
 * Tour Style: Minimalist Pointer
 * Animierter Bronze-Border + kleiner Tooltip
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface TourPointerProps {
  targetSelector: string;
  isActive: boolean;
}

export function TourPointer({ targetSelector, isActive }: TourPointerProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour } = useTour();
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);
    if (!targetElement) return;

    // Add pulsing border to target element
    targetElement.classList.add('tour-pointer-highlight');

    // Scroll to element
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Position tooltip
    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 16,
        left: rect.left,
      });
    }, 300);
  }, [targetSelector]);

  useEffect(() => {
    if (!isActive) {
      // Remove highlight from all elements
      document.querySelectorAll('.tour-pointer-highlight').forEach(el => {
        el.classList.remove('tour-pointer-highlight');
      });
      setTooltipPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isActive, updatePosition]);

  if (!currentStep || !tooltipPosition) return null;

  const stepConfig = TOUR_STEPS.find(step => step.step === currentStep);
  if (!stepConfig) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      {/* Global styles for pulsing border */}
      <style jsx global>{`
        .tour-pointer-highlight {
          position: relative;
          animation: tour-pulse 2s ease-in-out infinite;
          border: 2px solid #9A6F4F !important;
          border-radius: 8px !important;
        }
        @keyframes tour-pulse {
          0%, 100% { border-color: #9A6F4F; box-shadow: 0 0 0 0 rgba(154, 111, 79, 0.4); }
          50% { border-color: #D4A574; box-shadow: 0 0 0 8px rgba(154, 111, 79, 0); }
        }
      `}</style>

      {/* Tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              zIndex: 103,
            }}
            className="max-w-xs rounded-lg border border-accent bg-background p-4 shadow-lg"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-medium text-accent">
                  Schritt {currentStep}/{totalSteps}
                </p>
                <h3 className="font-semibold">{stepConfig.title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={skipTour} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{stepConfig.description}</p>
            <div className="flex justify-between">
              {!isFirstStep && (
                <Button size="sm" variant="ghost" onClick={previousStep}>
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Zurück
                </Button>
              )}
              {isLastStep ? (
                <Button size="sm" onClick={completeTour} className="ml-auto">
                  <Check className="mr-1 h-3 w-3" />
                  Fertig
                </Button>
              ) : (
                <Button size="sm" onClick={nextStep} className="ml-auto">
                  Weiter
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

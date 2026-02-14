'use client';

/**
 * Tour Style: Progress Bar
 * Horizontale Progress Bar oben + Element Highlight
 */

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface TourProgressProps {
  targetSelector: string;
  isActive: boolean;
}

export function TourProgressStyle({ targetSelector, isActive }: TourProgressProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour } = useTour();

  const highlightElement = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);
    if (!targetElement) return;

    targetElement.classList.add('tour-progress-highlight');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [targetSelector]);

  useEffect(() => {
    if (!isActive) {
      document.querySelectorAll('.tour-progress-highlight').forEach(el => {
        el.classList.remove('tour-progress-highlight');
      });
      return;
    }

    highlightElement();
  }, [isActive, highlightElement]);

  if (!currentStep) return null;

  const stepConfig = TOUR_STEPS.find(step => step.step === currentStep);
  if (!stepConfig) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <style jsx global>{`
        .tour-progress-highlight {
          outline: 3px solid #9A6F4F !important;
          outline-offset: 4px;
          border-radius: 8px !important;
        }
      `}</style>

      {isActive && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed left-0 right-0 top-0 z-[103] bg-background border-b border-border shadow-lg"
        >
          {/* Progress Bar */}
          <div className="h-1 bg-secondary">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-accent mb-1">
                Schritt {currentStep} von {totalSteps}
              </p>
              <h3 className="font-semibold text-lg">{stepConfig.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stepConfig.description}</p>
            </div>

            <div className="ml-4 flex items-center gap-2">
              {!isFirstStep && (
                <Button size="sm" variant="ghost" onClick={previousStep}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {isLastStep ? (
                <Button size="sm" onClick={completeTour}>
                  <Check className="mr-1 h-3 w-3" />
                  Fertig
                </Button>
              ) : (
                <Button size="sm" onClick={nextStep}>
                  Weiter
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={skipTour}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

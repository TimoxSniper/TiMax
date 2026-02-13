'use client';

/**
 * Tour Dialog Component
 *
 * Displays tour step content with Editorial Modernism design.
 * Positioned relative to the spotlight with navigation controls.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { TourProgress } from './tour-progress';
import { useTour } from './onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';

interface TourDialogProps {
  /** Whether the dialog is active */
  isActive: boolean;
}

export function TourDialog({ isActive }: TourDialogProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour } = useTour();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !currentStep) return null;

  const stepConfig = TOUR_STEPS.find((step) => step.step === currentStep);

  if (!stepConfig) {
    console.error('Step configuration not found for step:', currentStep);
    return null;
  }

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-black/50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[102] w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="rounded-md border border-border bg-background shadow-editorial-lg">
              {/* Header */}
              <div className="border-b border-border p-6">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h2 className="font-serif text-2xl font-semibold">
                      {stepConfig.title}
                    </h2>

                    {/* Bronze Accent Line */}
                    <div className="mt-2 h-1 w-16 bg-accent" />
                  </div>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipTour}
                    className="ml-2"
                    aria-label="Tour überspringen"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <TourProgress />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {stepConfig.description}
                </p>
              </div>

              {/* Footer - Navigation */}
              <div className="flex items-center justify-between border-t border-border p-6">
                {/* Back/Skip Button */}
                <div>
                  {isFirstStep ? (
                    <Button variant="ghost" onClick={skipTour}>
                      Überspringen
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={previousStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                  )}
                </div>

                {/* Next/Finish Button */}
                <div>
                  {isLastStep ? (
                    <Button onClick={completeTour}>
                      <Check className="mr-2 h-4 w-4" />
                      Fertig
                    </Button>
                  ) : (
                    <Button onClick={nextStep}>
                      Weiter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

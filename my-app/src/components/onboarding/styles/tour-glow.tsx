'use client';

/**
 * Tour Style: Subtle Glow (Apple-Style)
 * Sanfter Leuchteffekt + minimaler Tooltip
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface TourGlowProps {
  targetSelector: string;
  isActive: boolean;
}

export function TourGlow({ targetSelector, isActive }: TourGlowProps) {
  const { currentStep, totalSteps, nextStep, completeTour } = useTour();
  const [showTooltip, setShowTooltip] = useState(true);

  const highlightElement = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);
    if (!targetElement) return;

    targetElement.classList.add('tour-glow-highlight');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [targetSelector]);

  useEffect(() => {
    if (!isActive) {
      document.querySelectorAll('.tour-glow-highlight').forEach(el => {
        el.classList.remove('tour-glow-highlight');
      });
      return;
    }

    highlightElement();
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, [isActive, highlightElement]);

  if (!currentStep) return null;

  const stepConfig = TOUR_STEPS.find(step => step.step === currentStep);
  if (!stepConfig) return null;

  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <style jsx global>{`
        .tour-glow-highlight {
          position: relative;
          animation: tour-glow 3s ease-in-out infinite;
        }
        @keyframes tour-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 165, 116, 0.3),
                        0 0 40px rgba(212, 165, 116, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 165, 116, 0.5),
                        0 0 60px rgba(212, 165, 116, 0.2);
          }
        }
      `}</style>

      <AnimatePresence>
        {isActive && showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[103] w-64 rounded-lg bg-card/95 backdrop-blur border border-accent/20 p-4 shadow-xl"
          >
            <p className="text-xs text-accent mb-1">{currentStep}/{totalSteps}</p>
            <p className="text-sm mb-3">{stepConfig.title}</p>
            {isLastStep ? (
              <Button size="sm" onClick={completeTour} className="w-full">
                <Check className="mr-1 h-3 w-3" />
                Fertig
              </Button>
            ) : (
              <Button size="sm" onClick={nextStep} variant="ghost" className="w-full">
                Weiter
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

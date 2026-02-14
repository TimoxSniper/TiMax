'use client';

/**
 * Tour Style: Floating Card (MASSIV VERBESSERT)
 * Premium Discord-Style floating card with smart positioning
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { TOUR_STEPS } from '@/lib/onboarding/constants';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X, Sparkles } from 'lucide-react';

interface TourFloatingProps {
  targetSelector: string;
  isActive: boolean;
}

interface Position {
  top: number;
  left: number;
  placement: 'left' | 'right' | 'top' | 'bottom';
}

export function TourFloating({ targetSelector, isActive }: TourFloatingProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour } = useTour();
  const [cardPosition, setCardPosition] = useState<Position | null>(null);

  const calculateOptimalPosition = useCallback((targetRect: DOMRect): Position => {
    const cardWidth = 380;
    const cardHeight = 280;
    const spacing = 24;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try right placement first
    if (targetRect.right + spacing + cardWidth < viewportWidth) {
      return {
        left: targetRect.right + spacing,
        top: Math.max(20, Math.min(targetRect.top, viewportHeight - cardHeight - 20)),
        placement: 'right',
      };
    }

    // Try left placement
    if (targetRect.left - spacing - cardWidth > 0) {
      return {
        left: targetRect.left - spacing - cardWidth,
        top: Math.max(20, Math.min(targetRect.top, viewportHeight - cardHeight - 20)),
        placement: 'left',
      };
    }

    // Try bottom placement
    if (targetRect.bottom + spacing + cardHeight < viewportHeight) {
      return {
        left: Math.max(20, Math.min(targetRect.left, viewportWidth - cardWidth - 20)),
        top: targetRect.bottom + spacing,
        placement: 'bottom',
      };
    }

    // Fallback: top placement
    return {
      left: Math.max(20, Math.min(targetRect.left, viewportWidth - cardWidth - 20)),
      top: Math.max(20, targetRect.top - spacing - cardHeight),
      placement: 'top',
    };
  }, []);

  const updatePosition = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);

    if (!targetElement) {
      console.warn(`[Tour] Element not found: [data-tour="${targetSelector}"]`);
      // Retry after delay (for dynamically loaded components)
      setTimeout(() => {
        const retryElement = document.querySelector(`[data-tour="${targetSelector}"]`);
        if (retryElement) {
          retryElement.classList.add('tour-floating-highlight');
          retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            const rect = retryElement.getBoundingClientRect();
            const position = calculateOptimalPosition(rect);
            setCardPosition(position);
          }, 300);
        }
      }, 500);
      return;
    }

    // Add subtle highlight
    targetElement.classList.add('tour-floating-highlight');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      const position = calculateOptimalPosition(rect);
      setCardPosition(position);
    }, 300);
  }, [targetSelector, calculateOptimalPosition]);

  useEffect(() => {
    if (!isActive) {
      document.querySelectorAll('.tour-floating-highlight').forEach(el => {
        el.classList.remove('tour-floating-highlight');
      });
      setCardPosition(null);
      return;
    }

    updatePosition();

    // Keyboard shortcuts
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!currentStep) return;
      if (e.key === 'Escape') skipTour();
      if (e.key === 'ArrowRight' && currentStep < totalSteps) nextStep();
      if (e.key === 'ArrowLeft' && currentStep > 1) previousStep();
      if (e.key === 'Enter' && currentStep === totalSteps) completeTour();
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [isActive, updatePosition, currentStep, totalSteps, nextStep, previousStep, skipTour, completeTour]);

  if (!currentStep || !cardPosition) return null;

  const stepConfig = TOUR_STEPS.find(step => step.step === currentStep);
  if (!stepConfig) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  // Arrow position based on placement
  const getArrowStyles = () => {
    const base = 'absolute h-5 w-5 rotate-45 border border-border bg-gradient-to-br from-card to-card/95';
    switch (cardPosition.placement) {
      case 'right':
        return `${base} -left-2.5 top-12 border-r-0 border-t-0`;
      case 'left':
        return `${base} -right-2.5 top-12 border-l-0 border-b-0`;
      case 'bottom':
        return `${base} left-12 -top-2.5 border-b-0 border-l-0`;
      case 'top':
        return `${base} left-12 -bottom-2.5 border-t-0 border-r-0`;
    }
  };

  return (
    <>
      <style jsx global>{`
        .tour-floating-highlight {
          position: relative;
          box-shadow: 0 0 0 3px rgba(154, 111, 79, 0.15),
                      0 0 12px rgba(154, 111, 79, 0.08) !important;
          border-radius: 8px !important;
          transition: box-shadow 0.3s ease;
        }
        .tour-floating-highlight:hover {
          box-shadow: 0 0 0 3px rgba(154, 111, 79, 0.25),
                      0 0 16px rgba(154, 111, 79, 0.12) !important;
        }
      `}</style>

      {/* Subtle Backdrop */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-black/10 backdrop-blur-[1px]"
            onClick={skipTour}
          />
        )}
      </AnimatePresence>

      {/* Floating Card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: cardPosition.top,
              left: cardPosition.left,
              zIndex: 102,
            }}
            className="w-[380px] rounded-2xl border-2 border-border bg-gradient-to-br from-card via-card to-card/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Arrow */}
            <div className={getArrowStyles()} />

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex-1">
                  {/* Progress Dots */}
                  <div className="mb-3 flex items-center gap-2">
                    {[...Array(totalSteps)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: i + 1 === currentStep ? 1 : 0.8 }}
                        className={`h-2 rounded-full transition-all ${
                          i + 1 === currentStep
                            ? 'w-10 bg-accent'
                            : i + 1 < currentStep
                            ? 'w-2 bg-accent/60'
                            : 'w-2 bg-secondary'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="font-serif text-2xl font-bold">{stepConfig.title}</h3>
                  </div>

                  {/* Step Number */}
                  <p className="mt-1 text-xs font-medium text-accent">
                    Schritt {currentStep} von {totalSteps}
                  </p>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipTour}
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                {stepConfig.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2">
                {isFirstStep ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-muted-foreground"
                  >
                    Tour überspringen
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={previousStep}>
                    <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                    Zurück
                  </Button>
                )}

                {isLastStep ? (
                  <Button onClick={completeTour} size="lg" className="ml-auto shadow-lg">
                    <Check className="mr-2 h-4 w-4" />
                    Tour abschließen
                  </Button>
                ) : (
                  <Button onClick={nextStep} size="lg" className="ml-auto shadow-lg">
                    Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Keyboard Hints */}
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">←</kbd>
                <span>Zurück</span>
                <span className="text-border">•</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">→</kbd>
                <span>Weiter</span>
                <span className="text-border">•</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
                <span>Schließen</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

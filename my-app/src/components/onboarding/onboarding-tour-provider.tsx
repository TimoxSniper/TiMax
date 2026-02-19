'use client';

/**
 * Onboarding Tour Provider
 *
 * React Context for managing tour state via URL query parameters.
 * Handles navigation between tour steps and completion.
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { TourContextState, TourStyle } from '@/lib/onboarding/types';
import { TOUR_STEPS, TOTAL_TOUR_STEPS, TOUR_QUERY_PARAM, TOUR_STYLE_PARAM } from '@/lib/onboarding/constants';
import { parseTourStep } from '@/lib/onboarding/utils';

const TourContext = createContext<TourContextState | null>(null);

interface OnboardingTourProviderProps {
  children: React.ReactNode;
}

export function OnboardingTourProvider({ children }: OnboardingTourProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current step and style from URL query parameters
  const tourParam = searchParams.get(TOUR_QUERY_PARAM);
  const styleParam = searchParams.get(TOUR_STYLE_PARAM);
  const currentStep = parseTourStep(tourParam);
  const isActive = currentStep !== null;
  const style: TourStyle = (styleParam as TourStyle) || 'default';

  /**
   * Navigate to next tour step
   */
  const nextStep = useCallback(() => {
    if (!currentStep) return;

    const nextStepNumber = currentStep + 1;

    if (nextStepNumber > TOTAL_TOUR_STEPS) {
      // Tour complete - will be handled by completeTour
      return;
    }

    const nextStepConfig = TOUR_STEPS.find((step) => step.step === nextStepNumber);

    if (!nextStepConfig) {
      console.error('Next step configuration not found');
      return;
    }

    const url = `${nextStepConfig.route}?${TOUR_QUERY_PARAM}=${nextStepConfig.tourParam}&${TOUR_STYLE_PARAM}=${style}`;
    router.push(url);
  }, [currentStep, router]);

  /**
   * Navigate to previous tour step
   */
  const previousStep = useCallback(() => {
    if (!currentStep || currentStep === 1) return;

    const prevStepNumber = currentStep - 1;
    const prevStepConfig = TOUR_STEPS.find((step) => step.step === prevStepNumber);

    if (!prevStepConfig) {
      console.error('Previous step configuration not found');
      return;
    }

    const url = `${prevStepConfig.route}?${TOUR_QUERY_PARAM}=${prevStepConfig.tourParam}&${TOUR_STYLE_PARAM}=${style}`;
    router.push(url);
  }, [currentStep, router]);

  /**
   * Skip tour and mark onboarding as completed
   * Without marking complete, the middleware would redirect back to /welcome on every /chat visit
   */
  const skipTour = useCallback(async () => {
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' });
    } catch {
      // Non-blocking: if this fails, user can still navigate away
    }
    router.push(pathname);
  }, [router, pathname]);

  /**
   * Complete tour and mark onboarding as done
   */
  const completeTour = useCallback(async () => {
    try {
      // Mark onboarding as completed
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Redirect to chat
      router.push('/chat');
    } catch (error) {
      console.error('Error completing tour:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  }, [router]);

  const contextValue = useMemo<TourContextState>(
    () => ({
      currentStep,
      isActive,
      totalSteps: TOTAL_TOUR_STEPS,
      style,
      nextStep,
      previousStep,
      skipTour,
      completeTour,
    }),
    [currentStep, isActive, style, nextStep, previousStep, skipTour, completeTour]
  );

  return <TourContext.Provider value={contextValue}>{children}</TourContext.Provider>;
}

/**
 * Hook to access tour context
 */
export function useTour() {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error('useTour must be used within OnboardingTourProvider');
  }

  return context;
}

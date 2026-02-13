'use client';

/**
 * Onboarding Tour Provider
 *
 * React Context for managing tour state via URL query parameters.
 * Handles navigation between tour steps and completion.
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { TourContextState } from '@/lib/onboarding/types';
import { TOUR_STEPS, TOTAL_TOUR_STEPS, TOUR_QUERY_PARAM } from '@/lib/onboarding/constants';
import { parseTourStep } from '@/lib/onboarding/utils';

const TourContext = createContext<TourContextState | null>(null);

interface OnboardingTourProviderProps {
  children: React.ReactNode;
}

export function OnboardingTourProvider({ children }: OnboardingTourProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current step from URL query parameter
  const tourParam = searchParams.get(TOUR_QUERY_PARAM);
  const currentStep = parseTourStep(tourParam);
  const isActive = currentStep !== null;

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

    router.push(`${nextStepConfig.route}?${TOUR_QUERY_PARAM}=${nextStepConfig.tourParam}`);
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

    router.push(`${prevStepConfig.route}?${TOUR_QUERY_PARAM}=${prevStepConfig.tourParam}`);
  }, [currentStep, router]);

  /**
   * Skip tour without completing onboarding
   * Removes tour parameter from URL
   */
  const skipTour = useCallback(async () => {
    // Remove tour parameter from URL
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
      nextStep,
      previousStep,
      skipTour,
      completeTour,
    }),
    [currentStep, isActive, nextStep, previousStep, skipTour, completeTour]
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

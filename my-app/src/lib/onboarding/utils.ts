/**
 * Onboarding System Utilities
 *
 * Helper functions for onboarding status checks.
 */

import type { User } from '@clerk/nextjs/server';
import type { ClerkPublicMetadata, OnboardingStatus } from './types';
import { NEW_USER_WINDOW_MS, TOTAL_TOUR_STEPS } from './constants';

/**
 * Check if user has completed onboarding
 *
 * @param user - Clerk user object
 * @returns true if onboarding is completed
 */
export function hasCompletedOnboarding(user: User): boolean {
  const metadata = user.publicMetadata as ClerkPublicMetadata;
  return metadata?.onboardingCompleted === true;
}

/**
 * Check if user should see onboarding
 *
 * Only show onboarding if:
 * 1. User has not completed onboarding
 * 2. User was created within the last 24 hours
 *
 * @param user - Clerk user object
 * @returns true if user should see onboarding
 */
export function shouldShowOnboarding(user: User): boolean {
  // Check if already completed
  if (hasCompletedOnboarding(user)) {
    return false;
  }

  // Check if user is new (created within last 24 hours)
  const userCreatedAt = new Date(user.createdAt);
  const isNewUser = (Date.now() - userCreatedAt.getTime()) < NEW_USER_WINDOW_MS;

  return isNewUser;
}

/**
 * Get onboarding status from user metadata
 *
 * @param user - Clerk user object
 * @returns Onboarding status object
 */
export function getOnboardingStatus(user: User): OnboardingStatus {
  const metadata = user.publicMetadata as ClerkPublicMetadata;

  return {
    completed: metadata?.onboardingCompleted === true,
    completedAt: metadata?.onboardingCompletedAt,
  };
}

/**
 * Parse tour step from query parameter
 *
 * @param tourParam - Tour query parameter value (e.g., "1", "2", "3", "4")
 * @returns Step number or null if invalid
 */
export function parseTourStep(tourParam: string | null): number | null {
  if (!tourParam) {
    return null;
  }

  const step = parseInt(tourParam, 10);

  if (isNaN(step) || step < 1 || step > TOTAL_TOUR_STEPS) {
    return null;
  }

  return step;
}

/**
 * Check if user is within new user window
 *
 * @param user - Clerk user object
 * @returns true if user was created within last 24 hours
 */
export function isNewUser(user: User): boolean {
  const userCreatedAt = new Date(user.createdAt);
  return (Date.now() - userCreatedAt.getTime()) < NEW_USER_WINDOW_MS;
}

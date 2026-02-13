/**
 * Onboarding System Types
 *
 * TypeScript definitions for the user onboarding flow.
 */

/**
 * Tour step definition
 */
export interface TourStep {
  /** Step number (1-indexed) */
  step: number;
  /** Target route for this step */
  route: string;
  /** Query parameter value (e.g., "1", "2", "3") */
  tourParam: string;
  /** Data attribute to identify the target element */
  targetSelector: string;
  /** German title for the step */
  title: string;
  /** German description/instructions */
  description: string;
  /** Spotlight position relative to target */
  spotlightPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Dialog position relative to spotlight */
  dialogPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Onboarding status from Clerk publicMetadata
 */
export interface OnboardingStatus {
  /** Whether user has completed onboarding */
  completed: boolean;
  /** ISO timestamp when onboarding was completed */
  completedAt?: string;
}

/**
 * Tour context state
 */
export interface TourContextState {
  /** Current step (1-3), null if not in tour */
  currentStep: number | null;
  /** Whether tour is active */
  isActive: boolean;
  /** Total number of steps */
  totalSteps: number;
  /** Navigate to next step */
  nextStep: () => void;
  /** Navigate to previous step */
  previousStep: () => void;
  /** Skip/exit tour without completing */
  skipTour: () => void;
  /** Complete tour and mark onboarding as done */
  completeTour: () => void;
}

/**
 * Clerk user publicMetadata extended with onboarding fields
 */
export interface ClerkPublicMetadata {
  /** Admin role flag */
  role?: 'admin';
  /** Onboarding completion flag */
  onboardingCompleted?: boolean;
  /** ISO timestamp when onboarding was completed */
  onboardingCompletedAt?: string;
}

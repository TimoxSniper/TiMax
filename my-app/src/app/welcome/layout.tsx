/**
 * Welcome Page Layout
 *
 * Server component that checks if user has completed onboarding.
 * Redirects to /chat if already completed.
 */

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { hasCompletedOnboarding } from '@/lib/onboarding/utils';

export default async function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user
  const user = await currentUser();

  // Redirect to chat if not authenticated (shouldn't happen with middleware)
  if (!user) {
    redirect('/sign-in');
  }

  // Redirect to chat if onboarding already completed
  if (hasCompletedOnboarding(user)) {
    redirect('/chat');
  }

  return <>{children}</>;
}

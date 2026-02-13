/**
 * Welcome Page Layout
 *
 * Simple layout for welcome page - redirect logic removed for easier testing.
 * Production: Add redirect logic back or handle in middleware.
 */

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user
  const user = await currentUser();

  // Redirect to chat if not authenticated
  if (!user) {
    redirect('/sign-in');
  }

  // Note: Redirect for completed onboarding removed for testing
  // You can now access /welcome anytime to preview the page

  return <>{children}</>;
}

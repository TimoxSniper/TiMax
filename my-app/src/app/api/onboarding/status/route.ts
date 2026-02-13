/**
 * Onboarding Status API Route
 *
 * GET /api/onboarding/status
 * Returns user's onboarding status from Clerk publicMetadata
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getOnboardingStatus } from '@/lib/onboarding/utils';

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Get onboarding status from metadata
    const status = getOnboardingStatus(user);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching onboarding status:', error);

    return NextResponse.json(
      {
        error: 'Fehler beim Abrufen des Onboarding-Status',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    );
  }
}

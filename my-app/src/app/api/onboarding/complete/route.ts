/**
 * Onboarding Complete API Route
 *
 * POST /api/onboarding/complete
 * Marks user's onboarding as completed in Clerk publicMetadata
 */

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Get current user to verify they exist
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Update user metadata with onboarding completion
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);

    return NextResponse.json(
      {
        error: 'Fehler beim Abschließen des Onboardings',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    );
  }
}

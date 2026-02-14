'use client';

/**
 * Tour Renderer - Loads Floating Card style
 */

import { useTour } from './onboarding-tour-provider';
import { TourFloating } from './styles/tour-floating';

interface TourRendererProps {
  targetSelector: string;
}

export function TourRenderer({ targetSelector }: TourRendererProps) {
  const { isActive } = useTour();

  if (!isActive) return null;

  return <TourFloating targetSelector={targetSelector} isActive={isActive} />;
}

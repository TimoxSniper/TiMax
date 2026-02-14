'use client';

/**
 * Tour Renderer - Loads correct style based on user selection
 */

import { useTour } from './onboarding-tour-provider';
import { TourSpotlight } from './tour-spotlight';
import { TourDialog } from './tour-dialog';
import { TourPointer } from './styles/tour-pointer';
import { TourFloating } from './styles/tour-floating';
import { TourProgressStyle } from './styles/tour-progress';
import { TourBadges } from './styles/tour-badges';
import { TourVideo } from './styles/tour-video';
import { TourGlow } from './styles/tour-glow';

interface TourRendererProps {
  targetSelector: string;
}

export function TourRenderer({ targetSelector }: TourRendererProps) {
  const { isActive, style } = useTour();

  if (!isActive) return null;

  switch (style) {
    case 'pointer':
      return <TourPointer targetSelector={targetSelector} isActive={isActive} />;

    case 'floating':
      return <TourFloating targetSelector={targetSelector} isActive={isActive} />;

    case 'progress':
      return <TourProgressStyle targetSelector={targetSelector} isActive={isActive} />;

    case 'badges':
      return <TourBadges />;

    case 'video':
      return <TourVideo />;

    case 'glow':
      return <TourGlow targetSelector={targetSelector} isActive={isActive} />;

    case 'default':
    default:
      return (
        <>
          <TourSpotlight targetSelector={targetSelector} isActive={isActive} />
          <TourDialog isActive={isActive} />
        </>
      );
  }
}

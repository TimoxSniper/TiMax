'use client';

/**
 * Tour Spotlight Component
 *
 * Creates a brutalist overlay with a transparent spotlight highlighting the target element.
 * Uses sharp edges (no blur) consistent with Editorial Modernism design.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourSpotlightProps {
  /** Data attribute selector for the target element */
  targetSelector: string;
  /** Whether the spotlight is active */
  isActive: boolean;
  /** Padding around the target element */
  padding?: number;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourSpotlight({
  targetSelector,
  isActive,
  padding = 16,
}: TourSpotlightProps) {
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

  /**
   * Calculate spotlight position based on target element
   */
  const updateSpotlightPosition = useCallback(() => {
    const targetElement = document.querySelector(`[data-tour="${targetSelector}"]`);

    if (!targetElement) {
      console.warn(`Tour target element not found: ${targetSelector}`);
      setSpotlightRect(null);
      return;
    }

    // Auto-scroll to element with smooth behavior
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    // Wait for scroll to finish before positioning spotlight
    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();

      setSpotlightRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    }, 300);
  }, [targetSelector, padding]);

  useEffect(() => {
    if (!isActive) {
      setSpotlightRect(null);
      return;
    }

    // Initial position
    updateSpotlightPosition();

    // Update on resize/scroll
    const handleUpdate = () => {
      updateSpotlightPosition();
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isActive, updateSpotlightPosition]);

  return (
    <AnimatePresence>
      {isActive && spotlightRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{
            background: `
              radial-gradient(
                circle at ${spotlightRect.left + spotlightRect.width / 2}px ${spotlightRect.top + spotlightRect.height / 2}px,
                transparent ${Math.max(spotlightRect.width, spotlightRect.height) / 2}px,
                rgba(0, 0, 0, 0.7) ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + 50}px
              )
            `,
          }}
        >
          {/* Spotlight border (brutalist sharp edges) */}
          <div
            className="absolute border-2 border-accent"
            style={{
              top: `${spotlightRect.top}px`,
              left: `${spotlightRect.left}px`,
              width: `${spotlightRect.width}px`,
              height: `${spotlightRect.height}px`,
              boxShadow: '0 0 0 4px rgba(154, 111, 79, 0.2)', // Bronze glow
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

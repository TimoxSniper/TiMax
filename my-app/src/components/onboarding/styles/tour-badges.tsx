'use client';

/**
 * Tour Style: Inline Badges
 * Kleine "Neu!" Badges an Elementen
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function TourBadges() {
  const { completeTour } = useTour();

  useEffect(() => {
    // Add badges to all tour elements
    const elements = document.querySelectorAll('[data-tour]');
    elements.forEach((el, index) => {
      const badge = document.createElement('div');
      badge.className = 'tour-badge';
      badge.textContent = '👋 Neu!';
      badge.style.cssText = `
        position: absolute;
        top: -12px;
        right: -12px;
        background: #9A6F4F;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        z-index: 100;
        animation: tour-bounce 2s ease-in-out infinite;
      `;
      (el as HTMLElement).style.position = 'relative';
      el.appendChild(badge);
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes tour-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.querySelectorAll('.tour-badge').forEach(badge => badge.remove());
      style.remove();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-1/2 z-[103] -translate-x-1/2"
    >
      <div className="rounded-full bg-card border border-border shadow-lg px-6 py-3">
        <p className="text-sm mb-2 text-center">
          <span className="font-semibold">Entdecke die Features!</span>
          <br />
          <span className="text-muted-foreground text-xs">Klick auf die Badges für mehr Info</span>
        </p>
        <Button size="sm" onClick={completeTour} className="w-full">
          <Check className="mr-2 h-3 w-3" />
          Verstanden
        </Button>
      </div>
    </motion.div>
  );
}

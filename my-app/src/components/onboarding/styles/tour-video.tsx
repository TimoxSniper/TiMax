'use client';

/**
 * Tour Style: Video Tutorial
 * Zeigt Walkthrough-Video (Placeholder)
 */

import { motion } from 'framer-motion';
import { useTour } from '../onboarding-tour-provider';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

export function TourVideo() {
  const { completeTour, skipTour } = useTour();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[103] flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-3xl rounded-xl bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold">TiMax Walkthrough</h2>
            <p className="text-muted-foreground text-sm">30 Sekunden Tutorial</p>
          </div>
          <Button variant="ghost" size="icon" onClick={skipTour}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Placeholder */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Play className="h-16 w-16 mx-auto mb-4 text-accent" />
            <p className="text-muted-foreground">
              Video kommt bald!
              <br />
              <span className="text-xs">(Placeholder für Beta)</span>
            </p>
          </div>
        </div>

        <Button onClick={completeTour} className="w-full">
          Tour abschließen
        </Button>
      </div>
    </motion.div>
  );
}

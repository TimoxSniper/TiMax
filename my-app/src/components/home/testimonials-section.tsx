"use client";

import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Star } from "lucide-react";
import { memo } from "react";

// Testimonials entfernt - werden später durch echte ersetzt
// Für jetzt: Section entfernt oder als "Coming Soon" markiert

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Was Nutzer sagen
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Echte Erfahrungen von Beta-Nutzern - Coming Soon
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});


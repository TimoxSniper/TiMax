"use client";

import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Play } from "lucide-react";
import { memo } from "react";

export const DemoVideoSection = memo(function DemoVideoSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 z-10">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Sieh es in Aktion
            </h2>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              Demo-Video - Coming Soon
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200} direction="up">
          <GlassCard variant="elevated" className="p-4 sm:p-6 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <Play className="w-16 h-16 mx-auto text-black/40 dark:text-white/40" aria-hidden="true" />
                <p className="text-black/70 dark:text-white/70 text-sm">
                  Demo-Video kommt bald
                </p>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
});


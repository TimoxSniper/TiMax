"use client";

import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Play } from "lucide-react";
import { memo } from "react";

export const DemoVideoSection = memo(function DemoVideoSection() {
  return (
    <section className="relative z-10 px-4 py-12 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Sieh es in Aktion
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg lg:text-xl">
              Demo-Video - Coming Soon
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200} direction="up">
          <Card variant="default" className="overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Clean video container - Editorial Modernism, no gradient */}
            <div className="bg-secondary border-border relative flex aspect-video items-center justify-center rounded-[6px] border">
              <div className="space-y-3 text-center sm:space-y-4">
                {/* Bronze play button - Editorial Modernism */}
                <div className="bg-accent shadow-editorial-md hover:shadow-editorial-lg mx-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-[6px] transition-all duration-300 hover:-translate-y-1 sm:h-20 sm:w-20">
                  <Play
                    className="text-accent-foreground ml-0.5 h-7 w-7 sm:ml-1 sm:h-10 sm:w-10"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-muted-foreground text-xs tracking-wider uppercase sm:text-sm sm:tracking-widest">
                  Demo-Video kommt bald
                </p>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
});

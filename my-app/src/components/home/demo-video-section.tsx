"use client";

import { Card } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Play } from "lucide-react";
import { memo } from "react";

export const DemoVideoSection = memo(function DemoVideoSection() {
  return (
    <section className="relative px-4 py-20 sm:py-24 lg:py-32 z-10">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-foreground">
              Sieh es in Aktion
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6" />
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Demo-Video - Coming Soon
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200} direction="up">
          <Card variant="default" className="p-6 sm:p-8 overflow-hidden">
            {/* Clean video container - Editorial Modernism, no gradient */}
            <div className="relative aspect-video bg-secondary rounded-[6px] flex items-center justify-center border border-border">
              <div className="text-center space-y-4">
                {/* Bronze play button - Editorial Modernism */}
                <div className="w-20 h-20 rounded-[6px] bg-accent flex items-center justify-center mx-auto shadow-editorial-md transition-all duration-300 hover:-translate-y-1 hover:shadow-editorial-lg cursor-pointer">
                  <Play className="w-10 h-10 text-accent-foreground ml-1" aria-hidden="true" />
                </div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
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

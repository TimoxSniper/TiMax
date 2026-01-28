"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/magic-ui/glass-card";
import { AnimatedSection } from "@/components/magic-ui/animated-section";

// Vereinfachte Konstanten
const ANIMATION_DURATION = 1500; // Reduziert von 3000ms
const ANIMATION_STEPS = 50; // Reduziert von 100

interface StatsSectionProps {
  onVisible?: () => void;
}

export function StatsSection({ onVisible }: StatsSectionProps) {
  const [statsVisible, setStatsVisible] = useState(false);
  const [countedStats, setCountedStats] = useState({ speed: 0, seamless: 0, scalable: 0, workflow: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            onVisible?.();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => {
      if (statsElement) observer.unobserve(statsElement);
    };
  }, [onVisible]);

  useEffect(() => {
    if (!statsVisible) return;

    // Vereinfachte Animation - keine Exponential-Funktionen mehr
    const interval = ANIMATION_DURATION / ANIMATION_STEPS;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / ANIMATION_STEPS, 1);

      // Einfache lineare/quadratische Interpolation
      setCountedStats({
        speed: Math.floor(10 * progress),
        seamless: Math.floor(100 * progress),
        scalable: progress < 0.95 
          ? Math.floor(50000 * (progress / 0.95))
          : Infinity,
        workflow: 1,
      });

      if (currentStep >= ANIMATION_STEPS) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible]);

  return (
    <section id="stats-section" className="relative px-4 py-16 sm:px-6 lg:px-8 z-10">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GlassCard variant="subtle" className="p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                {countedStats.speed}x
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">Schneller</div>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                {countedStats.seamless}%
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">Nahtlos</div>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2 text-black dark:text-white transition-all duration-1000 ease-out">
                {countedStats.scalable === Infinity ? "∞" : countedStats.scalable.toLocaleString('de-DE')}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">Skalierbar</div>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">
                {countedStats.workflow}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70">Workflow</div>
            </GlassCard>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}


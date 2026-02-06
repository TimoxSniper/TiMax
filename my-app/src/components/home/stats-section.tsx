"use client";

import { useEffect, useState, memo } from "react";
import { AnimatedSection } from "@/components/magic-ui/animated-section";

// Animation settings
const ANIMATION_DURATION = 1500;
const ANIMATION_STEPS = 50;

interface StatsSectionProps {
  onVisible?: () => void;
}

export const StatsSection = memo(function StatsSection({ onVisible }: StatsSectionProps) {
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

    const interval = ANIMATION_DURATION / ANIMATION_STEPS;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / ANIMATION_STEPS, 1);

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

  const stats = [
    { value: `${countedStats.speed}x`, label: "Schneller" },
    { value: `${countedStats.seamless}%`, label: "Nahtlos" },
    { value: countedStats.scalable === Infinity ? "∞" : countedStats.scalable.toLocaleString('de-DE'), label: "Skalierbar" },
    { value: `${countedStats.workflow}`, label: "Workflow" },
  ];

  return (
    <section id="stats-section" className="relative px-4 py-12 sm:py-20 lg:py-28 z-10 border-t border-b border-border">
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          {/* Horizontal stats layout with vertical dividers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 md:divide-x divide-border">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="flex flex-col items-center text-center px-2 sm:px-8 lg:px-16 py-3 sm:py-6 md:py-0"
              >
                {/* Large bronze number - Editorial Modernism style */}
                <div className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold text-accent leading-none mb-1 sm:mb-3">
                  {stat.value}
                </div>
                {/* Small uppercase label */}
                <div className="text-[10px] sm:text-xs lg:text-sm font-medium uppercase tracking-wider sm:tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

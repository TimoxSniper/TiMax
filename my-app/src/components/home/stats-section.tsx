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
  const [countedStats, setCountedStats] = useState({
    speed: 0,
    seamless: 0,
    scalable: 0,
    workflow: 0,
  });

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
        scalable: progress < 0.95 ? Math.floor(50000 * (progress / 0.95)) : Infinity,
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
    {
      value:
        countedStats.scalable === Infinity ? "∞" : countedStats.scalable.toLocaleString("de-DE"),
      label: "Skalierbar",
    },
    { value: `${countedStats.workflow}`, label: "Workflow" },
  ];

  return (
    <section
      id="stats-section"
      className="border-border relative z-10 border-t border-b px-4 py-12 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto max-w-6xl">
        <AnimatedSection direction="up">
          {/* Horizontal stats layout with vertical dividers */}
          <div className="divide-border grid grid-cols-2 gap-4 sm:gap-0 md:grid-cols-4 md:divide-x">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-2 py-3 text-center sm:px-8 sm:py-6 md:py-0 lg:px-16"
              >
                {/* Large bronze number - Editorial Modernism style */}
                <div className="text-accent mb-1 font-serif text-3xl leading-none font-bold sm:mb-3 sm:text-5xl lg:text-7xl">
                  {stat.value}
                </div>
                {/* Small uppercase label */}
                <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase sm:text-xs sm:tracking-widest lg:text-sm">
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

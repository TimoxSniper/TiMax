"use client";

import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { memo } from "react";

// Testimonials - Pull-quote style for Editorial Modernism
// Placeholder until real testimonials are collected

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="border-border relative z-10 border-t px-4 py-12 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Was Nutzer sagen
            </h2>
            <div className="bg-accent mx-auto mb-4 h-1 w-16 sm:mb-6 sm:w-24" />
            <p className="text-muted-foreground mx-auto max-w-2xl px-2 text-base sm:text-lg">
              Echte Erfahrungen von Beta-Nutzern
            </p>
          </div>
        </AnimatedSection>

        {/* Pull-quote style testimonial placeholder */}
        <AnimatedSection delay={100} direction="up">
          <div className="relative mx-auto max-w-3xl px-2 text-center">
            {/* Oversized bronze quotation mark */}
            <div className="text-accent absolute -top-4 left-1/2 -translate-x-1/2 font-serif text-[80px] leading-none opacity-30 sm:-top-8 sm:text-[120px] lg:text-[160px]">
              "
            </div>

            {/* Quote text - Editorial Modernism style */}
            <blockquote className="relative pt-10 sm:pt-16">
              <p className="text-foreground mb-4 font-serif text-lg leading-relaxed italic sm:mb-8 sm:text-2xl lg:text-4xl">
                Coming Soon — Wir sammeln gerade Feedback von unseren ersten Beta-Nutzern.
              </p>

              {/* Author - small caps */}
              <footer className="text-muted-foreground text-xs font-medium tracking-wider uppercase sm:text-sm sm:tracking-widest">
                — TiMax Beta Team
              </footer>
            </blockquote>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

"use client";

import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { memo } from "react";

// Testimonials - Pull-quote style for Editorial Modernism
// Placeholder until real testimonials are collected

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="relative px-4 py-12 sm:py-20 lg:py-28 z-10 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground">
              Was Nutzer sagen
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-accent mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Echte Erfahrungen von Beta-Nutzern
            </p>
          </div>
        </AnimatedSection>

        {/* Pull-quote style testimonial placeholder */}
        <AnimatedSection delay={100} direction="up">
          <div className="relative max-w-3xl mx-auto text-center px-2">
            {/* Oversized bronze quotation mark */}
            <div className="font-serif text-[80px] sm:text-[120px] lg:text-[160px] text-accent leading-none opacity-30 absolute -top-4 sm:-top-8 left-1/2 -translate-x-1/2">
              "
            </div>
            
            {/* Quote text - Editorial Modernism style */}
            <blockquote className="relative pt-10 sm:pt-16">
              <p className="font-serif text-lg sm:text-2xl lg:text-4xl text-foreground leading-relaxed mb-4 sm:mb-8 italic">
                Coming Soon — Wir sammeln gerade Feedback von unseren ersten Beta-Nutzern.
              </p>
              
              {/* Author - small caps */}
              <footer className="text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest text-muted-foreground">
                — TiMax Beta Team
              </footer>
            </blockquote>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

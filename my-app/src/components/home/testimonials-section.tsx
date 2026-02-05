"use client";

import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { memo } from "react";

// Testimonials - Pull-quote style for Editorial Modernism
// Placeholder until real testimonials are collected

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="relative px-4 py-20 sm:py-24 lg:py-32 z-10 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <AnimatedSection direction="up">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-foreground">
              Was Nutzer sagen
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Echte Erfahrungen von Beta-Nutzern
            </p>
          </div>
        </AnimatedSection>

        {/* Pull-quote style testimonial placeholder */}
        <AnimatedSection delay={100} direction="up">
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Oversized bronze quotation mark */}
            <div className="font-serif text-[120px] lg:text-[160px] text-accent leading-none opacity-30 absolute -top-8 left-1/2 -translate-x-1/2">
              "
            </div>
            
            {/* Quote text - Editorial Modernism style */}
            <blockquote className="relative pt-16">
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8 italic">
                Coming Soon — Wir sammeln gerade Feedback von unseren ersten Beta-Nutzern.
              </p>
              
              {/* Author - small caps */}
              <footer className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                — TiMax Beta Team
              </footer>
            </blockquote>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

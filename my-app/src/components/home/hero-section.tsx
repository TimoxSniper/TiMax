"use client";

import { Hero } from "@/components/magic-ui/hero";
import { GlowEffect } from "@/components/magic-ui/glow-effect";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 overflow-hidden z-10">
      {/* Reduzierte Glow-Effekte - nur 1 statt 3 */}
      <GlowEffect 
        size="lg" 
        variant="subtle"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
      />
      
      {/* Mehrschichtige Gradient-Hintergründe für mehr Tiefe */}
      {/* Radialer Gradient in der Mitte */}
      <div className="absolute inset-0 bg-gradient-radial from-black/10 via-black/5 to-transparent dark:from-white/15 dark:via-white/5 pointer-events-none" />
      {/* Linearer Gradient von oben */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-transparent dark:from-white/10 dark:via-transparent pointer-events-none" />
      {/* Linearer Gradient von unten */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent dark:from-white/10 dark:via-transparent pointer-events-none" />
      {/* Diagonaler Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-white/5 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <Hero
          heading="Transformiere deine Videos und Audios in kraftvolle Texte"
          subheading="Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen."
        />
        
        <AnimatedSection delay={300} direction="up">
          <div className="mt-12 flex flex-col items-center gap-4">
            {/* Primary CTA - Klarer Fokus */}
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-105 rounded-full px-10 py-7 text-lg font-semibold shadow-xl focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2"
              asChild
            >
              <Link href="/text-generator">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {/* Secondary CTA - Weniger prominent */}
            <p className="text-sm text-black/60 dark:text-white/60 mb-2">
              oder
            </p>
            <Button 
              size="lg" 
              variant="ghost"
              className="group text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 rounded-full px-6 py-4 text-base font-medium"
              asChild
            >
              <Link href="/chat">
                <MessageSquare className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Direkt chatten
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}


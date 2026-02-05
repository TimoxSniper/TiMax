"use client";

import { Hero } from "@/components/magic-ui/hero";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] sm:min-h-[70vh] flex-col justify-center px-4 py-12 sm:py-16 lg:py-20 sm:px-6 lg:px-8 overflow-hidden z-10">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Centered hero layout */}
        <div className="w-full">
          <Hero
            heading="Transformiere deine Videos und Audios in kraftvolle Texte"
            subheading="Dein Podcast, dein Workshop, dein Wissen – verwandelt in LinkedIn-Posts, Newsletter und Blog-Artikel. In deinen Worten, authentisch und schnell."
            align="center"
          />
        </div>
        
        <AnimatedSection delay={200} direction="up">
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Primary CTA - Bronze, 56px height, NO scale */}
            <Button
              size="lg"
              variant="default"
              className="group min-h-12 sm:min-h-14 px-6 sm:px-8 w-full sm:w-auto"
              asChild
            >
              <Link href="/upload">
                Jetzt starten
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* Secondary CTA - Outline, NO scale */}
            <Button
              size="lg"
              variant="outline"
              className="group min-h-12 sm:min-h-14 px-6 sm:px-8 w-full sm:w-auto"
              asChild
            >
              <Link href="/chat">
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Direkt chatten
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

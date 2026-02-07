"use client";

import { Hero } from "@/components/magic-ui/hero";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-[60vh] flex-col justify-center overflow-hidden px-4 py-12 sm:min-h-[70vh] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Centered hero layout */}
        <div className="w-full">
          <Hero
            heading="Transformiere deine Videos und Audios in kraftvolle Texte"
            subheading="Ob Podcast, Vortrag oder Sprachmemo – dein Wissen verdient es, gelesen zu werden. Lade hoch, lass transkribieren, generiere fertige Texte."
            align="center"
          />
        </div>

        <AnimatedSection delay={200} direction="up">
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            {/* Primary CTA - Bronze, 56px height, NO scale */}
            <Button
              size="lg"
              variant="default"
              className="group min-h-12 w-full px-6 sm:min-h-14 sm:w-auto sm:px-8"
              asChild
            >
              <Link href="/upload">
                Jetzt starten
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            {/* Secondary CTA - Outline, NO scale */}
            <Button
              size="lg"
              variant="outline"
              className="group min-h-12 w-full px-6 sm:min-h-14 sm:w-auto sm:px-8"
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

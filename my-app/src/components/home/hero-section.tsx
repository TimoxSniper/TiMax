"use client";

import { Hero } from "@/components/magic-ui/hero";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 overflow-hidden z-10">
      <div className="container mx-auto max-w-4xl relative z-10">
        <Hero
          heading="Transformiere deine Videos und Audios in kraftvolle Texte"
          subheading="Vereine Upload, intelligente Strukturierung und KI-Dialog in einem nahtlosen Workflow – ohne zwischen Tools wechseln zu müssen."
        />
        
        <AnimatedSection delay={200} direction="up">
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA - Schwarz/Weiß wie vorher */}
            <Button 
              size="lg" 
              className="group bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 rounded-xl px-8 py-6 text-base font-medium shadow-lg focus:ring-2 focus:ring-foreground/20"
              asChild
            >
              <Link href="/text-generator">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            {/* Secondary CTA - Outline */}
            <Button 
              size="lg" 
              variant="outline"
              className="group border-2 border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5 hover:border-foreground/40 rounded-xl px-8 py-6 text-base font-medium"
              asChild
            >
              <Link href="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Direkt chatten
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

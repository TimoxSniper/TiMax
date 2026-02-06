"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

const FOOTER_LINKS = [
  { name: "Impressum", href: "/impressum" },
  { name: "Datenschutz", href: "/datenschutz" },
  { name: "AGB", href: "/agb" },
  { name: "Widerruf", href: "/widerruf" },
  { name: "Cookies", href: "/cookies" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-border py-8 sm:py-12 z-10 bg-background" role="contentinfo">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors"
              aria-label="TiMax Startseite"
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
              <span>timax</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Transformiere deine Videos und Audios in kraftvolle Texte.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-3 sm:gap-x-6 gap-y-2" aria-label="Footer Navigation">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors duration-300 font-medium uppercase tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {currentYear} TiMax. Alle Rechte vorbehalten.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground/60">
            Made with ❤️ for Content Creators
          </p>
        </div>
      </div>
    </footer>
  );
}

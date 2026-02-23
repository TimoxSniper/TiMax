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
    <footer
      className="border-border bg-background relative z-10 mt-auto border-t py-8 sm:py-12"
      role="contentinfo"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:items-start">
            <Link
              href="/"
              className="text-foreground hover:text-primary flex items-center gap-2 text-lg font-bold transition-colors sm:text-xl"
              aria-label="TiMax Startseite"
            >
              <Zap className="text-primary h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              <span>timax</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-center text-xs sm:text-sm md:text-left">
              Transformiere deine Videos und Audios in kraftvolle Texte.
            </p>
          </div>

          <nav
            className="flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-6"
            aria-label="Footer Navigation"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-accent text-xs font-medium tracking-wide uppercase transition-colors duration-300 sm:text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-border mt-6 flex flex-col items-center justify-center border-t pt-6 sm:mt-8 sm:pt-8">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {currentYear} TiMax. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}

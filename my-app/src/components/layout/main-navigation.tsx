"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/home/dark-mode-toggle";
import { Menu, X, Zap, MessageSquare, FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Text Generator", href: "/text-generator", icon: Zap },
  { name: "Chat", href: "/chat", icon: MessageSquare },
];

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Schließe Mobile Menu bei Click außerhalb
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
              aria-label="TiMax Startseite"
            >
              <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">timax</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className={cn(
                    "gap-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Right Side: Dark Mode + Mobile Menu */}
          <div className="flex items-center gap-2">
            <DarkModeToggle variant="inline" />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className={cn(
                      "justify-start gap-2 w-full",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


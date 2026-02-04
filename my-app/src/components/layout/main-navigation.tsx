"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/home/dark-mode-toggle";
import { Menu, X, Zap, MessageSquare, FileText, Home, LogIn, User, Sparkles, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const protectedNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Text Generator", href: "/text-generator", icon: FileText },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Uploads", href: "/uploads", icon: FileText },
];

const landingPageNavigation: Array<{
  name: string;
  href: string;
  icon: typeof Sparkles;
}> = [];

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
            {/* Landing Page Links (immer sichtbar auf Home, sonst optional) */}
            {landingPageNavigation.map((item) => {
              const Icon = item.icon;
              // Wir markieren diese Links nicht als active, da sie Anchor-Links sind
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className="gap-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}

            {/* Separator wenn eingeloggt */}
            <SignedIn>
              <div className="w-px h-6 bg-border mx-2" aria-hidden="true" />
              {protectedNavigation.map((item) => {
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
                    <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </SignedIn>
          </div>

          {/* Right Side: Auth + Dark Mode + Mobile Menu */}
          <div className="flex items-center gap-2">
            <DarkModeToggle variant="inline" />

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                  <LogIn className="h-4 w-4" />
                  Anmelden
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                {/* Landing Page Links für alle */}
                {landingPageNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      asChild
                      className="justify-start gap-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </Button>
                  );
                })}
                <div className="my-2 border-t border-border/50" />

                {/* Navigation nur für eingeloggte User */}
                <SignedIn>
                  {protectedNavigation.map((item) => {
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
                        <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </SignedIn>

                {/* Mobile Auth */}
                <div className="border-t pt-2 mt-2">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <LogIn className="h-4 w-4" />
                        Anmelden
                      </Button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center justify-between px-3 py-2 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Mein Konto</span>
                      </div>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

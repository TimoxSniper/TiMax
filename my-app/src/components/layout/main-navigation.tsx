"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/home/dark-mode-toggle";
import { Menu, X, Zap, MessageSquare, FileText, Home, LogIn, User, Sparkles, HelpCircle, Upload, FolderOpen, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const protectedNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Meine Dateien", href: "/uploads", icon: FolderOpen },
];

const landingPageNavigation: Array<{
  name: string;
  href: string;
  icon: typeof Sparkles;
}> = [
  { name: "Preise", href: "/pricing", icon: CreditCard },
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
    <header ref={navRef} className="sticky top-0 z-50 w-full border-b border-border bg-background transition-all duration-300">
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
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "gap-2 px-3 py-2 text-sm font-medium uppercase tracking-wide transition-all duration-300 relative group",
                      "text-foreground hover:text-accent",
                      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300",
                      isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"
                    )}
                  >
                    <Icon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    {item.name}
                  </Link>
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
                    // Avatar Styling
                    avatarBox: "w-9 h-9 border-2 border-border hover:border-accent transition-colors",
                    avatarImage: "rounded-full",
                    // Trigger Button
                    userButtonTrigger: "focus:shadow-none focus:ring-2 focus:ring-accent/30 rounded-full",
                    // Popover Card
                    userButtonPopoverCard: "bg-card border border-border rounded-[6px] shadow-editorial-lg mt-2",
                    userButtonPopoverActions: "border-t border-border",
                    userButtonPopoverActionButton: "text-foreground hover:bg-secondary rounded-none",
                    userButtonPopoverActionButtonText: "text-sm",
                    userButtonPopoverActionButtonIcon: "text-muted-foreground",
                    userButtonPopoverFooter: "hidden",
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
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden border-t border-border/50 overflow-hidden"
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
                    <div className="flex items-center justify-between px-3 py-3 bg-secondary/50 rounded-[6px] border border-border">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Mein Konto</span>
                      </div>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 border-2 border-border",
                            userButtonPopoverCard: "bg-card border border-border rounded-[6px] shadow-editorial-lg",
                            userButtonPopoverFooter: "hidden",
                          },
                        }}
                      />
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

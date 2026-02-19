"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/home/dark-mode-toggle";
import {
  Menu,
  X,
  Zap,
  MessageSquare,
  Home,
  LogIn,
  User,
  Upload,
  FolderOpen,
  CreditCard,
  Search,
  Shield,
} from "lucide-react";
import { SearchModal } from "@/components/search/search-modal";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileDevice } from "@/hooks/useMobileDevice";

const protectedNavigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Meine Dateien", href: "/uploads", icon: FolderOpen },
];

const adminNavigation = [{ name: "Admin Dashboard", href: "/admin", icon: Shield }];

const landingPageNavigation: Array<{
  name: string;
  href: string;
  icon: typeof CreditCard;
}> = [
  { name: "Preise", href: "/pricing", icon: CreditCard },
];

export function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const isMobileDevice = useMobileDevice();
  const { userId } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with usePathname
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      if (userId) {
        try {
          const response = await fetch("/api/auth/admin/check");
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.isAdmin);
          }
        } catch (error) {
          console.error("Failed to check admin status:", error);
        }
      }
    }
    checkAdmin();
  }, [userId]);

  // Schließe Mobile Menu bei Click außerhalb
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Schließe Menü wenn Gerättyp sich ändert (z.B. von Mobile zu Desktop)
  useEffect(() => {
    if (!isMobileDevice) {
      setMobileMenuOpen(false);
    }
  }, [isMobileDevice]);

  // Cmd/Ctrl+K für Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      ref={navRef}
      className="border-border bg-background sticky top-0 z-50 w-full border-b transition-all duration-300"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-foreground hover:text-primary flex items-center gap-2 text-xl font-bold transition-colors"
              aria-label="TiMax Startseite"
            >
              <Zap className="text-primary h-6 w-6" aria-hidden="true" />
              <span className="hidden sm:inline">timax</span>
            </Link>
          </div>

          {/* Desktop Navigation - nur wenn NICHT auf echtem Mobile */}
          <div className={cn("items-center gap-1", isMobileDevice ? "hidden" : "flex")}>
            {/* Landing Page Links nur für nicht angemeldete User */}
            <SignedOut>
              {landingPageNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.name} variant="ghost" asChild className="gap-2">
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </SignedOut>

            {/* Navigation für eingeloggte User */}
            <SignedIn>
              <div className="bg-border mx-2 h-6 w-px" aria-hidden="true" />
              {protectedNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = mounted && pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    suppressHydrationWarning
                    className={cn(
                      "group relative gap-2 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300",
                      "text-foreground hover:text-accent",
                      "after:bg-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300",
                      isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"
                    )}
                  >
                    <Icon className="mr-1 inline h-4 w-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin && (
                <>
                  <div className="bg-border mx-2 h-6 w-px" aria-hidden="true" />
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = mounted && pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        suppressHydrationWarning
                        className={cn(
                          "group relative gap-2 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300",
                          "text-primary hover:text-accent",
                          "after:bg-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300",
                          isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full"
                        )}
                      >
                        <Icon className="mr-1 inline h-4 w-4" aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </>
              )}
            </SignedIn>
          </div>

          {/* Right Side: Auth + Dark Mode + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Button - Only for signed in users */}
            <SignedIn>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex"
                title="Suchen (Cmd/Ctrl+K)"
              >
                <Search className="h-5 w-5" />
              </Button>
            </SignedIn>

            <DarkModeToggle variant="inline" />

            {/* Auth Buttons - nur auf Desktop (echte Geräte) */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-2", isMobileDevice ? "hidden" : "flex")}
                >
                  <LogIn className="h-4 w-4" />
                  Anmelden
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                userProfileUrl="/settings"
                appearance={{
                  elements: {
                    // Avatar Styling
                    avatarBox:
                      "w-9 h-9 border-2 border-border hover:border-accent transition-colors",
                    avatarImage: "rounded-full",
                    // Trigger Button
                    userButtonTrigger:
                      "focus:shadow-none focus:ring-2 focus:ring-accent/30 rounded-full",
                    // Popover Card
                    userButtonPopoverCard:
                      "bg-card border border-border rounded-[6px] shadow-editorial-lg mt-2",
                    userButtonPopoverActions: "border-t border-border",
                    userButtonPopoverActionButton:
                      "text-foreground hover:bg-secondary rounded-none",
                    userButtonPopoverActionButtonText: "text-sm",
                    userButtonPopoverActionButtonIcon: "text-muted-foreground",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button - nur auf echten mobilen Geräten */}
            {isMobileDevice && (
              <Button
                variant="ghost"
                size="icon"
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
            )}
          </div>
        </div>

        {/* Mobile Menu - nur auf echten mobilen Geräten */}
        <AnimatePresence>
          {isMobileDevice && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="border-border/50 overflow-hidden border-t"
            >
              <div className="flex flex-col gap-2 py-4">
                {/* Landing Page Links nur für nicht angemeldete User */}
                <SignedOut>
                  {landingPageNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        asChild
                        className="w-full justify-start gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                  <div className="border-border/50 my-2 border-t" />
                </SignedOut>

                {/* Navigation nur für eingeloggte User */}
                <SignedIn>
                  {protectedNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = mounted && pathname === item.href;
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "default" : "ghost"}
                        asChild
                        className={cn(
                          "w-full justify-start gap-2",
                          isActive && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={item.href} aria-current={isActive ? "page" : undefined} suppressHydrationWarning>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                  {isAdmin && (
                    <>
                      <div className="border-border/50 my-2 border-t" />
                      {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = mounted && pathname === item.href;
                        return (
                          <Button
                            key={item.name}
                            variant={isActive ? "default" : "ghost"}
                            asChild
                            className={cn(
                              "w-full justify-start gap-2",
                              isActive ? "bg-primary text-primary-foreground" : "text-primary"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href={item.href} aria-current={isActive ? "page" : undefined} suppressHydrationWarning>
                              <Icon className="h-4 w-4" aria-hidden="true" />
                              {item.name}
                            </Link>
                          </Button>
                        );
                      })}
                    </>
                  )}
                </SignedIn>

                {/* Search Button - Mobile */}
                <SignedIn>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setSearchOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Search className="h-4 w-4" />
                    Suchen
                  </Button>
                </SignedIn>

                {/* Mobile Auth */}
                <div className="mt-2 border-t pt-2">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <LogIn className="h-4 w-4" />
                        Anmelden
                      </Button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <div className="bg-secondary/50 border-border flex items-center justify-between rounded-[6px] border px-3 py-3">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <span className="text-foreground text-sm font-medium">Mein Konto</span>
                      </div>
                      <UserButton
                        afterSignOutUrl="/"
                        userProfileUrl="/settings"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 border-2 border-border",
                            userButtonPopoverCard:
                              "bg-card border border-border rounded-[6px] shadow-editorial-lg",
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

      {/* Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}

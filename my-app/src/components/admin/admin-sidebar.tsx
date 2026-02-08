"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileAudio,
  ArrowLeft,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-blue-500",
  },
  {
    title: "Benutzer",
    href: "/admin/users",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Chats",
    href: "/admin/chats",
    icon: MessageSquare,
    color: "text-green-500",
  },
  {
    title: "Uploads",
    href: "/admin/uploads",
    icon: FileAudio,
    color: "text-orange-500",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <header className="border-border bg-card fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Shield className="text-accent h-6 w-6" />
          <span className="font-serif text-xl font-bold">TiMax Admin</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          className="h-10 w-10"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "border-border bg-card fixed top-0 z-50 h-screen w-72 border-r transition-transform duration-300",
          "md:left-0 md:z-40 md:translate-x-0",
          isMobileMenuOpen ? "left-0 translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header - Desktop only */}
          <div className="border-border hidden h-16 items-center gap-3 border-b px-6 md:flex">
            <Shield className="text-accent h-8 w-8" />
            <span className="font-serif text-2xl font-bold">TiMax Admin</span>
          </div>

          {/* Navigation */}
          <nav className="mt-16 flex-1 space-y-2 p-6 md:mt-0">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? `${item.color} bg-muted/50`
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-border border-t p-6">
            <Link
              href="/chat"
              className="text-muted-foreground hover:bg-muted/30 hover:text-foreground flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              Zurück zur App
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

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
  Sparkles,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-accent",
    badge: "Live",
  },
  {
    title: "Benutzer",
    href: "/admin/users",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Chats",
    href: "/admin/chats",
    icon: MessageSquare,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Uploads",
    href: "/admin/uploads",
    icon: FileAudio,
    color: "text-green-600 dark:text-green-400",
  },
  {
    title: "Analytics",
    href: "/admin",
    icon: BarChart3,
    color: "text-orange-600 dark:text-orange-400",
    badge: "Neu",
  },
  {
    title: "Einstellungen",
    href: "/admin",
    icon: Settings,
    color: "text-slate-600 dark:text-slate-400",
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
      {/* Mobile Header - Editorial Modernism */}
      <header className="border-border bg-card fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b px-4 shadow-editorial-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 rounded-lg p-2">
            <Shield className="text-accent h-5 w-5" />
          </div>
          <div>
            <span className="block font-serif text-lg font-bold leading-tight">TiMax Admin</span>
            <span className="text-muted-foreground block text-xs">Dashboard</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          className="h-10 w-10 shadow-sm"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Editorial Modernism with accent line */}
      <aside
        className={cn(
          "border-border bg-card fixed top-0 z-50 h-screen w-72 border-r-2 shadow-editorial-lg transition-transform duration-300",
          "md:left-0 md:z-40 md:translate-x-0",
          isMobileMenuOpen ? "left-0 translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Accent line on left edge */}
        <div className="bg-accent absolute left-0 top-0 bottom-0 w-1" />

        <div className="flex h-full flex-col">
          {/* Header - Desktop only - Editorial Modernism */}
          <div className="border-border hidden h-20 items-center gap-3 border-b px-6 md:flex">
            <div className="bg-accent/10 rounded-lg p-2.5">
              <Shield className="text-accent h-7 w-7" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold leading-tight">TiMax Admin</span>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">
                Verwaltung
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-16 flex-1 space-y-1.5 p-4 md:mt-0">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? `${item.color} bg-accent/10 shadow-editorial-sm`
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && <div className="bg-accent absolute left-0 top-0 bottom-0 w-1 rounded-r" />}

                  <div
                    className={cn(
                      "rounded-md p-1.5 transition-colors",
                      isActive ? `${item.color} bg-accent/10` : "bg-muted/50 group-hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "h-5 px-2 text-[10px] font-semibold",
                        item.badge === "Live" && "gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                        item.badge === "Neu" && "gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                      )}
                    >
                      {item.badge === "Live" && <Sparkles className="h-2.5 w-2.5" />}
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer - Editorial Modernism */}
          <div className="border-border border-t p-4">
            <Link
              href="/chat"
              className="text-muted-foreground hover:bg-accent/5 hover:text-accent group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 hover:shadow-sm"
            >
              <div className="bg-muted group-hover:bg-accent/10 rounded-md p-1.5 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span>Zurück zur App</span>
            </Link>

            {/* Version info */}
            <div className="text-muted-foreground mt-4 px-4 text-xs">
              <div className="flex items-center justify-between">
                <span>Version 2.0</span>
                <Badge variant="outline" className="h-5 text-[10px]">
                  Beta
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

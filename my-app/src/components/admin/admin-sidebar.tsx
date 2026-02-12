"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, MessageSquare, Upload, X } from "lucide-react";

const adminNavigation = [
  { name: "Übersicht", href: "/admin", icon: LayoutDashboard },
  { name: "Benutzer", href: "/admin/users", icon: Users },
  { name: "Chats", href: "/admin/chats", icon: MessageSquare },
  { name: "Uploads", href: "/admin/uploads", icon: Upload },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch with usePathname
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Editorial Modernism Sidebar - Fixed width, warm background */}
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-40 w-64 border-r transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand - Crimson serif with bronze accent */}
          <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-6">
            <Link href="/admin" className="flex items-center">
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                TiMax
                <span className="text-primary ml-2 text-base">Admin</span>
              </h1>
            </Link>
            <Button variant="ghost" size="icon" onClick={onMobileClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Primary Navigation - Editorial Modernism style with bronze left border */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              // Improved active state logic to prevent false matches
              // For the dashboard, only match exact path
              const isActive = mounted && (
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              );

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  suppressHydrationWarning
                  className={cn(
                    "group flex items-center gap-3 border-l-4 px-4 py-3 font-sans text-sm font-medium transition-all",
                    isActive
                      ? "bg-accent/10 border-primary text-primary"
                      : "text-sidebar-foreground border-transparent hover:border-primary hover:bg-accent/5"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-sidebar-border border-t px-6 py-4">
            <Link href="/">
              <Button variant="outline" className="w-full font-sans text-sm">
                Zurück zur App
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
    </>
  );
}

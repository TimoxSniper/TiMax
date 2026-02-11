"use client";

/**
 * Editorial Modernism Admin Layout
 *
 * Features:
 * - Fixed sidebar with bronze accent navigation
 * - Responsive mobile menu
 * - Warm editorial backgrounds
 * - Dark mode support
 */

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar - Editorial Modernism design */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Header - Minimal, editorial style */}
        <header className="border-border bg-background sticky top-0 z-30 h-16 border-b">
          <div className="flex h-full items-center justify-between px-6">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Last updated timestamp */}
            <div className="text-uppercase-tracked ml-auto text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Main content with padding */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

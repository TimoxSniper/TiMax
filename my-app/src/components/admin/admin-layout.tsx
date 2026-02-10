"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col lg:ml-0">
        <header className="border-border bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
          <div className="container flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="ml-4 text-lg font-semibold lg:ml-0">Admin Dashboard</h1>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

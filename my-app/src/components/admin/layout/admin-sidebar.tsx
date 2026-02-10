/**
 * Admin Sidebar Component
 *
 * Collapsible sidebar navigation for admin dashboard
 * Editorial Modernism design with sharp shadows
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Chats",
    href: "/admin/chats",
    icon: MessageSquare,
  },
  {
    label: "Uploads",
    href: "/admin/uploads",
    icon: Upload,
  },
  {
    label: "System",
    href: "/admin/system",
    icon: Settings,
  },
] as const;

export interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-full bg-card border-r flex flex-col shadow-editorial-md transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
            <ShieldCheck className="h-6 w-6 text-accent flex-shrink-0" />
            {!collapsed && (
              <h1 className="font-serif text-xl font-bold">Admin</h1>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
              className="h-8 w-8 p-0 rounded-[4px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Collapse sidebar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <div className="p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(false)}
            className="h-8 w-full rounded-[4px]"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Expand sidebar</span>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 rounded-[6px] font-sans transition-all",
                  collapsed && "justify-center",
                  isActive && "shadow-editorial-sm"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 text-xs text-muted-foreground font-mono text-center">
        {!collapsed && <p>TiMax Admin v1.0</p>}
      </div>
    </aside>
  );
}

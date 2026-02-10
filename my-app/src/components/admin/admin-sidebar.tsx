"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, MessageSquare, Upload, Activity, X, Zap } from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Chats", href: "/admin/chats", icon: MessageSquare },
  { name: "Uploads", href: "/admin/uploads", icon: Upload },
  { name: "Health", href: "/admin/health", icon: Activity },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-40 w-64 border-r transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Zap className="text-primary h-6 w-6" />
              <span className="text-xl font-bold">TiMax Admin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onMobileClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-editorial-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-border border-t px-6 py-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Zurück zur App
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-30 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
    </>
  );
}

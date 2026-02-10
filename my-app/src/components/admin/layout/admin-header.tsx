/**
 * Admin Header Component
 *
 * Top header bar with breadcrumbs and user info
 */

"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { AdminMobileNav } from "./admin-mobile-nav";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: "/" + paths.slice(0, index + 1).join("/"),
    }));

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b bg-card shadow-editorial-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <AdminMobileNav />
        <nav className="flex items-center gap-2 text-sm font-sans">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 rounded-[6px]",
            },
          }}
        />
      </div>
    </header>
  );
}

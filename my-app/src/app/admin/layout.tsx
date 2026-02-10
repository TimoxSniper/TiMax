/**
 * Admin Dashboard Layout
 *
 * Server Component with admin auth protection
 * Hybrid layout: Collapsible sidebar + main content area
 */

import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";

export const metadata = {
  title: "Admin Dashboard - TiMax",
  description: "TiMax Admin Dashboard für Content-Moderation und Benutzerverwaltung",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check admin authorization
  const authResult = await checkAdminAuth();

  if (!authResult.authorized) {
    // Redirect to unauthorized page
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

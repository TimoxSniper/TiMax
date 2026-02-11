"use client";

/**
 * EDITORIAL MODERNISM - Admin Dashboard Layout Demo
 *
 * This component demonstrates the design system for the admin dashboard.
 * It showcases:
 * - Typography hierarchy (Crimson headlines, DM Sans body)
 * - Bronze accent usage (#9A6F4F)
 * - Brutalist shadow system
 * - Warm editorial backgrounds
 * - Responsive sidebar navigation
 * - Card-based stats overview
 *
 * Use this as a reference when building actual admin pages.
 */

import { useState } from "react";
import {
  Users,
  MessageSquare,
  Upload,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Settings,
  FileText,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

export function AdminLayoutDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo/Brand */}
        <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            TiMax
            <span className="text-primary ml-2 text-base">Admin</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {/* Active item */}
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-primary bg-accent/10 transition-all"
          >
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-sans text-sm font-medium text-primary">
              Dashboard
            </span>
          </a>

          {/* Other items */}
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
          >
            <Users className="w-5 h-5 text-sidebar-foreground" />
            <span className="font-sans text-sm font-medium text-sidebar-foreground">
              Users
            </span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
          >
            <MessageSquare className="w-5 h-5 text-sidebar-foreground" />
            <span className="font-sans text-sm font-medium text-sidebar-foreground">
              Chats
            </span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
          >
            <Upload className="w-5 h-5 text-sidebar-foreground" />
            <span className="font-sans text-sm font-medium text-sidebar-foreground">
              Uploads
            </span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
          >
            <BarChart3 className="w-5 h-5 text-sidebar-foreground" />
            <span className="font-sans text-sm font-medium text-sidebar-foreground">
              Analytics
            </span>
          </a>

          {/* Divider */}
          <div className="h-px bg-border my-4" />

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:border-primary hover:bg-accent/5 transition-all"
          >
            <Settings className="w-5 h-5 text-sidebar-foreground" />
            <span className="font-sans text-sm font-medium text-sidebar-foreground">
              Settings
            </span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-accent/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-uppercase-tracked text-xs text-muted-foreground">
                Last updated: 2 minutes ago
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-2">
              Dashboard Overview
            </h1>
            <p className="text-base text-muted-foreground">
              Monitor platform activity and user metrics in real-time
            </p>
          </div>

          {/* Stats Grid - Card-based layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-card border border-border shadow-editorial-md hover:shadow-editorial-lift transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-uppercase-tracked text-xs text-muted-foreground">
                    Total Users
                  </p>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                  1,234
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    +12.5%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="h-1 bg-primary/20" />
            </div>

            {/* Stat Card 2 */}
            <div className="bg-card border border-border shadow-editorial-md hover:shadow-editorial-lift transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-uppercase-tracked text-xs text-muted-foreground">
                    Total Chats
                  </p>
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                  5,678
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">+8.2%</span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="h-1 bg-primary/20" />
            </div>

            {/* Stat Card 3 */}
            <div className="bg-card border border-border shadow-editorial-md hover:shadow-editorial-lift transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-uppercase-tracked text-xs text-muted-foreground">
                    Total Uploads
                  </p>
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                  892
                </p>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    -3.1%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="h-1 bg-primary/20" />
            </div>

            {/* Stat Card 4 */}
            <div className="bg-card border border-border shadow-editorial-md hover:shadow-editorial-lift transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-uppercase-tracked text-xs text-muted-foreground">
                    Active Sessions
                  </p>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                  342
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    +15.7%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="h-1 bg-primary/20" />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-card border border-border shadow-editorial-md">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Recent Activity
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-uppercase-tracked text-xs text-left py-3 px-6 font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="text-uppercase-tracked text-xs text-left py-3 px-6 font-medium text-muted-foreground">
                      Action
                    </th>
                    <th className="text-uppercase-tracked text-xs text-left py-3 px-6 font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="text-uppercase-tracked text-xs text-left py-3 px-6 font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                    <td className="py-4 px-6 font-sans text-sm">
                      john.doe@example.com
                    </td>
                    <td className="py-4 px-6 font-sans text-sm">
                      Uploaded file
                    </td>
                    <td className="py-4 px-6 font-sans text-sm text-muted-foreground">
                      2 minutes ago
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                    <td className="py-4 px-6 font-sans text-sm">
                      jane.smith@example.com
                    </td>
                    <td className="py-4 px-6 font-sans text-sm">
                      Started chat session
                    </td>
                    <td className="py-4 px-6 font-sans text-sm text-muted-foreground">
                      5 minutes ago
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                    <td className="py-4 px-6 font-sans text-sm">
                      bob.wilson@example.com
                    </td>
                    <td className="py-4 px-6 font-sans text-sm">
                      Uploaded file
                    </td>
                    <td className="py-4 px-6 font-sans text-sm text-muted-foreground">
                      12 minutes ago
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground border border-border">
                        Processing
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

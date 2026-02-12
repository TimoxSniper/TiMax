"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Users,
  MessageSquare,
  Upload,
  Activity,
  FileText,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline";
}

export function QuickActions() {
  const handleRefreshCache = async () => {
    // Implement cache refresh logic
    console.log("Refreshing cache...");
    // You could call an API endpoint here
  };

  const actions: QuickAction[] = [
    {
      title: "Benutzer verwalten",
      description: "Alle Benutzer anzeigen",
      icon: Users,
      href: "/admin/users",
      variant: "outline",
    },
    {
      title: "Chats überprüfen",
      description: "Chat-Verlauf einsehen",
      icon: MessageSquare,
      href: "/admin/chats",
      variant: "outline",
    },
    {
      title: "Uploads anzeigen",
      description: "Alle Datei-Uploads",
      icon: Upload,
      href: "/admin/uploads",
      variant: "outline",
    },
    {
      title: "System-Status",
      description: "Health Check anzeigen",
      icon: Activity,
      href: "/admin/health",
      variant: "outline",
    },
    {
      title: "Statistiken",
      description: "Dashboard-Übersicht",
      icon: BarChart3,
      href: "/admin",
      variant: "outline",
    },
    {
      title: "Cache leeren",
      description: "System-Cache zurücksetzen",
      icon: RefreshCw,
      onClick: handleRefreshCache,
      variant: "outline",
    },
  ];

  return (
    <Card className="shadow-editorial-md border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-3 font-serif text-2xl font-semibold">
          <Zap className="h-6 w-6 text-primary" />
          Schnellzugriff
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const content = (
              <div className="flex items-start gap-3 text-left">
                <div className="rounded-lg border border-border bg-accent/10 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            );

            if (action.href) {
              return (
                <Link key={action.title} href={action.href} className="block">
                  <Button
                    variant={action.variant || "outline"}
                    className="h-auto w-full justify-start p-3 transition-all hover:shadow-editorial-sm cursor-pointer"
                  >
                    {content}
                  </Button>
                </Link>
              );
            }

            return (
              <Button
                key={action.title}
                variant={action.variant || "outline"}
                className="h-auto w-full justify-start p-3 transition-all hover:shadow-editorial-sm cursor-pointer"
                onClick={action.onClick}
              >
                {content}
              </Button>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-lg border border-border bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Logs anzeigen</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                System-Logs und Fehlerprotokolle sind in der Entwicklungsumgebung
                verfügbar. Für Produktions-Logs siehe Sentry Dashboard.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

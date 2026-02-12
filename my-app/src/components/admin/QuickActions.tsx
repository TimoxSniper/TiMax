"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

            if (action.href) {
              return (
                <Link key={action.title} href={action.href}>
                  <div className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-all hover:shadow-editorial-sm hover:border-primary/50">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="rounded-lg border border-border bg-accent/10 p-3 group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={action.title}
                onClick={action.onClick}
                className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-all hover:shadow-editorial-sm hover:border-primary/50"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="rounded-lg border border-border bg-accent/10 p-3 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-lg border border-border bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border border-border bg-card p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">Logs anzeigen</h4>
              <p className="text-xs text-muted-foreground">
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

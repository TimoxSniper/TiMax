"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, FileAudio, Download, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function QuickActions() {
  const actions = [
    {
      title: "Benutzer verwalten",
      description: "Alle Nutzer ansehen",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50",
    },
    {
      title: "Chats verwalten",
      description: "Chat-Aktivitäten",
      icon: MessageSquare,
      href: "/admin/chats",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50",
    },
    {
      title: "Uploads verwalten",
      description: "Upload-Verwaltung",
      icon: FileAudio,
      href: "/admin/uploads",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50",
    },
    {
      title: "Daten exportieren",
      description: "CSV/JSON Export",
      icon: Download,
      href: "/admin/users",
      color: "text-accent",
      bg: "bg-accent/10 hover:bg-accent/20",
    },
    {
      title: "Berichte",
      description: "Analytics & Reports",
      icon: BarChart3,
      href: "/admin",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50",
    },
    {
      title: "Einstellungen",
      description: "System-Konfiguration",
      icon: Settings,
      href: "/admin",
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/50",
    },
  ];

  return (
    <Card className="shadow-editorial-md">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-2xl">Schnellzugriff</CardTitle>
        <CardDescription>Häufig verwendete Aktionen und Verwaltungsoptionen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className={`h-auto w-full flex-col items-start gap-3 p-4 ${action.bg} border-2 shadow-sm transition-all hover:shadow-editorial-sm`}
                >
                  <action.icon className={`${action.color} h-6 w-6`} />
                  <div className="space-y-1 text-left">
                    <div className="text-sm font-semibold leading-tight">{action.title}</div>
                    <div className="text-muted-foreground text-xs leading-tight">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

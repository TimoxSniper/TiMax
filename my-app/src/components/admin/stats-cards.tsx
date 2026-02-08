"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  FileAudio,
  MessagesSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalChats: number;
    totalMessages: number;
    totalUploads: number;
    uploadsByStatus: Record<string, number>;
    uploadsByType: Record<string, number>;
  } | null;
  isLoading: boolean;
  growth?: {
    users: number;
    chats: number;
    uploads: number;
  };
}

export function StatsCards({ stats, isLoading, growth }: StatsCardsProps) {
  const router = useRouter();

  const getTrendIcon = (value: number) => {
    if (value > 0) return TrendingUp;
    if (value < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-emerald-600 dark:text-emerald-400";
    if (value < 0) return "text-rose-600 dark:text-rose-400";
    return "text-muted-foreground";
  };

  const getTrendBg = (value: number) => {
    if (value > 0) return "bg-emerald-50 dark:bg-emerald-950/30";
    if (value < 0) return "bg-rose-50 dark:bg-rose-950/30";
    return "bg-muted";
  };

  const cards = [
    {
      title: "Benutzer",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registrierte Nutzer",
      href: "/admin/users",
      trend: growth?.users || 0,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200/50 dark:border-blue-800/50",
      accentLine: "border-l-4 border-l-blue-500",
    },
    {
      title: "Chats",
      value: stats?.totalChats ?? 0,
      icon: MessageSquare,
      description: "Erstellte Chats",
      href: "/admin/chats",
      trend: growth?.chats || 0,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200/50 dark:border-purple-800/50",
      accentLine: "border-l-4 border-l-purple-500",
    },
    {
      title: "Nachrichten",
      value: stats?.totalMessages ?? 0,
      icon: MessagesSquare,
      description: "Gesendete Nachrichten",
      href: "/admin/chats",
      trend: 15.3,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
      accentLine: "border-l-4 border-l-accent",
    },
    {
      title: "Uploads",
      value: stats?.totalUploads ?? 0,
      icon: FileAudio,
      description: `${stats?.uploadsByStatus?.completed ?? 0} abgeschlossen`,
      href: "/admin/uploads",
      trend: growth?.uploads || 0,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200/50 dark:border-green-800/50",
      accentLine: "border-l-4 border-l-green-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-2 shadow-editorial-md">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Skeleton className="mb-2 h-10 w-24" />
              <Skeleton className="mb-3 h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence>
        {cards.map((card, index) => {
          const TrendIcon = getTrendIcon(card.trend);
          const trendColor = getTrendColor(card.trend);
          const trendBg = getTrendBg(card.trend);

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={`group relative cursor-pointer border-2 ${card.border} ${card.accentLine} shadow-editorial-md transition-all duration-300 hover:shadow-editorial-lg`}
                onClick={() => router.push(card.href)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                      {card.title}
                    </CardTitle>
                  </div>
                  <div className={`${card.bg} rounded-lg p-2.5 transition-transform group-hover:scale-110`}>
                    <card.icon className={`${card.color} h-5 w-5`} />
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl font-bold">
                        {card.value.toLocaleString("de-DE")}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{card.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <Badge
                        variant="secondary"
                        className={`${trendBg} ${trendColor} gap-1.5 border-0 px-2.5 py-1 text-xs font-semibold`}
                      >
                        <TrendIcon className="h-3.5 w-3.5" />
                        <span>{Math.abs(card.trend).toFixed(1)}%</span>
                      </Badge>
                      <span className="text-muted-foreground text-xs">vs. letzte Woche</span>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay - Editorial Modernism */}
                <div className="bg-accent/5 absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

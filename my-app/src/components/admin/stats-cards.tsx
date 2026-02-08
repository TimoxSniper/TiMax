"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, FileAudio, MessagesSquare, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const router = useRouter();

  const cards = [
    {
      title: "Benutzer",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registrierte Nutzer",
      href: "/admin/users",
      trend: "+12%",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Chats",
      value: stats?.totalChats ?? 0,
      icon: MessageSquare,
      description: "Erstellte Chats",
      href: "/admin/chats",
      trend: "+8%",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Nachrichten",
      value: stats?.totalMessages ?? 0,
      icon: MessagesSquare,
      description: "Gesendete Nachrichten",
      href: "/admin/chats",
      trend: "+15%",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Uploads",
      value: stats?.totalUploads ?? 0,
      icon: FileAudio,
      description: `${stats?.uploadsByStatus?.completed ?? 0} abgeschlossen`,
      href: "/admin/uploads",
      trend: `${stats?.uploadsByType?.audio || 0} Audio`,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-muted/20 border-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6" />
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card
              className={`border-2 ${card.border} cursor-pointer bg-white shadow-lg transition-all duration-300 hover:shadow-xl`}
              onClick={() => router.push(card.href)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-3">
                <CardTitle className={`text-sm font-semibold ${card.color}`}>
                  {card.title}
                </CardTitle>
                <div className={`${card.bg} rounded-lg p-2`}>
                  <card.icon className={`${card.color} h-6 w-6`} />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="mb-2 font-serif text-4xl font-bold">
                  {card.value.toLocaleString("de-DE")}
                </div>
                <p className="text-muted-foreground mb-3 text-sm">{card.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{card.trend}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

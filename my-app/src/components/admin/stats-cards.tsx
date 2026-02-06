"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, FileAudio, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalChats: number;
    totalMessages: number;
    totalUploads: number;
    uploadsByStatus: Record<string, number>;
  } | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Benutzer",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registrierte Nutzer",
    },
    {
      title: "Chats",
      value: stats?.totalChats ?? 0,
      icon: MessageSquare,
      description: "Erstellte Chats",
    },
    {
      title: "Nachrichten",
      value: stats?.totalMessages ?? 0,
      icon: MessagesSquare,
      description: "Gesendete Nachrichten",
    },
    {
      title: "Uploads",
      value: stats?.totalUploads ?? 0,
      icon: FileAudio,
      description: `${stats?.uploadsByStatus?.completed ?? 0} abgeschlossen`,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:translate-y-0 hover:shadow-editorial-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
              <Skeleton className="h-3 w-16 md:h-4 md:w-24" />
              <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <Skeleton className="h-7 w-12 mb-1 md:h-8 md:w-16" />
              <Skeleton className="h-3 w-24 md:w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:translate-y-0 hover:shadow-editorial-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="text-2xl md:text-3xl font-bold font-serif">{card.value.toLocaleString("de-DE")}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

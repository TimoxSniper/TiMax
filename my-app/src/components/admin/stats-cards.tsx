"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, FileAudio, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const cards = [
    {
      title: "Benutzer",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registrierte Nutzer",
      href: "/admin/users",
    },
    {
      title: "Chats",
      value: stats?.totalChats ?? 0,
      icon: MessageSquare,
      description: "Erstellte Chats",
      href: "/admin/chats",
    },
    {
      title: "Nachrichten",
      value: stats?.totalMessages ?? 0,
      icon: MessagesSquare,
      description: "Gesendete Nachrichten",
      href: "/admin/chats",
    },
    {
      title: "Uploads",
      value: stats?.totalUploads ?? 0,
      icon: FileAudio,
      description: `${stats?.uploadsByStatus?.completed ?? 0} abgeschlossen`,
      href: "/admin/uploads",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:shadow-editorial-md hover:translate-y-0">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 md:p-6">
              <Skeleton className="h-3 w-16 md:h-4 md:w-24" />
              <Skeleton className="h-4 w-4 md:h-5 md:w-5" />
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <Skeleton className="mb-1 h-7 w-12 md:h-8 md:w-16" />
              <Skeleton className="h-3 w-24 md:w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="hover:shadow-editorial-md cursor-pointer transition-all hover:translate-y-0"
          onClick={() => router.push(card.href)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 md:p-6">
            <CardTitle className="text-muted-foreground text-xs font-medium md:text-sm">
              {card.title}
            </CardTitle>
            <card.icon className="text-accent h-4 w-4 md:h-5 md:w-5" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="font-serif text-2xl font-bold md:text-3xl">
              {card.value.toLocaleString("de-DE")}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

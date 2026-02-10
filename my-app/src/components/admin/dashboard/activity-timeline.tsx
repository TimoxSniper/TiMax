/**
 * Activity Timeline Component
 *
 * Displays recent system activity
 */

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime, getInitials } from "@/lib/admin/utils";
import type { RecentActivity } from "@/types/admin";

export interface ActivityTimelineProps {
  activities: RecentActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card className="p-8 text-center shadow-editorial-md">
        <p className="text-muted-foreground font-sans text-sm">
          Keine aktuellen Aktivitäten
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-editorial-md">
      <h3 className="font-serif text-lg font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Avatar */}
            {activity.user && (
              <Avatar className="h-8 w-8 rounded-[6px]">
                <AvatarImage src={activity.user.imageUrl} alt={activity.user.fullName} />
                <AvatarFallback className="rounded-[6px] text-xs bg-accent/10 text-accent">
                  {getInitials(activity.user.fullName)}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans">{activity.description}</p>
              <p className="text-xs text-muted-foreground font-sans mt-1">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

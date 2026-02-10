/**
 * Feature Flags Panel Component
 *
 * Displays current feature flags (read-only)
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { FEATURE_FLAGS } from "@/lib/admin/constants";

export function FeatureFlagsPanel() {
  const flags = [
    {
      name: "User Banning",
      key: "enableUserBanning",
      enabled: FEATURE_FLAGS.enableUserBanning,
      description: "Allow admins to ban and unban users",
    },
    {
      name: "Content Moderation",
      key: "enableContentModeration",
      enabled: FEATURE_FLAGS.enableContentModeration,
      description: "Enable chat and upload moderation features",
    },
    {
      name: "Analytics",
      key: "enableAnalytics",
      enabled: FEATURE_FLAGS.enableAnalytics,
      description: "Show analytics and usage statistics",
    },
    {
      name: "Data Export",
      key: "enableExport",
      enabled: FEATURE_FLAGS.enableExport,
      description: "Allow exporting data to CSV/JSON",
    },
    {
      name: "Real-time Updates",
      key: "enableRealTimeUpdates",
      enabled: FEATURE_FLAGS.enableRealTimeUpdates,
      description: "Enable real-time updates for processing uploads",
    },
  ];

  return (
    <Card className="p-6 shadow-editorial-md">
      <div className="mb-6">
        <h3 className="font-serif text-xl font-bold mb-2">Feature Flags</h3>
        <p className="text-sm text-muted-foreground">
          Current feature flag configuration (read-only)
        </p>
      </div>

      <div className="space-y-4">
        {flags.map((flag) => (
          <div
            key={flag.key}
            className="flex items-center justify-between p-4 rounded-[6px] bg-muted/30 border border-border"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold">{flag.name}</h4>
                <Badge
                  variant={flag.enabled ? "default" : "secondary"}
                  className="rounded-[4px]"
                >
                  {flag.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{flag.description}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {flag.key}
              </p>
            </div>
            <div className="ml-4">
              {flag.enabled ? (
                <CheckCircle2 className="h-8 w-8 text-accent" />
              ) : (
                <XCircle className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-[6px] bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Note:</strong> Feature flags are configured via environment variables. To change these settings, update your <code className="font-mono text-xs">.env.local</code> file and restart the server.
        </p>
      </div>
    </Card>
  );
}

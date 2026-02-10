/**
 * Admin System Page
 *
 * System management with tabs: Health, Logs, Feature Flags
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthMonitor } from "@/components/admin/system/health-monitor";
import { ErrorLogsTable } from "@/components/admin/system/error-logs-table";
import { FeatureFlagsPanel } from "@/components/admin/system/feature-flags-panel";

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">System Management</h1>
        <p className="text-muted-foreground font-sans">
          Überwache Systemzustand, Logs und Feature Flags
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="health">
        <TabsList className="rounded-[6px]">
          <TabsTrigger value="health" className="rounded-[4px]">
            Health Monitor
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-[4px]">
            Admin Logs
          </TabsTrigger>
          <TabsTrigger value="flags" className="rounded-[4px]">
            Feature Flags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <HealthMonitor />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <ErrorLogsTable />
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          <FeatureFlagsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

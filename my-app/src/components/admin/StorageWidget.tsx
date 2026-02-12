"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Upload,
  MessageSquare,
  Database,
} from "lucide-react";
import { formatBytes } from "@/lib/date-utils";

interface StorageData {
  totalBytes: number;
  usedBytes: number;
  availableBytes: number;
  percentageUsed: number;
  breakdown: {
    uploads: number;
    database: number;
    other: number;
  };
}

export function StorageWidget() {
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorage();
    const interval = setInterval(loadStorage, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadStorage = async () => {
    try {
      const response = await fetch("/api/admin/storage");
      const result = await response.json();

      if (result.success) {
        setStorage(result.storage);
      }
    } catch (error) {
      console.error("Failed to load storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-editorial-md border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!storage) {
    return null;
  }

  const isWarning = storage.percentageUsed >= 80;
  const isCritical = storage.percentageUsed >= 90;

  return (
    <Card className="shadow-editorial-md border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 font-serif text-2xl font-semibold">
            <HardDrive className="h-6 w-6 text-primary" />
            Speicherplatz
          </CardTitle>
          {isCritical ? (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Kritisch
            </Badge>
          ) : isWarning ? (
            <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
              <AlertTriangle className="h-3 w-3" />
              Warnung
            </Badge>
          ) : (
            <Badge variant="default" className="gap-1 bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3" />
              OK
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Overall Usage */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <p className="font-serif text-3xl font-bold text-foreground">
                  {formatBytes(storage.usedBytes)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  von {formatBytes(storage.totalBytes)} genutzt
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-3xl font-bold text-primary">
                  {storage.percentageUsed}%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatBytes(storage.availableBytes)} verfügbar
                </p>
              </div>
            </div>

            {/* Progress Bar with Editorial Bronze Accent */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all duration-500 ${
                  isCritical
                    ? "bg-destructive"
                    : isWarning
                    ? "bg-yellow-500"
                    : "bg-primary"
                }`}
                style={{ width: `${storage.percentageUsed}%` }}
              />
            </div>
          </div>

          {/* Storage Breakdown */}
          <div className="space-y-3 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Speicher-Aufteilung
            </h4>

            {/* Uploads */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-border p-2 bg-accent/10">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Uploads</span>
              </div>
              <span className="font-medium text-sm">
                {formatBytes(storage.breakdown.uploads)}
              </span>
            </div>

            {/* Database */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-border p-2 bg-accent/10">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Datenbank</span>
              </div>
              <span className="font-medium text-sm">
                {formatBytes(storage.breakdown.database)}
              </span>
            </div>

            {/* Other */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-border p-2 bg-accent/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Sonstiges</span>
              </div>
              <span className="font-medium text-sm">
                {formatBytes(storage.breakdown.other)}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          {isWarning && (
            <div className={`rounded-lg border p-3 ${
              isCritical
                ? "border-destructive/50 bg-destructive/10"
                : "border-yellow-200 bg-yellow-50"
            }`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                  isCritical ? "text-destructive" : "text-yellow-600"
                }`} />
                <p className="text-sm">
                  {isCritical
                    ? "Kritischer Speicherstand! Bitte Dateien löschen oder Speicher erweitern."
                    : "Speicher zu 80% belegt. Bitte baldmöglichst aufräumen."}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

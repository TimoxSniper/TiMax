"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface TranscriptViewerProps {
  transcript: string;
  wordCount?: number;
}

export function TranscriptViewer({ transcript, wordCount }: TranscriptViewerProps) {
  const calculatedWordCount = wordCount || transcript.split(/\s+/).filter(Boolean).length;

  return (
    <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-secondary text-accent flex size-8 items-center justify-center rounded-[4px]">
                <FileText className="size-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Original-Transkript</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Beispiel-Content zur Demonstration der Text-Generierung
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="shrink-0 font-mono tabular-nums"
            aria-label={`${calculatedWordCount} Wörter im Transkript`}
          >
            {calculatedWordCount} Wörter
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div
          className="bg-muted/30 focus-within:ring-ring max-h-[600px] space-y-4 overflow-y-auto rounded-lg border p-4 transition-all focus-within:ring-2 focus-within:ring-offset-2 sm:p-6"
          role="region"
          aria-label="Transkript-Inhalt"
          tabIndex={0}
        >
          {transcript.trim() ? (
            transcript
              .split("\n\n")
              .filter((p) => p.trim())
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/90 text-sm leading-relaxed last:mb-0 sm:text-base"
                >
                  {paragraph}
                </p>
              ))
          ) : (
            <div className="text-muted-foreground flex h-full min-h-[200px] flex-col items-center justify-center text-center">
              <FileText className="mb-4 size-12 opacity-40" aria-hidden="true" />
              <p className="text-foreground mb-2 text-sm font-medium">Noch kein Transkript</p>
              <p className="max-w-xs text-xs">
                Laden Sie eine Audio- oder Videodatei hoch, um das Transkript zu sehen.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

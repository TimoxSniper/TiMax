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
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
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
          className="max-h-[600px] overflow-y-auto rounded-lg border bg-muted/30 p-4 sm:p-6 space-y-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all"
          role="region"
          aria-label="Transkript-Inhalt"
          tabIndex={0}
        >
          {transcript.trim() ? (
            transcript.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
              <p 
                key={index} 
                className="text-sm sm:text-base leading-relaxed text-foreground/90 last:mb-0"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-muted-foreground">
              <FileText className="size-12 opacity-40 mb-4" aria-hidden="true" />
              <p className="text-sm font-medium mb-2 text-foreground">Noch kein Transkript</p>
              <p className="text-xs max-w-xs">
                Laden Sie eine Audio- oder Videodatei hoch, um das Transkript zu sehen.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


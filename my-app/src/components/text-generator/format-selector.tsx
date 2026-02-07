"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatOptions, type FormatType } from "@/lib/text-templates";
import { FileText, MessageSquare, PenTool, Hash, Sparkles } from "lucide-react";

interface FormatSelectorProps {
  selectedFormat: FormatType | null;
  onSelectFormat: (format: FormatType) => void;
  disabled?: boolean;
}

const formatIcons: Record<FormatType, React.ReactNode> = {
  instagram: <Hash className="size-4" aria-hidden="true" />,
  twitter: <MessageSquare className="size-4" aria-hidden="true" />,
  blog: <FileText className="size-4" aria-hidden="true" />,
  caption: <PenTool className="size-4" aria-hidden="true" />,
};

export function FormatSelector({
  selectedFormat,
  onSelectFormat,
  disabled = false,
}: FormatSelectorProps) {
  return (
    <Card id="format-selector" className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-secondary text-accent flex size-8 items-center justify-center rounded-[4px]">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl">Format wählen</CardTitle>
            <CardDescription className="mt-1 text-sm">
              Wähle ein Format für deinen generierten Content
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="group"
          aria-label="Content-Format-Optionen"
        >
          {formatOptions.map((format) => {
            const isSelected = selectedFormat === format.id;
            return (
              <Button
                key={format.id}
                variant={isSelected ? "default" : "outline"}
                disabled={disabled}
                className={`h-auto flex-col items-start gap-2 p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? "ring-accent/25 border-l-accent border-l-4 ring-2"
                    : "hover:border-l-accent/50 border-l-4 border-l-transparent"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => onSelectFormat(format.id)}
                aria-pressed={isSelected}
                aria-disabled={disabled}
                aria-label={`${format.label} Format wählen: ${format.description}`}
              >
                <div className="flex w-full items-center gap-2">
                  <div className={isSelected ? "text-primary-foreground" : "text-accent"}>
                    {formatIcons[format.id]}
                  </div>
                  <span className="text-sm font-semibold sm:text-base">{format.label}</span>
                  {isSelected && (
                    <span className="ml-auto text-xs font-medium opacity-80">Aktiv</span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs leading-relaxed font-normal tracking-normal whitespace-normal normal-case">
                  {format.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

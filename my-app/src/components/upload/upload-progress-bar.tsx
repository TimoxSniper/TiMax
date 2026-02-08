import { cn } from "@/lib/utils";

interface UploadProgressBarProps {
  progress: number; // Value between 0 and 100
  fileName?: string;
  status?: "uploading" | "processing" | "completed" | "failed";
  className?: string;
}

export function UploadProgressBar({ 
  progress, 
  fileName, 
  status = "uploading", 
  className 
}: UploadProgressBarProps) {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-destructive";
      case "processing":
        return "bg-blue-500";
      default:
        return "bg-primary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Abgeschlossen";
      case "failed":
        return "Fehlgeschlagen";
      case "processing":
        return "Wird verarbeitet...";
      default:
        return "Wird hochgeladen...";
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {fileName && (
        <div className="flex justify-between text-sm">
          <span className="truncate font-medium">{fileName}</span>
          <span className="ml-2 w-10 text-right tabular-nums">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="bg-secondary relative h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            getStatusColor(),
            status === "processing" && "animate-pulse"
          )}
          style={{ width: `${progress}%` }}
        />
        {!fileName && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground">
            {getStatusText()} {Math.round(progress)}%
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs">{getStatusText()}</p>
    </div>
  );
}
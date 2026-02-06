"use client";

import { useState, useRef, useEffect, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { TIMEOUTS, UPLOAD_CONFIG } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { ProcessingStatus } from "./processing-status";

const MAX_FILE_SIZE = UPLOAD_CONFIG.MAX_FILE_SIZE;
const ALLOWED_TYPES: string[] = [...UPLOAD_CONFIG.ALLOWED_TYPES];

interface FileUploadProps {
  onUploadSuccess?: (fileName: string, transcript?: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Datei ist zu groß. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Dateityp nicht unterstützt. Erlaubt: MP3, MP4, WAV, M4A, WebM";
    }
    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      onUploadError?.(validationError);
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // CSRF-Token holen
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      const formData = new FormData();
      formData.append("file", file);

      // Verwende XMLHttpRequest für echten Upload-Progress
      const xhr = new XMLHttpRequest();

      // Progress-Tracking
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
        }
      });

      // Promise für async/await
      const uploadPromise = new Promise<{ success: boolean; fileName?: string; transcript?: string; error?: string }>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                resolve({
                  success: true,
                  fileName: data.fileName || file.name,
                  transcript: data.transcript
                });
              } else {
                reject(new Error(data.error || "Upload fehlgeschlagen"));
              }
            } catch {
              reject(new Error("Ungültige Antwort vom Server"));
            }
          } else {
            // Versuche Fehlerdetails aus Response zu extrahieren
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.error || `Upload fehlgeschlagen: ${xhr.statusText}`));
            } catch {
              reject(new Error(`Upload fehlgeschlagen: ${xhr.statusText} (Status: ${xhr.status})`));
            }
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Netzwerkfehler beim Upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload abgebrochen"));
        });

        xhr.open("POST", "/api/upload");
        // CSRF Header setzen
        xhr.setRequestHeader("x-csrf-token", csrfToken);
        xhr.send(formData);
      });

      const result = await uploadPromise;
      setProgress(100);
      setIsUploading(false); // Physical upload done
      setIsProcessingAI(true); // Start fake AI processing steps
      
      // We don't call onUploadSuccess yet, we wait for the fake steps to "complete"
      // Or we can call it but keep the UI in processing state
      
      onUploadSuccess?.(result.fileName || file.name, result.transcript);

      // We'll let the ProcessingStatus component handle its thing.
      // We'll set success to true after a small delay to match the fake steps.
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Upload-Fehler";
      setError(errorMessage);
      onUploadError?.(errorMessage);
      setProgress(0);
      // In Production: Hier würde man zu einem Error-Tracking-Service loggen
      if (process.env.NODE_ENV === "development") {
        logger.error("Upload-Fehler:", err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup Timeout beim Unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleRemove = () => {
    // Timeout clearen wenn User manuell entfernt
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-[6px] p-6 sm:p-8 text-center transition-all duration-300 ${isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50"
            }`}
        >
          {!file ? (
            <>
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-accent" />
              <p className="text-sm sm:text-base font-medium mb-2">
                Datei hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 px-2">
                Unterstützt: MP3, MP4, WAV, M4A, WebM (max. 100MB)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Datei auswählen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    handleFileSelect(selectedFile);
                  }
                }}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {success ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0 mt-0.5 sm:mt-0" />
                  ) : error ? (
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    aria-label="Datei entfernen"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {progress}% hochgeladen...
                  </p>
                </div>
              )}

              <ProcessingStatus 
                isProcessing={isUploading || isProcessingAI} 
                onComplete={() => {
                  if (isProcessingAI) {
                    setIsProcessingAI(false);
                    setSuccess(true);
                    
                    // Reset after configured time
                    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
                    resetTimeoutRef.current = setTimeout(() => {
                      setFile(null);
                      setSuccess(false);
                      setProgress(0);
                    }, TIMEOUTS.UPLOAD_RESET);
                  }
                }}
              />

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm">
                  ✅ Datei erfolgreich hochgeladen und wird verarbeitet!
                </div>
              )}

              {!isUploading && !success && (
                <Button onClick={handleUpload} className="w-full">
                  Hochladen
                </Button>
              )}

              {isUploading && (
                <Button disabled className="w-full">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird hochgeladen...
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

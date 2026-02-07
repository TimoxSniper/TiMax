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
      // Schritt 1: CSRF-Token holen
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      // Schritt 2: Upload-Eintrag in Supabase erstellen
      const createResponse = await fetch("/api/uploads/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Fehler beim Erstellen des Upload-Eintrags");
      }

      const { uploadId } = await createResponse.json();

      // Schritt 3: n8n Webhook URL aus ENV (Public, da Client-Side)
      const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL;
      if (!n8nWebhookUrl) {
        throw new Error("n8n Webhook URL ist nicht konfiguriert");
      }

      // Schritt 4: Datei direkt zu n8n hochladen
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
      const uploadPromise = new Promise<{
        success: boolean;
        fileName?: string;
        transcript?: string;
      }>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const responseText = xhr.responseText;

              // n8n kann JSON oder Text zurückgeben
              let transcript: string | undefined;
              try {
                const data = JSON.parse(responseText);
                transcript = data.transcript || data.output || data.text;
              } catch {
                // Falls kein JSON, ist es vielleicht reiner Text
                transcript = responseText.trim();
              }

              resolve({
                success: true,
                fileName: file.name,
                transcript,
              });
            } catch {
              reject(new Error("Ungültige Antwort vom Server"));
            }
          } else {
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

        // Sende zu n8n mit wichtigen Headers
        xhr.open("POST", n8nWebhookUrl);
        xhr.setRequestHeader("X-Upload-ID", uploadId);
        xhr.setRequestHeader("X-File-Name", file.name);
        // Note: User ID wird von n8n aus der Session gelesen (via Clerk)
        xhr.send(formData);
      });

      const result = await uploadPromise;
      setProgress(100);
      setIsUploading(false);
      setIsProcessingAI(true);

      onUploadSuccess?.(result.fileName || file.name, result.transcript);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Upload-Fehler";
      setError(errorMessage);
      onUploadError?.(errorMessage);
      setProgress(0);

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
          className={`rounded-[6px] border-2 border-dashed p-6 text-center transition-all duration-300 sm:p-8 ${
            isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
          }`}
        >
          {!file ? (
            <>
              <Upload className="text-accent mx-auto mb-3 h-10 w-10 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="mb-2 text-sm font-medium sm:text-base">
                Datei hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-muted-foreground mb-4 px-2 text-xs sm:text-sm">
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
              <div className="flex items-start justify-between gap-2 sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center sm:gap-3">
                  {success ? (
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500 sm:mt-0 sm:h-6 sm:w-6" />
                  ) : error ? (
                    <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
                  ) : (
                    <Upload className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
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
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="bg-muted w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-2 transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground text-center text-xs">
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
                <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

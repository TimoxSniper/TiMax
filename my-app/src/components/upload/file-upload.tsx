"use client";

import { useState, useRef, useEffect, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = [
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/m4a", "video/mp4", "video/webm"
];

interface FileUploadProps {
  onUploadSuccess?: (fileName: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      const uploadPromise = new Promise<{ success: boolean; fileName?: string; error?: string }>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                resolve({ success: true, fileName: data.fileName || file.name });
              } else {
                reject(new Error(data.error || "Upload fehlgeschlagen"));
              }
            } catch (parseError) {
              reject(new Error("Ungültige Antwort vom Server"));
            }
          } else {
            reject(new Error(`Upload fehlgeschlagen: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Netzwerkfehler beim Upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload abgebrochen"));
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

      const result = await uploadPromise;
      setProgress(100);
      setSuccess(true);
      onUploadSuccess?.(result.fileName || file.name);
      
      // Alten Timeout clearen falls vorhanden
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      
      // Reset nach 3 Sekunden
      resetTimeoutRef.current = setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setProgress(0);
        resetTimeoutRef.current = null;
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unbekannter Upload-Fehler";
      setError(errorMessage);
      onUploadError?.(errorMessage);
      setProgress(0);
      // In Production: Hier würde man zu einem Error-Tracking-Service loggen
      if (process.env.NODE_ENV === "development") {
        console.error("Upload-Fehler:", err);
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
      <CardContent className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
        >
          {!file ? (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">
                Datei hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Unterstützt: MP3, MP4, WAV, M4A, WebM (max. 100MB)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : error ? (
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
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

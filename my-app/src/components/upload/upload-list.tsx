"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileAudio,
  FileVideo,
  Trash2,
  Search,
  MessageSquare,
  Eye,
  Copy,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logger } from "@/lib/logger";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface Upload {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  transcript?: string;
  error_message?: string;
  metadata?: {
    topics?: string[];
    intention?: string;
    tone?: string;
    summary?: string;
  };
  created_at: string;
}

export function UploadList() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchUploads = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`/api/uploads?page=${pageNum}&limit=20`);
      const data = await response.json();
      if (data.success) {
        if (append) {
          setUploads((prev) => [...prev, ...data.uploads]);
        } else {
          setUploads(data.uploads);
        }
        setHasMore(data.pagination?.hasMore || false);
        setPage(pageNum);
      }
    } catch (error) {
      logger.error("Failed to fetch uploads:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreUploads = () => {
    if (!loadingMore && hasMore) {
      fetchUploads(page + 1, true);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // Set up intersection observer to automatically load more uploads when user scrolls near the bottom
  const sentinelRef = useIntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreUploads();
      }
    },
    {
      rootMargin: '100px', // Load when 100px from the bottom
    }
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Möchtest du dieses Transkript wirklich löschen?")) return;

    try {
      // CSRF-Token holen
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch(`/api/uploads/${id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });
      if (response.ok) {
        setUploads((prev) => prev.filter((u) => u.id !== id));
        toast.success("Datei gelöscht");
      } else {
        const data = await response.json();
        toast.error(data.error || "Löschen fehlgeschlagen");
      }
    } catch (error) {
      logger.error("Failed to delete upload:", error);
      toast.error("Löschen fehlgeschlagen");
    }
  };

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      const response = await fetch(`/api/uploads/${id}/retry`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        // Update the upload status in the list
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: "pending" as const, error_message: undefined } : u
          )
        );
        toast.success("Upload wird erneut verarbeitet");
      } else {
        toast.error(data.error || "Retry fehlgeschlagen");
      }
    } catch (error) {
      logger.error("Failed to retry upload:", error);
      toast.error("Retry fehlgeschlagen");
    } finally {
      setRetryingId(null);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    toast.success("Transkript kopiert");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const startChatFromTranscript = (transcript: string) => {
    // Hier könnten wir das Transkript in den LocalStorage legen oder als Query Param übergeben
    // Für jetzt nutzen wir LocalStorage als Übergabe-Puffer
    localStorage.setItem("pending_transcript", transcript);
    router.push("/chat?source=transcript");
  };

  const filteredUploads = uploads.filter((u) =>
    u.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <FileAudio className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium">Noch keine Uploads</h3>
        <p className="text-muted-foreground mb-6">
          Lade eine Datei auf der Startseite hoch, um loszulegen.
        </p>
        <Button onClick={() => router.push("/")}>Datei hochladen</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Dateien durchsuchen..."
          className="bg-muted/50 focus:ring-primary w-full rounded-xl border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredUploads.map((upload) => (
          <div key={upload.id} className="relative">
            <Link href={`/uploads/${upload.id}`}>
              <div 
                className="group bg-card border-border hover:border-accent/50 relative flex cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-[4px] border p-6 shadow-sm transition-all duration-500 hover:shadow-md sm:flex-row sm:items-center"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Navigate to the same URL as the Link component
                    router.push(`/uploads/${upload.id}`);
                  }
                }}
                role="link"
                aria-label={`Upload öffnen: ${upload.file_name}`}
              >
                {/* Decorative Accent Line */}
                <div className="bg-accent absolute top-0 bottom-0 left-0 w-1 -translate-x-full transform transition-transform duration-500 group-hover:translate-x-0" />

                {/* Icon and Content Wrapper */}
                <div className="flex w-full min-w-0 flex-1 items-start gap-5">
                  {/* Square icon container - Editorial Modernism */}
                  <div className="bg-secondary group-hover:bg-accent/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[2px] transition-colors duration-500">
                    {upload.file_type.startsWith("video") ? (
                      <FileVideo className="text-accent h-5 w-5" />
                    ) : (
                      <FileAudio className="text-accent h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-foreground group-hover:text-accent truncate pr-2 font-serif text-lg font-bold transition-colors duration-500">
                        {upload.file_name}
                      </h3>
                      <Badge
                        variant={
                          upload.status === "completed"
                            ? "default"
                            : upload.status === "processing" || upload.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="shrink-0 rounded-[2px] px-2 py-0.5 text-[10px] tracking-widest uppercase"
                      >
                        {upload.status === "completed"
                          ? "Fertig"
                          : upload.status === "processing"
                            ? "In Arbeit"
                            : upload.status === "pending"
                              ? "Wartend"
                              : "Fehler"}
                      </Badge>
                    </div>

                    {/* Metadata - uppercase, muted */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] tracking-widest uppercase">
                      <span className="flex items-center gap-1.5 font-medium">
                        {formatFileSize(upload.file_size)}
                      </span>
                      <span className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
                      <span className="font-medium">
                        {new Date(upload.created_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {upload.metadata?.intention && (
                        <>
                          <span className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
                          <span className="text-accent">{upload.metadata.intention}</span>
                        </>
                      )}
                    </div>

                    {/* Topics Tags */}
                    {upload.metadata?.topics && upload.metadata.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {upload.metadata.topics.slice(0, 3).map((topic, i) => (
                          <span
                            key={i}
                            className="bg-secondary text-secondary-foreground rounded-[2px] px-2 py-0.5 text-[10px] font-medium"
                          >
                            #{topic}
                          </span>
                        ))}
                        {upload.metadata.topics.length > 3 && (
                          <span className="text-muted-foreground text-[10px]">
                            +{upload.metadata.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-border/50 relative z-10 flex w-full items-center justify-end gap-2 border-t pt-4 sm:w-auto sm:justify-start sm:border-t-0 sm:pt-0">
                  <div className="flex items-center gap-1">
                    {upload.status === "failed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRetry(upload.id);
                        }}
                        disabled={retryingId === upload.id}
                        className="text-primary hover:bg-primary/10"
                        aria-label={`Upload ${upload.file_name} erneut versuchen`}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${retryingId === upload.id ? "animate-spin" : ""}`}
                        />
                      </Button>
                    )}

                    {upload.transcript && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group-hover:text-accent transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Transkript für ${upload.file_name} anzeigen`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex h-[90vh] max-w-4xl flex-col overflow-hidden rounded-none border-none p-0 sm:rounded-[4px]">
                          <div className="bg-background flex h-full flex-col">
                            {/* Modal Header - Editorial Style */}
                            <div className="border-border bg-secondary/20 space-y-4 border-b p-8 sm:p-12">
                              <div className="flex items-center justify-between gap-4">
                                <Badge
                                  variant="outline"
                                  className="border-accent text-accent rounded-none text-[10px] tracking-[0.2em] uppercase"
                                >
                                  Vorschau
                                </Badge>
                                <div className="text-muted-foreground text-[10px] tracking-widest uppercase">
                                  ID: {upload.id.split("-")[0]}
                                </div>
                              </div>
                              <h2 className="text-foreground font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                                {upload.file_name}
                              </h2>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16">
                              <div className="prose prose-stone prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 text-foreground/90 max-w-none font-sans">
                                {upload.transcript.split("\n").map((para, i) => (
                                  <p key={i}>{para}</p>
                                ))}
                              </div>
                            </div>

                            {/* Action Footer */}
                            <div className="border-border bg-card flex flex-col items-center justify-between gap-4 border-t p-6 sm:flex-row sm:p-8">
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyToClipboard(upload.transcript || "");
                                }}
                                className="border-foreground hover:bg-foreground hover:text-background rounded-none transition-all"
                                aria-label="Transkript in Zwischenablage kopieren"
                              >
                                {isCopying ? (
                                  <Check className="mr-2 h-4 w-4" />
                                ) : (
                                  <Copy className="mr-2 h-4 w-4" />
                                )}
                                TEXT KOPIEREN
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startChatFromTranscript(upload.transcript || "");
                                }}
                                className="bg-accent hover:bg-accent/90 rounded-none px-8 py-6 font-bold tracking-widest text-white transition-all"
                                aria-label="KI-Chat mit diesem Transkript starten"
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                KI-CHAT STARTEN
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(upload.id);
                      }}
                      aria-label={`Upload ${upload.file_name} löschen`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-6">
          <Button
            variant="outline"
            onClick={loadMoreUploads}
            disabled={loadingMore}
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Wird geladen...
              </>
            ) : (
              "Mehr laden"
            )}
          </Button>
        </div>
      )}
      
      {/* Sentinel element for Intersection Observer */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}

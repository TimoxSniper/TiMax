"use client";

import { useState, useEffect } from "react";
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
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logger } from "@/lib/logger";

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
        fetchUploads(page + 1, true);
    };

    useEffect(() => {
        fetchUploads();
    }, []);

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
                        u.id === id
                            ? { ...u, status: "pending" as const, error_message: undefined }
                            : u
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
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="w-24 h-8 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (uploads.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileAudio className="w-8 h-8 text-muted-foreground" />
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Dateien durchsuchen..."
                    className="w-full bg-muted/50 border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6">
                {filteredUploads.map((upload) => (
                    <div key={upload.id} className="relative">
                        <Link href={`/uploads/${upload.id}`}>
                            <div
                                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 transition-all duration-500 bg-card border border-border hover:border-accent/50 cursor-pointer overflow-hidden shadow-sm hover:shadow-md rounded-[4px]"
                            >
                                {/* Decorative Accent Line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

                                {/* Icon and Content Wrapper */}
                                <div className="flex items-start gap-5 min-w-0 flex-1 w-full">
                                    {/* Square icon container - Editorial Modernism */}
                                    <div className="w-12 h-12 rounded-[2px] bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors duration-500">
                                        {upload.file_type.startsWith("video") ? (
                                            <FileVideo className="w-5 h-5 text-accent" />
                                        ) : (
                                            <FileAudio className="w-5 h-5 text-accent" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-lg font-serif font-bold truncate pr-2 text-foreground group-hover:text-accent transition-colors duration-500">
                                                {upload.file_name}
                                            </h3>
                                            <Badge
                                                variant={
                                                    upload.status === "completed" ? "default" :
                                                        upload.status === "processing" || upload.status === "pending" ? "secondary" : "destructive"
                                                }
                                                className="shrink-0 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-[2px]"
                                            >
                                                {upload.status === "completed" ? "Fertig" :
                                                    upload.status === "processing" ? "In Arbeit" :
                                                        upload.status === "pending" ? "Wartend" : "Fehler"}
                                            </Badge>
                                        </div>

                                        {/* Metadata - uppercase, muted */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                {formatFileSize(upload.file_size)}
                                            </span>
                                            <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                            <span className="font-medium">
                                                {new Date(upload.created_at).toLocaleDateString("de-DE", { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            {upload.metadata?.intention && (
                                                <>
                                                    <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                                    <span className="text-accent">{upload.metadata.intention}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Topics Tags */}
                                        {upload.metadata?.topics && upload.metadata.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {upload.metadata.topics.slice(0, 3).map((topic, i) => (
                                                    <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-[2px] text-secondary-foreground font-medium">
                                                        #{topic}
                                                    </span>
                                                ))}
                                                {upload.metadata.topics.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground">+{upload.metadata.topics.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50 relative z-10">
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
                                            >
                                                <RefreshCw className={`w-4 h-4 ${retryingId === upload.id ? "animate-spin" : ""}`} />
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
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden border-none rounded-none sm:rounded-[4px]">
                                                    <div className="flex flex-col h-full bg-background">
                                                        {/* Modal Header - Editorial Style */}
                                                        <div className="p-8 sm:p-12 border-b border-border space-y-4 bg-secondary/20">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] rounded-none border-accent text-accent">
                                                                    Vorschau
                                                                </Badge>
                                                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                                                    ID: {upload.id.split('-')[0]}
                                                                </div>
                                                            </div>
                                                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                                                                {upload.file_name}
                                                            </h2>
                                                        </div>

                                                        {/* Content Area */}
                                                        <div className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16">
                                                            <div className="prose prose-stone max-w-none prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 text-foreground/90 font-sans">
                                                                {upload.transcript.split('\n').map((para, i) => (
                                                                    <p key={i}>{para}</p>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Action Footer */}
                                                        <div className="p-6 sm:p-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-card">
                                                            <Button
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopyToClipboard(upload.transcript || "");
                                                                }}
                                                                className="rounded-none border-foreground hover:bg-foreground hover:text-background transition-all"
                                                            >
                                                                {isCopying ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                                                TEXT KOPIEREN
                                                            </Button>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    startChatFromTranscript(upload.transcript || "");
                                                                }}
                                                                className="rounded-none px-8 py-6 bg-accent hover:bg-accent/90 text-white font-bold tracking-widest transition-all"
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-2" />
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
                                        >
                                            <Trash2 className="w-4 h-4" />
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
        </div>
    );
}

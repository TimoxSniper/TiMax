"use client";

import { useState, useEffect } from "react";
import {
    FileAudio,
    FileVideo,
    Trash2,
    Search,
    MessageSquare,
    Eye,
    Download,
    Copy,
    Check,
    MoreVertical,
    ExternalLink,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
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
    created_at: string;
}

export function UploadList() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTranscript, setSelectedTranscript] = useState<Upload | null>(null);
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
            const response = await fetch(`/api/uploads/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setUploads((prev) => prev.filter((u) => u.id !== id));
                toast.success("Datei gelöscht");
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

            <div className="grid gap-0 divide-y divide-border">
                {filteredUploads.map((upload) => (
                    <div
                        key={upload.id}
                        className="group flex items-center gap-4 p-4 transition-all duration-300 hover:bg-secondary/50 border-l-4 border-l-transparent hover:border-l-accent"
                    >
                        {/* Square icon container - Editorial Modernism */}
                        <div className="w-10 h-10 rounded-[4px] bg-secondary flex items-center justify-center flex-shrink-0">
                            {upload.file_type.startsWith("video") ? (
                                <FileVideo className="w-5 h-5 text-accent" />
                            ) : (
                                <FileAudio className="w-5 h-5 text-accent" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* File name - DM Sans Medium */}
                            <h3 className="text-base font-medium truncate pr-4 text-foreground">
                                {upload.file_name}
                            </h3>
                            {/* Metadata - uppercase, muted */}
                            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground mt-1">
                                <span>{formatFileSize(upload.file_size)}</span>
                                <span>|</span>
                                <span>{new Date(upload.created_at).toLocaleDateString("de-DE")}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    upload.status === "completed" ? "default" :
                                        upload.status === "processing" || upload.status === "pending" ? "secondary" : "destructive"
                                }
                                className="hidden sm:inline-flex"
                            >
                                {upload.status === "completed" ? "Fertig" :
                                    upload.status === "processing" ? "In Arbeit" :
                                        upload.status === "pending" ? "Ausstehend" : "Fehler"}
                            </Badge>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* Retry Button - Only for failed uploads */}
                                {upload.status === "failed" && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRetry(upload.id)}
                                        disabled={retryingId === upload.id}
                                        title="Erneut versuchen"
                                        className="text-primary hover:text-primary"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${retryingId === upload.id ? "animate-spin" : ""}`} />
                                    </Button>
                                )}
                                {upload.transcript && (
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" title="Vorschau">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <span>Transkript: {upload.file_name}</span>
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Generiert am {new Date(upload.created_at).toLocaleString("de-DE")}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-y-auto my-4 p-4 bg-muted rounded-xl text-sm leading-relaxed">
                                                    {upload.transcript}
                                                </div>
                                                <DialogFooter className="flex sm:justify-between items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleCopyToClipboard(upload.transcript || "")}
                                                        className="gap-2"
                                                    >
                                                        {isCopying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        {isCopying ? "Kopiert" : "Kopieren"}
                                                    </Button>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => startChatFromTranscript(upload.transcript || "")}
                                                            className="gap-2"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            Chat starten
                                                        </Button>
                                                    </div>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Im Chat nutzen"
                                            onClick={() => startChatFromTranscript(upload.transcript || "")}
                                        >
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-destructive"
                                    onClick={() => handleDelete(upload.id)}
                                    title="Löschen"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
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

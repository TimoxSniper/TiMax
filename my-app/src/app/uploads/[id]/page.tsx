"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  MessageSquare, 
  Calendar, 
  HardDrive, 
  Type,
  Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Upload {
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    status: string;
    transcript?: string;
    metadata?: {
        topics?: string[];
        intention?: string;
        tone?: string;
        summary?: string;
    };
    created_at: string;
}

export default function TranscriptDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [upload, setUpload] = useState<Upload | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCopying, setIsCopying] = useState(false);

    useEffect(() => {
        const fetchUpload = async () => {
            try {
                const response = await fetch(`/api/uploads/${id}`);
                const data = await response.json();
                if (data.success) {
                    setUpload(data.upload);
                } else {
                    toast.error("Transkript nicht gefunden");
                    router.push("/uploads");
                }
            } catch {
                toast.error("Laden fehlgeschlagen");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUpload();
    }, [id, router]);

    const handleCopyToClipboard = () => {
        if (!upload?.transcript) return;
        navigator.clipboard.writeText(upload.transcript);
        setIsCopying(true);
        toast.success("In Zwischenablage kopiert");
        setTimeout(() => setIsCopying(false), 2000);
    };

    const startChat = () => {
        if (!upload?.transcript) return;
        localStorage.setItem("pending_transcript", upload.transcript);
        router.push("/chat?source=transcript");
    };

    const handleDelete = async () => {
        if (!confirm("Wirklich löschen?")) return;
        try {
            const response = await fetch(`/api/uploads/${id}`, { method: "DELETE" });
            if (response.ok) {
                toast.success("Gelöscht");
                router.push("/uploads");
            }
        } catch {
            toast.error("Fehler beim Löschen");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <MainNavigation />
                <div className="container mx-auto max-w-4xl px-4 py-20 space-y-8">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!upload) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            <MainNavigation />
            
            <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
                {/* Back Link */}
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="mb-8 group -ml-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Zurück zur Übersicht
                </Button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Content */}
                    <div className="flex-1 space-y-12">
                        {/* Header */}
                        <header className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] rounded-none border-accent text-accent">
                                    Transkription
                                </Badge>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    #{upload.id.split('-')[0]}
                                </span>
                            </div>
                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                {upload.file_name}
                            </h1>
                            <div className="w-24 h-1 bg-accent" />
                        </header>

                        {/* Summary Box */}
                        {upload.metadata?.summary && (
                            <div className="relative p-8 bg-secondary/30 border-l-4 border-accent italic text-xl text-foreground/80 font-serif leading-relaxed">
                                <span className="absolute top-4 left-4 text-4xl text-accent/20 font-serif">"</span>
                                {upload.metadata.summary}
                            </div>
                        )}

                        {/* Transcript Content */}
                        <article className="prose prose-stone prose-lg max-w-none prose-p:leading-relaxed prose-p:text-foreground/90 font-sans">
                            {upload.transcript ? (
                                upload.transcript.split('\n').map((para, i) => (
                                    para.trim() && <p key={i}>{para}</p>
                                ))
                            ) : (
                                <p className="italic text-muted-foreground">Kein Transkript vorhanden.</p>
                            )}
                        </article>
                    </div>

                    {/* Right Column: Metadata & Actions */}
                    <aside className="lg:w-80 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            {/* Actions Card */}
                            <div className="bg-card border border-border p-6 space-y-4 rounded-none sm:rounded-[4px] shadow-sm">
                                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">
                                    Aktionen
                                </h4>
                                <Button 
                                    onClick={startChat}
                                    className="w-full h-14 rounded-none bg-accent hover:bg-accent/90 text-white font-bold tracking-widest transition-all"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    KI-CHAT STARTEN
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleCopyToClipboard}
                                    className="w-full h-12 rounded-none border-foreground hover:bg-foreground hover:text-background transition-all"
                                >
                                    {isCopying ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    TEXT KOPIEREN
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={handleDelete}
                                    className="w-full text-destructive hover:bg-destructive/5 rounded-none"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Löschen
                                </Button>
                            </div>

                            {/* Info Card */}
                            <div className="bg-secondary/20 p-6 space-y-6 rounded-none sm:rounded-[4px]">
                                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">
                                    Details
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-accent" />
                                        <div className="text-sm">
                                            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Erstellt am</p>
                                            <p className="font-medium">{new Date(upload.created_at).toLocaleDateString("de-DE", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <HardDrive className="w-4 h-4 text-accent" />
                                        <div className="text-sm">
                                            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Dateigröße</p>
                                            <p className="font-medium">{(upload.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Type className="w-4 h-4 text-accent" />
                                        <div className="text-sm">
                                            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Dateityp</p>
                                            <p className="font-medium uppercase">{upload.file_type.split('/')[1] || upload.file_type}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Topics */}
                                {upload.metadata?.topics && upload.metadata.topics.length > 0 && (
                                    <div className="pt-4 border-t border-border/50 space-y-3">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Themen</p>
                                        <div className="flex flex-wrap gap-2">
                                            {upload.metadata.topics.map((topic, i) => (
                                                <Badge key={i} variant="secondary" className="rounded-none bg-background border-border text-[10px] font-medium">
                                                    #{topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

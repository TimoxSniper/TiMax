"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Check,
  MessageSquare,
  Calendar,
  HardDrive,
  Type,
  Trash2,
  AlertTriangle,
  Loader2,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsDeleting(true);
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
        toast.success("Transkript gelöscht");
        router.push("/uploads");
      } else {
        const data = await response.json();
        toast.error(data.error || "Fehler beim Löschen");
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    } catch {
      toast.error("Fehler beim Löschen");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <MainNavigation />
        <div className="container mx-auto max-w-4xl space-y-8 px-4 py-20">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!upload) return null;

  return (
    <div className="bg-background min-h-screen">
      <MainNavigation />

      <main className="container mx-auto max-w-5xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Meine Dateien", href: "/uploads" },
            { label: upload.file_name },
          ]}
          className="mb-6"
        />

        {/* Back Link */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group text-muted-foreground hover:text-foreground mb-8 -ml-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Zurück zur Übersicht
        </Button>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left Column: Content */}
          <div className="flex-1 space-y-12">
            {/* Header */}
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-accent text-accent rounded-none text-[10px] tracking-[0.2em] uppercase"
                >
                  Transkription
                </Badge>
                <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                  #{upload.id.split("-")[0]}
                </span>
              </div>
              <h1 className="text-foreground font-serif text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                {upload.file_name}
              </h1>
              <div className="bg-accent h-1 w-24" />
            </header>

            {/* Summary Box */}
            {upload.metadata?.summary && (
              <div className="bg-secondary/30 border-accent text-foreground/80 relative border-l-4 p-8 font-serif text-xl leading-relaxed italic">
                <span className="text-accent/20 absolute top-4 left-4 font-serif text-4xl">"</span>
                {upload.metadata.summary}
              </div>
            )}

            {/* Transcript Content */}
            <article className="prose prose-stone prose-lg prose-p:leading-relaxed prose-p:text-foreground/90 max-w-none font-sans">
              {upload.transcript ? (
                upload.transcript.split("\n").map((para, i) => para.trim() && <p key={i}>{para}</p>)
              ) : (
                <p className="text-muted-foreground italic">Kein Transkript vorhanden.</p>
              )}
            </article>
          </div>

          {/* Right Column: Metadata & Actions */}
          <aside className="space-y-8 lg:w-80">
            <div className="sticky top-24 space-y-8">
              {/* Actions Card */}
              <div className="bg-card border-border space-y-4 rounded-none border p-6 shadow-sm sm:rounded-[4px]">
                <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-[0.2em] uppercase">
                  Aktionen
                </h4>
                <Button
                  onClick={startChat}
                  className="bg-accent hover:bg-accent/90 h-14 w-full rounded-none font-bold tracking-widest text-white transition-all"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  KI-CHAT STARTEN
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyToClipboard}
                  className="border-foreground hover:bg-foreground hover:text-background h-12 w-full rounded-none transition-all"
                >
                  {isCopying ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      KOPIERT!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      TEXT KOPIEREN
                    </>
                  )}
                </Button>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/5 w-full rounded-none"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Transkript löschen?
                      </DialogTitle>
                      <DialogDescription>
                        Das Transkript und alle zugehörigen Daten werden unwiderruflich gelöscht.
                        Diese Aktion kann nicht rückgängig gemacht werden.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={isDeleting}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Wird gelöscht...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Endgültig löschen
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Info Card */}
              <div className="bg-secondary/20 space-y-6 rounded-none p-6 sm:rounded-[4px]">
                <h4 className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
                  Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-accent h-4 w-4" />
                    <div className="text-sm">
                      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                        Erstellt am
                      </p>
                      <p className="font-medium">
                        {new Date(upload.created_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="text-accent h-4 w-4" />
                    <div className="text-sm">
                      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                        Dateigröße
                      </p>
                      <p className="font-medium">
                        {(upload.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Type className="text-accent h-4 w-4" />
                    <div className="text-sm">
                      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                        Dateityp
                      </p>
                      <p className="font-medium uppercase">
                        {upload.file_type.split("/")[1] || upload.file_type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                {upload.metadata?.topics && upload.metadata.topics.length > 0 && (
                  <div className="border-border/50 space-y-3 border-t pt-4">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Themen
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {upload.metadata.topics.map((topic, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-background border-border rounded-none text-[10px] font-medium"
                        >
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
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Upload,
  MessageSquare,
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileAudio,
} from "lucide-react";
import { AnimatedSection } from "@/components/magic-ui/animated-section";
import { MainNavigation } from "@/components/layout/main-navigation";
import { Footer } from "@/components/layout/footer";
import { OnboardingTourProvider } from "@/components/onboarding/onboarding-tour-provider";
import { TourRenderer } from "@/components/onboarding/tour-renderer";
import { cn } from "@/lib/utils";
import type { Upload as UploadType } from "@/lib/supabase/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentUpload {
  id: string;
  file_name: string;
  status: UploadType["status"];
  created_at: string;
}

interface RecentChat {
  id: string;
  session_id: string;
  title: string | null;
  updated_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(firstName: string | null | undefined) {
  const hour = new Date().getHours();
  const name = firstName ?? "dort";
  if (hour < 12) return `Guten Morgen, ${name}!`;
  if (hour < 18) return `Guten Tag, ${name}!`;
  return `Guten Abend, ${name}!`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Gerade eben";
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface QuickActionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function QuickActionCard({ href, icon, title, description, delay = 0 }: QuickActionCardProps) {
  return (
    <AnimatedSection delay={delay}>
      <Link
        href={href}
        className={cn(
          "group flex flex-col gap-4 rounded-[6px] border border-border bg-card p-6",
          "transition-all duration-300",
          "hover:border-accent hover:shadow-lg hover:-translate-y-0.5"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
            {icon}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
    </AnimatedSection>
  );
}

function StatusBadge({ status }: { status: UploadType["status"] }) {
  const config = {
    completed: {
      label: "Fertig",
      icon: <CheckCircle className="h-3 w-3" />,
      className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
    },
    processing: {
      label: "Läuft",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      className: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
    },
    pending: {
      label: "Wartend",
      icon: <Clock className="h-3 w-3" />,
      className: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
    },
    failed: {
      label: "Fehler",
      icon: <AlertCircle className="h-3 w-3" />,
      className: "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400",
    },
    cancelled: {
      label: "Abgebrochen",
      icon: <AlertCircle className="h-3 w-3" />,
      className: "text-muted-foreground bg-secondary",
    },
  };

  const { label, icon, className } = config[status] ?? config.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const tourParam = searchParams.get("tour");
  const isTourActive = tourParam === "1";
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(true);

  const fetchRecentUploads = useCallback(async () => {
    try {
      const res = await fetch("/api/uploads?limit=3");
      if (res.ok) {
        const data = await res.json();
        setRecentUploads(data.uploads ?? []);
      }
    } catch {
      // silently fail – dashboard is non-critical
    } finally {
      setUploadsLoading(false);
    }
  }, []);

  const fetchRecentChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chats?limit=3");
      if (res.ok) {
        const data = await res.json();
        setRecentChats(data.chats ?? []);
      }
    } catch {
      // silently fail – dashboard is non-critical
    } finally {
      setChatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentUploads();
    fetchRecentChats();
  }, [fetchRecentUploads, fetchRecentChats]);

  return (
    <OnboardingTourProvider>
      <>
        <MainNavigation />
        <main data-tour="dashboard-overview" className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <AnimatedSection>
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            {getGreeting(user?.firstName)}
          </h1>
          <div className="mt-3 h-1 w-16 bg-accent" />
          <p className="mt-4 text-muted-foreground">
            Dein Command Center – alles auf einen Blick.
          </p>
        </div>
      </AnimatedSection>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <section className="mb-12">
        <AnimatedSection delay={50}>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Schnell-Aktionen
          </h2>
        </AnimatedSection>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickActionCard
            href="/upload"
            icon={<Upload className="h-6 w-6" />}
            title="Neue Datei hochladen"
            description="Audio oder Video hochladen und automatisch transkribieren lassen."
            delay={100}
          />
          <QuickActionCard
            href="/chat"
            icon={<MessageSquare className="h-6 w-6" />}
            title="KI-Chat starten"
            description="Stelle Fragen zu deinen Inhalten und erhalte sofort Antworten."
            delay={150}
          />
          <QuickActionCard
            href="/uploads"
            icon={<FolderOpen className="h-6 w-6" />}
            title="Alle Uploads ansehen"
            description="Verwalte deine hochgeladenen Dateien und Transkriptionen."
            delay={200}
          />
        </div>
      </section>

      {/* ── Recent Activity ───────────────────────────────────────────────── */}
      <AnimatedSection delay={250}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Letzte Aktivität
        </h2>
      </AnimatedSection>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Recent Uploads */}
        <AnimatedSection delay={300}>
          <div className="rounded-[6px] border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-sm tracking-tight">Letzte Uploads</h3>
              <Link
                href="/uploads"
                className="text-xs text-muted-foreground transition-colors hover:text-accent"
              >
                Alle ansehen →
              </Link>
            </div>

            <div className="divide-y divide-border">
              {uploadsLoading ? (
                <div className="flex items-center justify-center px-5 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : recentUploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-5 py-8 text-center">
                  <FileAudio className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Noch keine Uploads</p>
                  <Link
                    href="/upload"
                    className="mt-1 text-xs font-medium text-accent hover:underline"
                  >
                    Erste Datei hochladen →
                  </Link>
                </div>
              ) : (
                recentUploads.map((upload) => (
                  <Link
                    key={upload.id}
                    href={`/uploads`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {upload.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(upload.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={upload.status} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Recent Chats */}
        <AnimatedSection delay={350}>
          <div className="rounded-[6px] border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold text-sm tracking-tight">Letzte Chats</h3>
              <Link
                href="/chat"
                className="text-xs text-muted-foreground transition-colors hover:text-accent"
              >
                Alle ansehen →
              </Link>
            </div>

            <div className="divide-y divide-border">
              {chatsLoading ? (
                <div className="flex items-center justify-center px-5 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : recentChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-5 py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Noch keine Chats</p>
                  <Link
                    href="/chat"
                    className="mt-1 text-xs font-medium text-accent hover:underline"
                  >
                    Ersten Chat starten →
                  </Link>
                </div>
              ) : (
                recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?session=${chat.session_id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {chat.title ?? "Neuer Chat"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(chat.updated_at)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
        </main>
        <Footer />
        {isTourActive && <TourRenderer targetSelector="dashboard-overview" />}
      </>
    </OnboardingTourProvider>
  );
}

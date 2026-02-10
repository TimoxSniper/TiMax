/**
 * Admin Upload Detail Page
 *
 * View upload details, transcript, and metadata
 */

import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate, formatFileSize, getInitials } from "@/lib/admin/utils";
import type { UploadWithDetails } from "@/types/admin";

async function getUploadDetails(uploadId: string): Promise<UploadWithDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/uploads/${uploadId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch upload details:", error);
    return null;
  }
}

export default async function UploadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const upload = await getUploadDetails(id);

  if (!upload) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/uploads">
          <Button variant="outline" size="sm" className="rounded-[4px]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Uploads
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold">{upload.file_name}</h1>
        </div>
        <StatusBadge status={upload.status} />
      </div>

      {/* Upload Info */}
      <Card className="p-6 shadow-editorial-md">
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16 rounded-[8px]">
            <AvatarImage src={upload.user.imageUrl} alt={upload.user.fullName} />
            <AvatarFallback className="rounded-[8px] bg-accent/10 text-accent text-lg">
              {getInitials(upload.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold mb-2">{upload.user.fullName}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Email</p>
                <p className="font-semibold">{upload.user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">File Type</p>
                <p className="font-semibold font-mono">{upload.file_type || "Unknown"}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">File Size</p>
                <p className="font-semibold font-mono">{formatFileSize(upload.file_size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">Created</p>
                <p className="font-semibold">{formatDate(upload.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message (if failed) */}
      {upload.status === "failed" && upload.error_message && (
        <Card className="p-6 shadow-editorial-md bg-destructive/5 border-destructive/20">
          <h2 className="font-serif text-xl font-bold mb-3 text-destructive">Error Message</h2>
          <p className="text-sm font-mono whitespace-pre-wrap">{upload.error_message}</p>
        </Card>
      )}

      {/* Transcript */}
      {upload.transcript && (
        <Card className="p-6 shadow-editorial-md">
          <h2 className="font-serif text-xl font-bold mb-3">Transcript</h2>
          <div className="bg-muted/30 rounded-[6px] p-4 max-h-[400px] overflow-y-auto">
            <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
              {upload.transcript}
            </p>
          </div>
        </Card>
      )}

      {/* Metadata */}
      {upload.metadata && (
        <Card className="p-6 shadow-editorial-md">
          <h2 className="font-serif text-xl font-bold mb-3">Metadata</h2>
          <div className="space-y-4">
            {upload.metadata.topics && upload.metadata.topics.length > 0 && (
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
                  Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {upload.metadata.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-[4px] bg-accent/10 text-accent px-3 py-1 text-sm font-semibold"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {upload.metadata.intention && (
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
                  Intention
                </p>
                <p className="font-semibold capitalize">{upload.metadata.intention}</p>
              </div>
            )}

            {upload.metadata.tone && (
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
                  Tone
                </p>
                <p className="font-semibold capitalize">{upload.metadata.tone}</p>
              </div>
            )}

            {upload.metadata.content_quality && (
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
                  Content Quality
                </p>
                <p className="font-semibold font-mono">{upload.metadata.content_quality}/10</p>
              </div>
            )}

            {upload.metadata.key_quotes && upload.metadata.key_quotes.length > 0 && (
              <div>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide mb-2">
                  Key Quotes
                </p>
                <div className="space-y-2">
                  {upload.metadata.key_quotes.map((quote, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-accent pl-4 py-2 bg-muted/20 rounded-r-[4px]"
                    >
                      <p className="text-sm italic">"{quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Raw Metadata JSON */}
      {upload.metadataPreview && (
        <Card className="p-6 shadow-editorial-md">
          <h2 className="font-serif text-xl font-bold mb-3">Raw Metadata (JSON)</h2>
          <pre className="bg-muted/30 rounded-[6px] p-4 text-xs font-mono overflow-x-auto">
            {JSON.stringify(upload.metadataPreview, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}

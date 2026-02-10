/**
 * Admin Uploads Page
 *
 * Upload moderation with tabs: All, Processing, Failed
 * Real-time updates for Processing tab
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadsTable } from "@/components/admin/uploads/uploads-table";
import { SearchFilterBar } from "@/components/admin/shared/search-filter-bar";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EnrichedUpload } from "@/types/admin";

export default function AdminUploadsPage() {
  const router = useRouter();
  const [uploads, setUploads] = useState<EnrichedUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "processing" | "failed">("all");
  const [search, setSearch] = useState("");
  const [selectedUpload, setSelectedUpload] = useState<EnrichedUpload | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch uploads
  const fetchUploads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
        filter: activeTab,
        search,
      });

      const res = await fetch(`/api/admin/uploads?${params}`);
      const { data } = await res.json();

      setUploads(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch uploads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [currentPage, activeTab, search]);

  // Real-time updates for Processing tab
  useEffect(() => {
    if (activeTab !== "processing") return;

    const supabase = createClient();
    const channel = supabase
      .channel("uploads-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "uploads",
          filter: "status=eq.processing",
        },
        (payload) => {
          console.log("Upload status changed:", payload);
          // Refresh uploads when status changes
          fetchUploads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  // Handle view upload
  const handleViewUpload = (upload: EnrichedUpload) => {
    router.push(`/admin/uploads/${upload.id}`);
  };

  // Handle delete upload
  const handleDeleteUpload = async () => {
    if (!selectedUpload) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/uploads/${selectedUpload.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Deleted by admin via dashboard",
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Upload deleted successfully",
        });
        fetchUploads();
      } else {
        throw new Error("Failed to delete upload");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete upload",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedUpload(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Upload Moderation</h1>
        <p className="text-muted-foreground font-sans">
          Verwalte und moderiere hochgeladene Dateien
        </p>
      </div>

      {/* Search */}
      <SearchFilterBar
        onSearchChange={setSearch}
        placeholder="Suche nach Dateiname oder Benutzer..."
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="rounded-[6px]">
          <TabsTrigger value="all" className="rounded-[4px]">
            All Uploads
          </TabsTrigger>
          <TabsTrigger value="processing" className="rounded-[4px]">
            Processing
          </TabsTrigger>
          <TabsTrigger value="failed" className="rounded-[4px]">
            Failed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <UploadsTable
            uploads={uploads}
            isLoading={isLoading}
            onViewUpload={handleViewUpload}
            onDeleteUpload={(upload) => {
              setSelectedUpload(upload);
              setShowDeleteDialog(true);
            }}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteUpload}
        title="Delete Upload"
        description={`Are you sure you want to delete "${selectedUpload?.file_name}"? This will remove the file from both the database and storage. This action cannot be undone.`}
        confirmLabel="Delete Upload"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

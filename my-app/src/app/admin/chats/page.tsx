/**
 * Admin Chats Page
 *
 * Chat moderation with tabs: All, Recent
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatsTable } from "@/components/admin/chats/chats-table";
import { SearchFilterBar } from "@/components/admin/shared/search-filter-bar";
import { PaginationControls } from "@/components/admin/shared/pagination-controls";
import { ConfirmationDialog } from "@/components/admin/shared/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import type { EnrichedChat } from "@/types/admin";

export default function AdminChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<EnrichedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "recent">("all");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<EnrichedChat | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch chats
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
        filter: activeTab,
        search,
      });

      const res = await fetch(`/api/admin/chats?${params}`);
      const { data } = await res.json();

      setChats(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch chats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentPage, activeTab, search]);

  // Handle view chat
  const handleViewChat = (chat: EnrichedChat) => {
    router.push(`/admin/chats/${chat.id}`);
  };

  // Handle delete chat
  const handleDeleteChat = async () => {
    if (!selectedChat) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/chats/${selectedChat.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Deleted by admin via dashboard",
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Chat deleted successfully",
        });
        fetchChats();
      } else {
        throw new Error("Failed to delete chat");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedChat(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold mb-2">Chat Moderation</h1>
        <p className="text-muted-foreground font-sans">
          Verwalte und moderiere Chat-Konversationen
        </p>
      </div>

      {/* Search */}
      <SearchFilterBar
        onSearchChange={setSearch}
        placeholder="Suche nach Titel oder Benutzer..."
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="rounded-[6px]">
          <TabsTrigger value="all" className="rounded-[4px]">
            All Chats
          </TabsTrigger>
          <TabsTrigger value="recent" className="rounded-[4px]">
            Recent (24h)
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <ChatsTable
            chats={chats}
            isLoading={isLoading}
            onViewChat={handleViewChat}
            onDeleteChat={(chat) => {
              setSelectedChat(chat);
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
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        description={`Are you sure you want to delete this chat? This will soft-delete the chat and all its messages. The user will no longer see this conversation.`}
        confirmLabel="Delete Chat"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

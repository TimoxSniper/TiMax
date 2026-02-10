"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  Clock,
  Eye,
  Trash2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TIME_FILTERS = [
  { value: "", label: "Alle Zeit" },
  { value: "today", label: "Heute" },
  { value: "week", label: "Letzte 7 Tage" },
  { value: "month", label: "Letzte 30 Tage" },
];

export default function AdminChats() {
  const {
    chats,
    filteredChats,
    chatsPagination,
    isChatsLoading,
    isChatsInitialLoad,
    chatsCurrentPage,
    chatsSearchQuery,
    fetchChats,
    setChatsCurrentPage,
    setChatsSearchQuery,
    deleteChat,
  } = useAdmin();

  const [timeFilter, setTimeFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isChatsInitialLoad) {
      fetchChats(1, undefined, timeFilter || undefined);
    }
  }, [fetchChats, isChatsInitialLoad, timeFilter]);

  const handleSearch = (value: string) => {
    setChatsSearchQuery(value);
  };

  const handleTimeFilter = (value: string) => {
    setTimeFilter(value);
    setChatsCurrentPage(1);
    fetchChats(1, undefined, value || undefined);
  };

  const handlePageChange = (page: number) => {
    setChatsCurrentPage(page);
    fetchChats(page, undefined, timeFilter || undefined);
  };

  const handleDeleteClick = (chatId: string) => {
    setChatToDelete(chatId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Chat Management</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie alle Chats und moderieren Sie Inhalte
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Nach Titel oder User ID suchen..."
                  value={chatsSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <Select value={timeFilter} onValueChange={handleTimeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Zeit filtern" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_FILTERS.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isChatsLoading && isChatsInitialLoad ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  {chatsSearchQuery || timeFilter
                    ? "Keine Chats gefunden"
                    : "Keine Chats vorhanden"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titel</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Nachrichten</TableHead>
                        <TableHead>Erstellt am</TableHead>
                        <TableHead>Aktualisiert am</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChats.map((chat) => (
                        <TableRow key={chat.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="text-muted-foreground h-4 w-4 shrink-0" />
                              <span className="max-w-[200px] truncate font-medium">
                                {chat.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground text-xs">
                              {chat.user_id.slice(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MessageSquare className="text-muted-foreground h-4 w-4" />
                              {chat.messageCount || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="text-muted-foreground h-4 w-4" />
                              {formatDateTime(chat.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="text-muted-foreground h-4 w-4" />
                              {formatDateTime(chat.updated_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/chats/${chat.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(chat.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {chatsPagination && chatsPagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Seite {chatsPagination.page} von {chatsPagination.totalPages} (
                      {chatsPagination.total} Chats)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(chatsCurrentPage - 1)}
                        disabled={chatsCurrentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Zurück
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(chatsCurrentPage + 1)}
                        disabled={chatsCurrentPage >= (chatsPagination.totalPages || 0)}
                      >
                        Weiter
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-destructive h-5 w-5" />
              Chat löschen?
            </DialogTitle>
            <DialogDescription>
              Dies wird den Chat und alle zugehörigen Nachrichten dauerhaft löschen. Diese Aktion
              kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

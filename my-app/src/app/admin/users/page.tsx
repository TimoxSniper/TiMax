"use client";

import { useEffect } from "react";
import { useAdmin } from "@/contexts/admin-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Shield,
  User,
  Calendar,
  MessageSquare,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { formatDateTime } from "@/lib/date-utils";

export default function AdminUsers() {
  const {
    filteredUsers,
    usersPagination,
    isUsersLoading,
    isUsersInitialLoad,
    usersCurrentPage,
    usersSearchQuery,
    fetchUsers,
    setUsersCurrentPage,
    setUsersSearchQuery,
  } = useAdmin();

  useEffect(() => {
    if (isUsersInitialLoad) {
      fetchUsers(1);
    }
  }, [fetchUsers, isUsersInitialLoad]);

  const handleSearch = (value: string) => {
    setUsersSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setUsersCurrentPage(page);
    fetchUsers(page);
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const csrfResult = await fetch("/api/csrf");
      if (!csrfResult.ok) throw new Error("CSRF Error");
      const { csrfToken } = await csrfResult.json();

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Update failed");

      await fetchUsers(usersCurrentPage);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Benutzerverwaltung</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Benutzer und deren Rollen</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Nach Name, Email oder ID suchen..."
                  value={usersSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isUsersLoading && isUsersInitialLoad ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  {usersSearchQuery ? "Keine Benutzer gefunden" : "Keine Benutzer vorhanden"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benutzer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead>Erstellt am</TableHead>
                        <TableHead>Chats</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="text-muted-foreground bg-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                {user.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  ID: {user.userId.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="text-muted-foreground h-4 w-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.role === "admin" ? (
                              <Badge className="gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <User className="h-3 w-3" />
                                User
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="text-muted-foreground h-4 w-4" />
                              {user.createdAt ? formatDateTime(user.createdAt) : "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MessageSquare className="text-muted-foreground h-4 w-4" />
                              {user.chatCount}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRoleChange(
                                  user.userId,
                                  user.role === "admin" ? "user" : "admin"
                                )
                              }
                            >
                              {user.role === "admin" ? (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Admin entfernen
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Admin machen
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {usersPagination && usersPagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Seite {usersPagination.page} von {usersPagination.totalPages} (
                      {usersPagination.total} Benutzer)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(usersCurrentPage - 1)}
                        disabled={usersCurrentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Zurück
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(usersCurrentPage + 1)}
                        disabled={usersCurrentPage >= (usersPagination.totalPages || 0)}
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
  );
}

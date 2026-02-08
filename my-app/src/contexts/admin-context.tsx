"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { logger } from "@/lib/logger";

export interface AdminStats {
  totalUsers: number;
  totalChats: number;
  totalMessages: number;
  totalUploads: number;
  uploadsByStatus: Record<string, number>;
  uploadsByType: Record<string, number>;
}

export interface AdminUser {
  userId: string;
  chatCount: number;
  uploadCount: number;
  lastActivity: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}

export interface AdminChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

export interface AdminUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminContextType {
  // Stats
  stats: AdminStats | null;
  isStatsLoading: boolean;
  fetchStats: () => Promise<void>;

  // Users
  users: AdminUser[];
  filteredUsers: AdminUser[];
  usersPagination: Pagination | null;
  isUsersLoading: boolean;
  isUsersInitialLoad: boolean;
  usersCurrentPage: number;
  usersSearchQuery: string;
  fetchUsers: (page: number) => Promise<void>;
  setUsersCurrentPage: (page: number) => void;
  setUsersSearchQuery: (query: string) => void;

  // Chats
  chats: AdminChat[];
  filteredChats: AdminChat[];
  chatsPagination: Pagination | null;
  isChatsLoading: boolean;
  isChatsInitialLoad: boolean;
  chatsCurrentPage: number;
  chatsSearchQuery: string;
  fetchChats: (page: number, userId?: string, timeFilter?: string) => Promise<void>;
  setChatsCurrentPage: (page: number) => void;
  setChatsSearchQuery: (query: string) => void;
  deleteChat: (chatId: string) => Promise<void>;

  // Uploads
  uploads: AdminUpload[];
  filteredUploads: AdminUpload[];
  uploadsPagination: Pagination | null;
  isUploadsLoading: boolean;
  isUploadsInitialLoad: boolean;
  uploadsCurrentPage: number;
  uploadsStatusFilter: string;
  uploadsSearchQuery: string;
  fetchUploads: (page: number, status?: string, userId?: string) => Promise<void>;
  setUploadsCurrentPage: (page: number) => void;
  setUploadsStatusFilter: (status: string) => void;
  setUploadsSearchQuery: (query: string) => void;
  deleteUpload: (uploadId: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

interface AdminProviderProps {
  children: ReactNode;
  onToast?: (message: string, type: "success" | "error" | "info") => void;
}

export function AdminProvider({ children, onToast }: AdminProviderProps) {
  // Stats State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Users State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isUsersInitialLoad, setIsUsersInitialLoad] = useState(true);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [usersSearchQuery, setUsersSearchQuery] = useState("");

  // Chats State
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<AdminChat[]>([]);
  const [chatsPagination, setChatsPagination] = useState<Pagination | null>(null);
  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [isChatsInitialLoad, setIsChatsInitialLoad] = useState(true);
  const [chatsCurrentPage, setChatsCurrentPage] = useState(1);
  const [chatsSearchQuery, setChatsSearchQuery] = useState("");

  // Uploads State
  const [uploads, setUploads] = useState<AdminUpload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<AdminUpload[]>([]);
  const [uploadsPagination, setUploadsPagination] = useState<Pagination | null>(null);
  const [isUploadsLoading, setIsUploadsLoading] = useState(false);
  const [isUploadsInitialLoad, setIsUploadsInitialLoad] = useState(true);
  const [uploadsCurrentPage, setUploadsCurrentPage] = useState(1);
  const [uploadsStatusFilter, setUploadsStatusFilter] = useState("");
  const [uploadsSearchQuery, setUploadsSearchQuery] = useState("");

  // Helper function for API calls
  const apiCall = useCallback(
    async (
      url: string,
      options?: RequestInit
    ): Promise<{
      success: boolean;
      data?: {
        stats?: AdminStats;
        users?: AdminUser[];
        pagination?: Pagination;
        chats?: AdminChat[];
        uploads?: AdminUpload[];
        csrfToken?: string;
      };
      error?: string;
    }> => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || "Fehler bei der Anfrage",
          };
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        logger.error(`API Call failed: ${url}`, error);
        return {
          success: false,
          error: "Netzwerkfehler",
        };
      }
    },
    []
  );

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const result = await apiCall("/api/admin/dashboard");
      if (result.success && result.data) {
        setStats(result.data.stats || null);
      } else {
        onToast?.(result.error || "Statistiken konnten nicht geladen werden", "error");
      }
    } finally {
      setIsStatsLoading(false);
    }
  }, [apiCall, onToast]);

  // Fetch Users
  const fetchUsers = useCallback(
    async (page: number) => {
      setIsUsersLoading(true);
      try {
        const result = await apiCall(`/api/admin/users?page=${page}&limit=25`);
        if (result.success && result.data) {
          setUsers(result.data.users || []);
          setFilteredUsers(result.data.users || []);
          setUsersPagination(result.data.pagination || null);
        } else {
          onToast?.(result.error || "Benutzer konnten nicht geladen werden", "error");
        }
      } finally {
        setIsUsersLoading(false);
        setIsUsersInitialLoad(false);
      }
    },
    [apiCall, onToast]
  );

  // Users Search Filter
  React.useEffect(() => {
    if (!usersSearchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = usersSearchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const userId = user.userId.toLowerCase();

      return fullName.includes(query) || email.includes(query) || userId.includes(query);
    });

    setFilteredUsers(filtered);
  }, [usersSearchQuery, users]);

  // Fetch Chats
  const fetchChats = useCallback(
    async (page: number, userId?: string, timeFilter?: string) => {
      setIsChatsLoading(true);
      try {
        let url = `/api/admin/chats?page=${page}&limit=20`;
        if (userId) {
          url += `&userId=${encodeURIComponent(userId)}`;
        }
        if (timeFilter) {
          url += `&timeFilter=${encodeURIComponent(timeFilter)}`;
        }

        const result = await apiCall(url);
        if (result.success && result.data) {
          setChats(result.data.chats || []);
          setFilteredChats(result.data.chats || []);
          setChatsPagination(result.data.pagination || null);
        } else {
          onToast?.(result.error || "Chats konnten nicht geladen werden", "error");
        }
      } finally {
        setIsChatsLoading(false);
        setIsChatsInitialLoad(false);
      }
    },
    [apiCall, onToast]
  );

  // Chats Search Filter
  React.useEffect(() => {
    if (!chatsSearchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const query = chatsSearchQuery.toLowerCase();
    const filtered = chats.filter((chat) => {
      const title = chat.title.toLowerCase();
      const userId = chat.user_id.toLowerCase();

      return title.includes(query) || userId.includes(query);
    });

    setFilteredChats(filtered);
  }, [chatsSearchQuery, chats]);

  // Delete Chat
  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        const csrfResult = await apiCall("/api/csrf");
        if (!csrfResult.success) {
          throw new Error("CSRF-Token konnte nicht abgerufen werden");
        }

        const result = await apiCall(`/api/admin/chats/${chatId}`, {
          method: "DELETE",
          headers: {
            "x-csrf-token": csrfResult.data!.csrfToken!,
          },
        });

        if (result.success) {
          onToast?.("Chat wurde gelöscht", "success");
          fetchChats(chatsCurrentPage);
        } else {
          onToast?.(result.error || "Chat konnte nicht gelöscht werden", "error");
        }
      } catch (error) {
        logger.error("Failed to delete chat:", error);
        onToast?.("Chat konnte nicht gelöscht werden", "error");
      }
    },
    [apiCall, onToast, fetchChats, chatsCurrentPage]
  );

  // Fetch Uploads
  const fetchUploads = useCallback(
    async (page: number, status?: string, userId?: string) => {
      setIsUploadsLoading(true);
      try {
        let url = `/api/admin/uploads?page=${page}&limit=20`;
        if (userId) {
          url += `&userId=${encodeURIComponent(userId)}`;
        }
        if (status) {
          url += `&status=${status}`;
        }

        const result = await apiCall(url);
        if (result.success && result.data) {
          setUploads(result.data.uploads || []);
          setFilteredUploads(result.data.uploads || []);
          setUploadsPagination(result.data.pagination || null);
        } else {
          onToast?.(result.error || "Uploads konnten nicht geladen werden", "error");
        }
      } finally {
        setIsUploadsLoading(false);
        setIsUploadsInitialLoad(false);
      }
    },
    [apiCall, onToast]
  );

  // Uploads Search Filter
  React.useEffect(() => {
    if (!uploadsSearchQuery.trim()) {
      setFilteredUploads(uploads);
      return;
    }

    const query = uploadsSearchQuery.toLowerCase();
    const filtered = uploads.filter((upload) => {
      const fileName = upload.file_name.toLowerCase();
      const userId = upload.user_id.toLowerCase();
      const fileType = (upload.file_type || "").toLowerCase();

      return fileName.includes(query) || userId.includes(query) || fileType.includes(query);
    });

    setFilteredUploads(filtered);
  }, [uploadsSearchQuery, uploads]);

  // Delete Upload
  const deleteUpload = useCallback(
    async (uploadId: string) => {
      try {
        const csrfResult = await apiCall("/api/csrf");
        if (!csrfResult.success) {
          throw new Error("CSRF-Token konnte nicht abgerufen werden");
        }

        const result = await apiCall(`/api/admin/uploads/${uploadId}`, {
          method: "DELETE",
          headers: {
            "x-csrf-token": csrfResult.data!.csrfToken!,
          },
        });

        if (result.success) {
          onToast?.("Upload wurde gelöscht", "success");
          fetchUploads(uploadsCurrentPage, uploadsStatusFilter);
        } else {
          onToast?.(result.error || "Upload konnte nicht gelöscht werden", "error");
        }
      } catch (error) {
        logger.error("Failed to delete upload:", error);
        onToast?.("Upload konnte nicht gelöscht werden", "error");
      }
    },
    [apiCall, onToast, fetchUploads, uploadsCurrentPage, uploadsStatusFilter]
  );

  const value: AdminContextType = {
    // Stats
    stats,
    isStatsLoading,
    fetchStats,

    // Users
    users,
    filteredUsers,
    usersPagination,
    isUsersLoading,
    isUsersInitialLoad,
    usersCurrentPage,
    usersSearchQuery,
    fetchUsers,
    setUsersCurrentPage,
    setUsersSearchQuery,

    // Chats
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

    // Uploads
    uploads,
    filteredUploads,
    uploadsPagination,
    isUploadsLoading,
    isUploadsInitialLoad,
    uploadsCurrentPage,
    uploadsStatusFilter,
    uploadsSearchQuery,
    fetchUploads,
    setUploadsCurrentPage,
    setUploadsStatusFilter,
    setUploadsSearchQuery,
    deleteUpload,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

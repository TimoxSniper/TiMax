/**
 * Admin Dashboard TypeScript Types
 *
 * Comprehensive type definitions for the TiMax Admin Dashboard
 */

import type { Database } from "@/lib/supabase/database.types";

// ============================================
// DATABASE TABLE TYPES
// ============================================

export type AdminLog = Database["public"]["Tables"]["admin_logs"]["Row"];
export type AdminLogInsert = Database["public"]["Tables"]["admin_logs"]["Insert"];

export type UserBan = Database["public"]["Tables"]["user_bans"]["Row"];
export type UserBanInsert = Database["public"]["Tables"]["user_bans"]["Insert"];

export type Chat = Database["public"]["Tables"]["chats"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Upload = Database["public"]["Tables"]["uploads"]["Row"];

// ============================================
// CLERK USER TYPES
// ============================================

export interface ClerkUserInfo {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  imageUrl: string;
  createdAt: Date;
  lastSignInAt: Date | null;
  publicMetadata: {
    role?: string;
    banned?: boolean;
    banReason?: string;
    banExpiresAt?: string;
  };
}

// ============================================
// ENRICHED DATA TYPES (DB + Clerk)
// ============================================

export interface EnrichedChat extends Chat {
  user: ClerkUserInfo;
  messageCount: number;
  lastMessageAt: string | null;
}

export interface EnrichedUpload extends Upload {
  user: ClerkUserInfo;
}

export interface EnrichedAdminLog extends AdminLog {
  adminUser?: ClerkUserInfo;
}

// ============================================
// DASHBOARD STATS TYPES
// ============================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number; // Last 7 days
  totalChats: number;
  totalMessages: number;
  totalUploads: number;
  uploadsByStatus: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
  recentActivity: RecentActivity[];
  systemHealth: SystemHealth;
}

export interface RecentActivity {
  id: string;
  type: "user_signup" | "chat_created" | "upload_completed" | "admin_action";
  description: string;
  userId?: string;
  user?: ClerkUserInfo;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  databaseConnected: boolean;
  storageConnected: boolean;
  apiResponseTime: number; // ms
  activeUsers: number;
  uptime: number; // seconds
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface UsageTrend {
  date: string;
  activeUsers: number;
  newUploads: number;
  newChats: number;
}

export interface GrowthMetric {
  date: string;
  cumulativeUsers: number;
  newUsers: number;
}

export interface FileTypeDistribution {
  fileType: string;
  count: number;
  percentage: number;
}

// ============================================
// USER MANAGEMENT TYPES
// ============================================

export interface UserWithStats extends ClerkUserInfo {
  totalUploads: number;
  totalChats: number;
  lastActive: Date | null;
  isBanned: boolean;
  banInfo?: UserBan;
}

export interface BanUserPayload {
  userId: string;
  reason: string;
  banType: "temporary" | "permanent";
  expiresAt?: string; // ISO date string for temporary bans
  metadata?: Record<string, unknown>;
}

export interface UnbanUserPayload {
  userId: string;
  reason: string;
}

// ============================================
// CONTENT MODERATION TYPES
// ============================================

export interface ChatWithDetails extends EnrichedChat {
  messages: Message[];
}

export interface UploadWithDetails extends EnrichedUpload {
  transcriptPreview?: string;
  metadataPreview?: Record<string, unknown>;
}

export interface DeleteContentPayload {
  id: string;
  reason: string;
  deleteFromStorage?: boolean; // For uploads
}

// ============================================
// PAGINATION & FILTERING TYPES
// ============================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================
// ADMIN ACTION TYPES
// ============================================

export type AdminActionType =
  | "ban_user"
  | "unban_user"
  | "delete_chat"
  | "delete_upload"
  | "view_user"
  | "view_chat"
  | "view_upload"
  | "export_data"
  | "update_settings";

export type AdminTargetType = "user" | "chat" | "upload" | "system" | null;

export interface AdminAction {
  actionType: AdminActionType;
  targetType: AdminTargetType;
  targetId?: string;
  details?: Record<string, unknown>;
}

// ============================================
// AUTH & AUTHORIZATION TYPES
// ============================================

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  user?: ClerkUserInfo;
  response?: Response; // Error response if not authorized
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface StatusBadgeProps {
  status: "completed" | "processing" | "failed" | "pending" | "cancelled" | "active" | "banned";
  label?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

// ============================================
// FEATURE FLAGS
// ============================================

export interface FeatureFlags {
  enableUserBanning: boolean;
  enableContentModeration: boolean;
  enableAnalytics: boolean;
  enableExport: boolean;
  enableRealTimeUpdates: boolean;
}

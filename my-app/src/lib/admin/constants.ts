/**
 * Admin Dashboard Constants
 *
 * Centralized configuration and constants for the admin dashboard
 */

// Pagination
export const ADMIN_PAGE_SIZE = 50;
export const ADMIN_MAX_PAGE_SIZE = 100;

// Action types for logging
export const ADMIN_ACTION_TYPES = {
  BAN_USER: "ban_user",
  UNBAN_USER: "unban_user",
  DELETE_CHAT: "delete_chat",
  DELETE_UPLOAD: "delete_upload",
  VIEW_USER: "view_user",
  VIEW_CHAT: "view_chat",
  VIEW_UPLOAD: "view_upload",
  EXPORT_DATA: "export_data",
  UPDATE_SETTINGS: "update_settings",
} as const;

// Target types for logging
export const ADMIN_TARGET_TYPES = {
  USER: "user",
  CHAT: "chat",
  UPLOAD: "upload",
  SYSTEM: "system",
} as const;

// Ban types
export const BAN_TYPES = {
  TEMPORARY: "temporary",
  PERMANENT: "permanent",
} as const;

// Upload statuses
export const UPLOAD_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

// Time ranges for analytics
export const TIME_RANGES = {
  "24H": { label: "Last 24 Hours", hours: 24 },
  "7D": { label: "Last 7 Days", days: 7 },
  "30D": { label: "Last 30 Days", days: 30 },
  "90D": { label: "Last 90 Days", days: 90 },
} as const;

// Feature flags from environment
export const FEATURE_FLAGS = {
  enableUserBanning: process.env.FEATURE_ENABLE_USER_BANNING !== "false",
  enableContentModeration: process.env.FEATURE_ENABLE_CONTENT_MODERATION !== "false",
  enableAnalytics: process.env.FEATURE_ENABLE_ANALYTICS !== "false",
  enableExport: process.env.FEATURE_ENABLE_EXPORT === "true",
  enableRealTimeUpdates: process.env.FEATURE_ENABLE_REALTIME_UPDATES !== "false",
};

// Navigation items
export const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "Users",
  },
  {
    label: "Chats",
    href: "/admin/chats",
    icon: "MessageSquare",
  },
  {
    label: "Uploads",
    href: "/admin/uploads",
    icon: "Upload",
  },
  {
    label: "System",
    href: "/admin/system",
    icon: "Settings",
  },
] as const;

// Tabs for each section
export const USER_TABS = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Banned" },
] as const;

export const CHAT_TABS = [
  { value: "all", label: "All Chats" },
  { value: "recent", label: "Recent" },
] as const;

export const UPLOAD_TABS = [
  { value: "all", label: "All Uploads" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
] as const;

export const SYSTEM_TABS = [
  { value: "health", label: "Health" },
  { value: "logs", label: "Error Logs" },
  { value: "flags", label: "Feature Flags" },
] as const;

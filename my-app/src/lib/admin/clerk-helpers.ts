/**
 * Clerk User Data Helpers
 *
 * Batch fetching and caching of Clerk user data for admin dashboard
 * Prevents N+1 query problems when displaying user lists
 */

import { clerkClient } from "@clerk/nextjs/server";
import type { ClerkUserInfo } from "@/types/admin";

/**
 * Fetch a single Clerk user by ID
 * Returns standardized user info or null if not found
 */
export async function getClerkUser(userId: string): Promise<ClerkUserInfo | null> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.id,
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
      publicMetadata: user.publicMetadata as {
        role?: string;
        banned?: boolean;
        banReason?: string;
        banExpiresAt?: string;
      },
    };
  } catch (error) {
    console.error(`Failed to fetch Clerk user ${userId}:`, error);
    return null;
  }
}

/**
 * Batch fetch Clerk users by IDs
 * Fetches up to 100 users in a single request
 * Returns a Map of userId -> ClerkUserInfo for easy lookup
 *
 * @param userIds - Array of user IDs to fetch (max 100)
 * @returns Map of userId to ClerkUserInfo
 */
export async function getClerkUsers(userIds: string[]): Promise<Map<string, ClerkUserInfo>> {
  const userMap = new Map<string, ClerkUserInfo>();

  if (userIds.length === 0) {
    return userMap;
  }

  try {
    const clerk = await clerkClient();

    // Clerk's getUser() doesn't support batch fetching directly
    // But we can use getUserList with userId filter
    // Split into chunks of 100 (Clerk's limit)
    const chunks = chunkArray(userIds, 100);

    for (const chunk of chunks) {
      // Fetch users in this chunk
      const { data: users } = await clerk.users.getUserList({
        userId: chunk,
        limit: 100,
      });

      // Add to map
      users.forEach((user) => {
        userMap.set(user.id, {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress ?? null,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.id,
          imageUrl: user.imageUrl,
          createdAt: new Date(user.createdAt),
          lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
          publicMetadata: user.publicMetadata as {
            role?: string;
            banned?: boolean;
            banReason?: string;
            banExpiresAt?: string;
          },
        });
      });
    }

    // For any users not found, create placeholder entries
    userIds.forEach((userId) => {
      if (!userMap.has(userId)) {
        userMap.set(userId, createPlaceholderUser(userId));
      }
    });

    return userMap;
  } catch (error) {
    console.error("Failed to batch fetch Clerk users:", error);

    // On error, create placeholders for all users
    userIds.forEach((userId) => {
      userMap.set(userId, createPlaceholderUser(userId));
    });

    return userMap;
  }
}

/**
 * Fetch all users from Clerk with pagination
 * Use this for the Users management page
 *
 * @param options - Pagination and filter options
 * @returns Array of ClerkUserInfo with total count
 */
export async function getAllClerkUsers(options: {
  limit?: number;
  offset?: number;
  query?: string;
  orderBy?: "created_at" | "last_sign_in_at";
} = {}): Promise<{ users: ClerkUserInfo[]; totalCount: number }> {
  try {
    const clerk = await clerkClient();

    const { limit = 50, offset = 0, query, orderBy = "created_at" } = options;

    // Build query parameters
    const params: {
      limit: number;
      offset: number;
      query?: string;
      orderBy?: string;
    } = {
      limit,
      offset,
    };

    if (query) {
      params.query = query;
    }

    if (orderBy === "last_sign_in_at") {
      params.orderBy = "-last_sign_in_at"; // Descending
    } else {
      params.orderBy = "-created_at"; // Descending
    }

    const { data: users, totalCount } = await clerk.users.getUserList(params);

    const clerkUsers: ClerkUserInfo[] = users.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.id,
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
      publicMetadata: user.publicMetadata as {
        role?: string;
        banned?: boolean;
        banReason?: string;
        banExpiresAt?: string;
      },
    }));

    return {
      users: clerkUsers,
      totalCount,
    };
  } catch (error) {
    console.error("Failed to fetch all Clerk users:", error);
    return { users: [], totalCount: 0 };
  }
}

/**
 * Create a placeholder user for cases where Clerk user is not found
 * This prevents errors when displaying lists
 */
function createPlaceholderUser(userId: string): ClerkUserInfo {
  return {
    id: userId,
    email: null,
    firstName: null,
    lastName: null,
    fullName: `User ${userId.substring(0, 8)}`,
    imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
    createdAt: new Date(),
    lastSignInAt: null,
    publicMetadata: {},
  };
}

/**
 * Split array into chunks of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Format user display name
 * Falls back to email or ID if name not available
 */
export function formatUserDisplayName(user: ClerkUserInfo): string {
  if (user.fullName && user.fullName !== user.id) {
    return user.fullName;
  }
  if (user.email) {
    return user.email;
  }
  return `User ${user.id.substring(0, 8)}`;
}

/**
 * Check if user is banned based on metadata
 */
export function isUserBanned(user: ClerkUserInfo): boolean {
  if (!user.publicMetadata.banned) {
    return false;
  }

  // Check if temporary ban has expired
  if (user.publicMetadata.banExpiresAt) {
    const expiryDate = new Date(user.publicMetadata.banExpiresAt);
    if (expiryDate < new Date()) {
      return false; // Ban has expired
    }
  }

  return true;
}

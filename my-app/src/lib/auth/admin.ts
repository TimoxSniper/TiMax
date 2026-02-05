import { currentUser } from "@clerk/nextjs/server";

/**
 * Prüft ob der aktuelle Benutzer Admin-Rechte hat
 * Admin-Status wird über Clerk publicMetadata.role = "admin" verwaltet
 * 
 * Einrichtung im Clerk Dashboard:
 * 1. Users -> Benutzer auswählen -> Edit Metadata
 * 2. Public metadata: { "role": "admin" }
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;
    
    return user.publicMetadata?.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Wirft einen Fehler wenn der Benutzer kein Admin ist
 * Für Server Actions und API Routes
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Gibt Admin-Status und User-ID zurück
 * Nützlich für kombinierte Auth-Checks
 */
export async function getAdminStatus(): Promise<{
  isAdmin: boolean;
  userId: string | null;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { isAdmin: false, userId: null };
    }
    
    return {
      isAdmin: user.publicMetadata?.role === "admin",
      userId: user.id,
    };
  } catch {
    return { isAdmin: false, userId: null };
  }
}

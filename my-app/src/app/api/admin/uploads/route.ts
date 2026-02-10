/**
 * Admin Uploads API Route
 *
 * GET - List all uploads with pagination and filters
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient } from "@/lib/admin/auth";
import { getClerkUsers } from "@/lib/admin/clerk-helpers";
import type { EnrichedUpload, PaginatedResponse } from "@/types/admin";

export async function GET(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const filter = searchParams.get("filter") || "all"; // all, processing, failed
    const search = searchParams.get("search") || "";

    const supabase = getAdminSupabaseClient();

    // Build query
    let query = supabase
      .from("uploads")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    // Apply status filters
    if (filter === "processing") {
      query = query.eq("status", "processing");
    } else if (filter === "failed") {
      query = query.eq("status", "failed");
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: uploads, error, count } = await query;

    if (error) throw error;

    if (!uploads || uploads.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          data: [],
          meta: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        } as PaginatedResponse<EnrichedUpload>,
      });
    }

    // Get unique user IDs
    const userIds = [...new Set(uploads.map((upload) => upload.user_id))];

    // Batch fetch Clerk users
    const clerkUsers = await getClerkUsers(userIds);

    // Enrich uploads with user data
    const enrichedUploads: EnrichedUpload[] = uploads.map((upload) => ({
      ...upload,
      user: clerkUsers.get(upload.user_id)!,
    }));

    // Apply search filter
    let filteredUploads = enrichedUploads;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUploads = enrichedUploads.filter(
        (upload) =>
          upload.file_name.toLowerCase().includes(searchLower) ||
          upload.user.fullName.toLowerCase().includes(searchLower) ||
          upload.user.email?.toLowerCase().includes(searchLower)
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    const response: PaginatedResponse<EnrichedUpload> = {
      data: filteredUploads,
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages,
      },
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Uploads API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch uploads",
      },
      { status: 500 }
    );
  }
}

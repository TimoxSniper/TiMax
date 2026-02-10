/**
 * Admin Upload Detail API Route
 *
 * GET - Get upload details
 * DELETE - Soft delete upload and remove from storage
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, getAdminSupabaseClient, logAdminAction } from "@/lib/admin/auth";
import { getClerkUser } from "@/lib/admin/clerk-helpers";
import { createClient } from "@supabase/supabase-js";
import type { UploadWithDetails } from "@/types/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id: uploadId } = await params;
    const supabase = getAdminSupabaseClient();

    // Fetch upload
    const { data: upload, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .is("deleted_at", null)
      .single();

    if (error || !upload) {
      return NextResponse.json(
        { success: false, error: "Upload not found" },
        { status: 404 }
      );
    }

    // Fetch user info
    const user = await getClerkUser(upload.user_id);

    const uploadWithDetails: UploadWithDetails = {
      ...upload,
      user: user!,
      transcriptPreview: upload.transcript
        ? upload.transcript.substring(0, 500) + (upload.transcript.length > 500 ? "..." : "")
        : undefined,
      metadataPreview: upload.metadata || undefined,
    };

    return NextResponse.json({
      success: true,
      data: uploadWithDetails,
    });
  } catch (error) {
    console.error("Upload detail API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to fetch upload details",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await checkAdminAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id: uploadId } = await params;
    const body = await request.json();
    const { reason } = body;

    const supabase = getAdminSupabaseClient();

    // Check if upload exists
    const { data: upload, error: fetchError } = await supabase
      .from("uploads")
      .select("*")
      .eq("id", uploadId)
      .is("deleted_at", null)
      .single();

    if (fetchError || !upload) {
      return NextResponse.json(
        { success: false, error: "Upload not found" },
        { status: 404 }
      );
    }

    // Soft delete in database
    const { error: deleteError } = await supabase
      .from("uploads")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: authResult.userId!,
      })
      .eq("id", uploadId);

    if (deleteError) throw deleteError;

    // Remove from Supabase Storage if storage_path exists
    if (upload.storage_path) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const storageClient = createClient(supabaseUrl, supabaseServiceKey);

        await storageClient.storage.from("uploads").remove([upload.storage_path]);
      } catch (storageError) {
        console.error("Failed to delete from storage:", storageError);
        // Continue - soft delete succeeded, storage cleanup failed (non-critical)
      }
    }

    // Log action
    await logAdminAction(
      authResult.userId!,
      authResult.user!.email ?? "Unknown",
      {
        actionType: "delete_upload",
        targetType: "upload",
        targetId: uploadId,
        details: {
          reason: reason || "Deleted by admin",
          userId: upload.user_id,
          fileName: upload.file_name,
          fileSize: upload.file_size,
        },
      },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Upload deleted successfully",
    });
  } catch (error) {
    console.error("Delete upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error",
        message: "Failed to delete upload",
      },
      { status: 500 }
    );
  }
}

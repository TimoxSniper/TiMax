import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";

// DELETE: Upload-Eintrag löschen
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const supabase = await createClient();

        // Lösche Upload
        const { error } = await supabase
            .from("uploads")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);

        if (error) {
            console.error("[Upload API] Fehler beim Löschen:", error);
            throw error;
        }

        return NextResponse.json({ success: true, message: "Datei-Eintrag gelöscht" });
    } catch (error) {
        Sentry.captureException(error, {
            tags: { api_route: "/api/uploads/[id]" },
        });

        return NextResponse.json(
            { success: false, error: "Fehler beim Löschen der Datei" },
            { status: 500 }
        );
    }
}

// GET: Einzelnen Upload-Eintrag laden (z.B. für Transkript-Detail)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const supabase = await createClient();

        const { data: upload, error } = await supabase
            .from("uploads")
            .select("*")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("[Upload API] Fehler beim Laden:", error);
            return NextResponse.json(
                { success: false, error: "Datei nicht gefunden" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, upload });
    } catch (error) {
        Sentry.captureException(error, {
            tags: { api_route: "/api/uploads/[id]" },
        });

        return NextResponse.json(
            { success: false, error: "Fehler beim Laden der Datei" },
            { status: 500 }
        );
    }
}

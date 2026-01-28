import { NextRequest, NextResponse } from "next/server";

const N8N_UPLOAD_WEBHOOK_URL = process.env.N8N_UPLOAD_WEBHOOK_URL;

if (!N8N_UPLOAD_WEBHOOK_URL) {
  console.warn("WARNUNG: N8N_UPLOAD_WEBHOOK_URL nicht gesetzt!");
}

export async function POST(request: NextRequest) {
  try {
    if (!N8N_UPLOAD_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, error: "Upload-Webhook nicht konfiguriert" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Keine Datei bereitgestellt" },
        { status: 400 }
      );
    }

    // Erstelle neue FormData für n8n
    // n8n Form-Trigger erwartet das Feld "Audio/Video Datei"
    const n8nFormData = new FormData();
    n8nFormData.append("Audio/Video Datei", file);

    // Upload zu n8n Form-Webhook
    const response = await fetch(N8N_UPLOAD_WEBHOOK_URL, {
      method: "POST",
      body: n8nFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n Upload Fehler: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // n8n Response-Struktur anpassen
    let status = "✅ Erfolgreich gespeichert";
    let fileName = file.name;

    if (data.status) {
      status = data.status;
    } else if (Array.isArray(data) && data[0]?.json?.status) {
      status = data[0].json.status;
    } else if (data.json?.status) {
      status = data.json.status;
    }

    if (data.fileName) {
      fileName = data.fileName;
    } else if (Array.isArray(data) && data[0]?.json?.fileName) {
      fileName = data[0].json.fileName;
    } else if (data.json?.fileName) {
      fileName = data.json.fileName;
    }

    return NextResponse.json({
      success: true,
      status,
      fileName,
    });
  } catch (error) {
    console.error("Upload API Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler beim Upload",
      },
      { status: 500 }
    );
  }
}

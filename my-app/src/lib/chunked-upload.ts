/**
 * Chunked Upload Utilities
 * Für große Dateien (>100MB) - aktuell optional, aber vorbereitet
 */

import { UPLOAD_CONFIG } from "./upload-config";

export interface ChunkMetadata {
  chunkIndex: number;
  totalChunks: number;
  chunkSize: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadId: string; // Eindeutige ID für diesen Upload
}

/**
 * Teilt eine Datei in Chunks auf
 */
export function splitFileIntoChunks(file: File): Blob[] {
  const chunks: Blob[] = [];
  const chunkSize = UPLOAD_CONFIG.chunkSize;
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
}

/**
 * Erstellt Metadaten für einen Chunk
 */
export function createChunkMetadata(
  file: File,
  chunkIndex: number,
  totalChunks: number,
  uploadId: string
): ChunkMetadata {
  return {
    chunkIndex,
    totalChunks,
    chunkSize: UPLOAD_CONFIG.chunkSize,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    uploadId,
  };
}

/**
 * Validiert ob eine Datei für Chunked Upload geeignet ist
 * Aktuell: Optional, da maxFileSize bei 100MB liegt
 * Für zukünftige Erweiterung auf größere Dateien
 */
export function shouldUseChunkedUpload(fileSize: number): boolean {
  // Aktuell: Nur wenn Datei größer als normale Upload-Größe
  // In Zukunft: Wenn Datei > 100MB, dann Chunked Upload
  return fileSize > UPLOAD_CONFIG.maxFileSize;
}

/**
 * Uploadet einen einzelnen Chunk
 */
export async function uploadChunk(
  chunk: Blob,
  metadata: ChunkMetadata,
  onProgress?: (progress: number) => void
): Promise<Response> {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("metadata", JSON.stringify(metadata));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as any);
      } else {
        reject(new Error(`Chunk Upload fehlgeschlagen: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Netzwerkfehler beim Chunk Upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Chunk Upload abgebrochen"));
    });

    xhr.open("POST", "/api/upload/chunk");
    xhr.send(formData);
  });
}

/**
 * Uploadet alle Chunks einer Datei
 */
export async function uploadFileInChunks(
  file: File,
  onProgress?: (overallProgress: number) => void
): Promise<{ success: boolean; uploadId?: string; error?: string }> {
  const chunks = splitFileIntoChunks(file);
  const uploadId = crypto.randomUUID();
  const totalChunks = chunks.length;

  try {
    const uploadPromises = chunks.map((chunk, index) => {
      const metadata = createChunkMetadata(file, index, totalChunks, uploadId);
      
      return uploadChunk(chunk, metadata, (chunkProgress) => {
        // Berechne Gesamt-Progress
        if (onProgress) {
          const overallProgress = Math.round(
            ((index * 100 + chunkProgress) / totalChunks) / 100
          );
          onProgress(overallProgress);
        }
      });
    });

    await Promise.all(uploadPromises);

    // Finalisiere Upload (alle Chunks zusammensetzen)
    const finalizeResponse = await fetch("/api/upload/chunk/finalize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uploadId, fileName: file.name }),
    });

    if (!finalizeResponse.ok) {
      throw new Error("Finalisierung des Uploads fehlgeschlagen");
    }

    const result = await finalizeResponse.json();

    return {
      success: true,
      uploadId: result.uploadId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    };
  }
}


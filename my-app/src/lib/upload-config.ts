/**
 * Upload-Konfiguration für timax
 * Zentrale Konfiguration für alle Upload-Restriktionen
 */

export const UPLOAD_CONFIG = {
  // Dateigröße-Limits
  maxFileSize: 100 * 1024 * 1024, // 100 MB (konsistent mit Client-side)
  maxFileSizeBytes: 100 * 1024 * 1024,
  
  // Erlaubte Video-Formate
  allowedVideoFormats: [
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
  ],
  
  // Erlaubte Audio-Formate
  allowedAudioFormats: [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/webm',
  ],
  
  // Erlaubte Dateiendungen
  allowedExtensions: [
    '.mp4',
    '.webm',
    '.mov',
    '.mp3',
    '.wav',
    '.m4a',
  ],
  
  // Duration-Limits (in Sekunden)
  maxUploadDuration: 180 * 60, // 3 Stunden (10800 Sekunden)
  maxUploadDurationSeconds: 180 * 60,
  
  // Rate Limiting
  maxUploadsPerHour: 5,
  maxUploadsPerDay: 20,
  
  // Storage-Limits (pro User, wenn Database vorhanden)
  maxStoragePerUser: 10 * 1024 * 1024 * 1024, // 10 GB
  
  // Chunked Upload (für große Dateien)
  chunkSize: 5 * 1024 * 1024, // 5 MB pro Chunk
  maxChunks: 20, // Max 20 Chunks = 100 MB
} as const;

/**
 * Retention Policy für Dateien
 * Definiert wie lange Dateien gespeichert werden
 */
export const RETENTION_POLICY = {
  // Uploads ohne Transkript: 7 Tage
  uploadsWithoutTranscript: 7 * 24 * 60 * 60 * 1000, // 7 Tage in Millisekunden
  
  // Fertige Transkripte: 90 Tage ohne Aktivität
  transcriptsInactive: 90 * 24 * 60 * 60 * 1000, // 90 Tage in Millisekunden
  
  // Gelöschte Accounts: SOFORT alle Daten löschen
  deletedAccounts: 0, // Sofort
  
  // User kann jederzeit manuell löschen
  manualDeletion: 'always',
} as const;

/**
 * Helper-Funktion: Prüft ob Dateigröße erlaubt ist
 */
export function isFileSizeAllowed(size: number): boolean {
  return size <= UPLOAD_CONFIG.maxFileSize;
}

/**
 * Helper-Funktion: Prüft ob MIME-Type erlaubt ist
 */
export function isMimeTypeAllowed(mimeType: string): boolean {
  return [
    ...UPLOAD_CONFIG.allowedVideoFormats,
    ...UPLOAD_CONFIG.allowedAudioFormats,
  ].includes(mimeType);
}

/**
 * Helper-Funktion: Prüft ob Dateiendung erlaubt ist
 */
export function isExtensionAllowed(filename: string): boolean {
  const extension = filename
    .toLowerCase()
    .substring(filename.lastIndexOf('.'));
  return UPLOAD_CONFIG.allowedExtensions.includes(extension);
}

/**
 * Helper-Funktion: Prüft ob Duration erlaubt ist
 * Hinweis: Duration-Validierung erfordert Media-Metadaten-Extraktion
 * Diese Funktion ist eine Vorbereitung für zukünftige Implementierung
 */
export function isDurationAllowed(durationSeconds: number): boolean {
  return durationSeconds <= UPLOAD_CONFIG.maxUploadDuration;
}

/**
 * Helper-Funktion: Formatiert Dateigröße für Anzeige
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Helper-Funktion: Formatiert Duration für Anzeige
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}


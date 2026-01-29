/**
 * Virus Scanning mit VirusTotal Free Tier
 * Kostenlos: 4 Scans/Tag
 */

import VirusTotal from 'virustotal-api';

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_FREE_TIER_LIMIT = 4; // 4 Scans/Tag kostenlos

// In-Memory Counter für Free Tier (in Production: Redis oder Database)
let dailyScanCount = 0;
let lastResetDate = new Date().toDateString();

/**
 * Reset täglicher Counter
 */
function resetDailyCounter() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyScanCount = 0;
    lastResetDate = today;
  }
}

/**
 * Prüft ob Free Tier Limit erreicht ist
 */
export function isFreeTierLimitReached(): boolean {
  resetDailyCounter();
  return dailyScanCount >= VIRUSTOTAL_FREE_TIER_LIMIT;
}

/**
 * Scant eine Datei mit VirusTotal
 * 
 * @param fileBuffer - Datei als Buffer
 * @param fileName - Dateiname
 * @returns Scan-Ergebnis
 */
export async function scanFile(
  fileBuffer: Buffer,
  fileName: string
): Promise<{
  clean: boolean;
  scanId?: string;
  message: string;
  limitReached?: boolean;
}> {
  // Prüfe ob API Key vorhanden
  if (!VIRUSTOTAL_API_KEY) {
    console.warn('VirusTotal API Key nicht gesetzt - Skipping Scan');
    return {
      clean: true, // Im MVP: Erlaube Upload wenn kein API Key
      message: 'Virus-Scan nicht verfügbar (API Key fehlt)',
    };
  }

  // Prüfe Free Tier Limit
  resetDailyCounter();
  if (isFreeTierLimitReached()) {
    console.warn(`VirusTotal Free Tier Limit erreicht (${VIRUSTOTAL_FREE_TIER_LIMIT} Scans/Tag)`);
    return {
      clean: true, // Im MVP: Erlaube Upload wenn Limit erreicht
      message: `Virus-Scan Limit erreicht (${VIRUSTOTAL_FREE_TIER_LIMIT} Scans/Tag). Upload trotzdem erlaubt.`,
      limitReached: true,
    };
  }

  try {
    const vt = new VirusTotal(VIRUSTOTAL_API_KEY);

    // Upload Datei für Scan
    const scanResult = await vt.fileScan(fileBuffer, fileName);

    // Erhöhe Counter
    dailyScanCount++;

    // Prüfe Scan-Ergebnis
    if (scanResult.response_code === 1) {
      // Scan erfolgreich
      const positives = scanResult.positives || 0;
      
      if (positives === 0) {
        return {
          clean: true,
          scanId: scanResult.scan_id,
          message: 'Datei ist sauber',
        };
      } else {
        // Malware erkannt!
        return {
          clean: false,
          scanId: scanResult.scan_id,
          message: `Malware erkannt! ${positives} Scanner haben Bedrohungen gefunden.`,
        };
      }
    } else {
      // Scan fehlgeschlagen oder noch in Queue
      console.warn('VirusTotal Scan nicht abgeschlossen:', scanResult);
      return {
        clean: true, // Im MVP: Erlaube Upload wenn Scan nicht abgeschlossen
        scanId: scanResult.scan_id,
        message: 'Virus-Scan noch nicht abgeschlossen. Upload erlaubt.',
      };
    }
  } catch (error) {
    console.error('VirusTotal Scan Fehler:', error);
    // Im MVP: Erlaube Upload bei Fehler
    return {
      clean: true,
      message: `Virus-Scan Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}. Upload erlaubt.`,
    };
  }
}

/**
 * Prüft Scan-Status (für asynchrone Scans)
 */
export async function checkScanStatus(scanId: string): Promise<{
  clean: boolean;
  message: string;
}> {
  if (!VIRUSTOTAL_API_KEY) {
    return {
      clean: true,
      message: 'VirusTotal API Key nicht gesetzt',
    };
  }

  try {
    const vt = new VirusTotal(VIRUSTOTAL_API_KEY);
    const report = await vt.fileReport(scanId);

    if (report.response_code === 1) {
      const positives = report.positives || 0;
      return {
        clean: positives === 0,
        message: positives === 0 
          ? 'Datei ist sauber' 
          : `Malware erkannt! ${positives} Scanner haben Bedrohungen gefunden.`,
      };
    }

    return {
      clean: true,
      message: 'Scan-Status nicht verfügbar',
    };
  } catch (error) {
    console.error('VirusTotal Status-Check Fehler:', error);
    return {
      clean: true,
      message: 'Status-Check fehlgeschlagen',
    };
  }
}


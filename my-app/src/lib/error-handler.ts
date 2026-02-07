/**
 * Zentrale Error-Handling-Funktionen für die Anwendung
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

export interface AppError extends Error {
  statusCode?: number;
  userMessage?: string;
  originalError?: Error;
}

/**
 * Zentrale Fehlerbehandlung für die Anwendung
 * @param error Der aufgetretene Fehler
 * @param context Zusätzlicher Kontext für das Logging
 * @returns Ein strukturiertes Fehlerobjekt
 */
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  // Konvertiere unbekannte Fehler zu AppError
  let appError: AppError;

  if (error instanceof Error) {
    appError = error as AppError;
  } else {
    appError = new Error(String(error)) as AppError;
    appError.originalError = error as Error;
  }

  // Bestimme eine benutzerfreundliche Fehlermeldung
  appError.userMessage = getUserFriendlyMessage(appError);

  // Logge den Fehler
  logger.error('Application Error:', {
    message: appError.message,
    stack: appError.stack,
    context,
    originalError: appError.originalError,
  });

  // Sende den Fehler an Sentry (nur in Produktion)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(appError, {
      contexts: {
        custom: context,
      },
    });
  }

  return appError;
}

/**
 * Gibt eine benutzerfreundliche Fehlermeldung zurück
 * @param error Der Fehler
 * @returns Eine für den Benutzer verständliche Nachricht
 */
function getUserFriendlyMessage(error: AppError): string {
  // Netzwerkfehler
  if (error.message.includes('Network Error')) {
    return 'Verbindungsfehler: Bitte überprüfen Sie Ihre Internetverbindung.';
  }

  // HTTP-Fehlercodes
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    switch (error.statusCode) {
      case 400:
        return 'Ungültige Anfrage: Die Anfrage war fehlerhaft.';
      case 401:
        return 'Nicht autorisiert: Bitte melden Sie sich erneut an.';
      case 403:
        return 'Zugriff verweigert: Sie haben keine Berechtigung für diese Aktion.';
      case 404:
        return 'Nicht gefunden: Die angeforderte Ressource existiert nicht.';
      case 429:
        return 'Zu viele Anfragen: Bitte warten Sie kurz, bevor Sie es erneut versuchen.';
      case 500:
        return 'Interner Serverfehler: Bitte versuchen Sie es später erneut.';
      default:
        return `Serverfehler (${error.statusCode}): ${error.message}`;
    }
  }

  // API-spezifische Fehler
  if (error.message.includes('timeout')) {
    return 'Zeitüberschreitung: Die Anfrage dauerte zu lange.';
  }

  if (error.message.includes('abort')) {
    return 'Anfrage abgebrochen: Die Aktion wurde abgebrochen.';
  }

  // Standard-Fehlermeldung
  return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
}

/**
 * Prüft, ob ein Fehler spezifisch behandelt werden sollte
 * @param error Der Fehler
 * @returns true, wenn der Fehler spezifisch behandelt werden sollte
 */
export function shouldHandleError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  // Ignoriere bestimmte Fehler, die nicht behandelt werden müssen
  const ignoredErrors = [
    'ChunkLoadError', // Dynamisches Import-Problem
    'ResizeObserver loop limit exceeded', // Browser-spezifischer Fehler
    'Non-Error promise rejection captured', // Promise-Rejection
  ];

  return !ignoredErrors.some(ignored => error.message.includes(ignored));
}

/**
 * Wrapper für asynchrone Operationen mit zentralem Error-Handling
 * @param asyncFn Die asynchrone Funktion
 * @param context Zusätzlicher Kontext für das Logging
 * @returns Das Ergebnis der Funktion oder ein Fehler
 */
export async function withErrorHandler<T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await asyncFn();
    return { data };
  } catch (error) {
    const appError = handleError(error, context);
    return { error: appError };
  }
}

/**
 * Wrapper für synchrone Operationen mit zentralem Error-Handling
 * @param fn Die synchrone Funktion
 * @param context Zusätzlicher Kontext für das Logging
 * @returns Das Ergebnis der Funktion oder ein Fehler
 */
export function withSyncErrorHandler<T>(
  fn: () => T,
  context?: Record<string, unknown>
): { data?: T; error?: AppError } {
  try {
    const data = fn();
    return { data };
  } catch (error) {
    const appError = handleError(error, context);
    return { error: appError };
  }
}
import React from 'react';

/**
 * Feature Flag System für TiMax
 * 
 * Erlaubt es, Features basierend auf Umgebungsvariablen ein- und auszuschalten
 * ohne Code-Änderungen oder Neubereitstellungen
 */

interface FeatureFlags {
  // Upload-Features
  enableDirectUploads: boolean;
  enableChunkedUploads: boolean;
  enableUploadRetry: boolean;
  
  // AI-Features
  enableChatHistory: boolean;
  enableKnowledgeBaseSearch: boolean;
  enableAdvancedGeneration: boolean;
  
  // UI-Features
  enableDarkMode: boolean;
  enableMobileOptimizedUI: boolean;
  enableAdvancedSearch: boolean;
  
  // Debug-Features
  enableDebugLogging: boolean;
  enableMockServices: boolean;
  enablePerformanceMonitoring: boolean;
  
  // Beta-Features
  enableBetaFeatures: boolean;
  enableExperimentalUI: boolean;
}

// Standardwerte für Feature-Flags
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableDirectUploads: true,
  enableChunkedUploads: false,
  enableUploadRetry: true,
  enableChatHistory: true,
  enableKnowledgeBaseSearch: true,
  enableAdvancedGeneration: true,
  enableDarkMode: true,
  enableMobileOptimizedUI: true,
  enableAdvancedSearch: false,
  enableDebugLogging: process.env.NODE_ENV === 'development',
  enableMockServices: false,
  enablePerformanceMonitoring: true,
  enableBetaFeatures: false,
  enableExperimentalUI: false,
};

/**
 * Holt den Wert eines Feature-Flags
 * @param flagName Der Name des Feature-Flags
 * @returns Der Wert des Feature-Flags (true/false)
 */
export function getFeatureFlag(flagName: keyof FeatureFlags): boolean {
  // Prüfe zuerst auf explizite Umgebungsvariable (z.B. FEATURE_ENABLE_CHAT_HISTORY)
  const envVarName = `FEATURE_${flagName.toUpperCase()}`;
  const envValue = process.env[envVarName];
  
  if (envValue !== undefined) {
    // Konvertiere String zu Boolean
    return envValue.toLowerCase() === 'true' || envValue === '1';
  }
  
  // Fallback auf Standardwert
  return DEFAULT_FEATURE_FLAGS[flagName];
}

/**
 * Prüft, ob alle angegebenen Feature-Flags aktiviert sind
 * @param flags Liste von Feature-Flag-Namen
 * @returns true, wenn alle Flags aktiviert sind, sonst false
 */
export function areAllFeaturesEnabled(flags: (keyof FeatureFlags)[]): boolean {
  return flags.every(flag => getFeatureFlag(flag));
}

/**
 * Prüft, ob mindestens eines der angegebenen Feature-Flags aktiviert ist
 * @param flags Liste von Feature-Flag-Namen
 * @returns true, wenn mindestens ein Flag aktiviert ist, sonst false
 */
export function isAnyFeatureEnabled(flags: (keyof FeatureFlags)[]): boolean {
  return flags.some(flag => getFeatureFlag(flag));
}

/**
 * Holt alle aktiven Feature-Flags
 * @returns Objekt mit allen Feature-Flags und deren aktuellen Werten
 */
export function getAllFeatureFlags(): FeatureFlags {
  const flags: Partial<FeatureFlags> = {};
  
  for (const [key] of Object.entries(DEFAULT_FEATURE_FLAGS)) {
    flags[key as keyof FeatureFlags] = getFeatureFlag(key as keyof FeatureFlags);
  }
  
  return flags as FeatureFlags;
}

/**
 * React-Hook für Feature-Flags
 * SOLLTE in einer späteren Implementierung verwendet werden
 * 
 * Beispiel:
 * ```ts
 * const isChatEnabled = useFeatureFlag('enableChatHistory');
 * ```
 */
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  // In einer echten React-Umgebung würde dies einen State-Manager verwenden
  // Für den Moment geben wir einfach den aktuellen Wert zurück
  return getFeatureFlag(flagName);
}

/**
 * Feature-Flag Provider-Komponente
 * SOLLTE in einer späteren Implementierung erstellt werden
 *
 * Diese Komponente würde alle Feature-Flags bereitstellen
 * und Änderungen effizient propagieren
 */
export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  // In einer echten Implementierung würde dies Context-API verwenden
  return <>{children}</>;
}

// Feature-Gruppen für häufige Kombinationen
export const FEATURE_GROUPS = {
  /**
   * Alle produktiven Features (Standard für Produktivumgebung)
   */
  production: [
    'enableDirectUploads',
    'enableChatHistory',
    'enableKnowledgeBaseSearch',
    'enableAdvancedGeneration',
    'enableDarkMode',
    'enableMobileOptimizedUI',
    'enablePerformanceMonitoring',
  ] as const,
  
  /**
   * Alle Entwicklungs-Features
   */
  development: [
    'enableDebugLogging',
    'enableMockServices',
    'enableBetaFeatures',
    'enableExperimentalUI',
  ] as const,
  
  /**
   * Alle Upload-bezogenen Features
   */
  uploads: [
    'enableDirectUploads',
    'enableChunkedUploads',
    'enableUploadRetry',
  ] as const,
  
  /**
   * Alle KI-bezogenen Features
   */
  ai: [
    'enableChatHistory',
    'enableKnowledgeBaseSearch',
    'enableAdvancedGeneration',
  ] as const,
};
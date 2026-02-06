"use client";

import { useState, useEffect } from "react";

/**
 * Hook zur Erkennung von echten mobilen Geräten.
 * 
 * WICHTIG: Dieser Hook erkennt ECHTE mobile Geräte, nicht kleine Browserfenster!
 * Er basiert auf:
 * - Touch-Fähigkeiten (navigator.maxTouchPoints)
 * - Pointer-Typ (coarse = Finger/Touch, fine = Maus)
 * - Hover-Fähigkeit (mobile Geräte haben kein echtes Hover)
 * 
 * @returns {boolean} true wenn echtes mobiles Gerät, false sonst
 */
export function useMobileDevice(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobileDevice = () => {
      // Methode 1: Media Queries für Touch-Geräte
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      
      // Methode 2: Touch-Punkte prüfen
      const hasTouchPoints = navigator.maxTouchPoints > 0;
      
      // Kombinierte Logik: Ein Gerät ist mobil wenn:
      // - Es einen groben Pointer hat (Touch statt Maus) UND
      // - Es kein echtes Hover hat ODER
      // - Es Touch-Punkte hat
      const isMobileDevice = (hasCoarsePointer && hasNoHover) || 
                             (hasTouchPoints && hasCoarsePointer);
      
      setIsMobile(isMobileDevice);
    };

    // Initial check
    checkMobileDevice();

    // Listener für Änderungen (z.B. wenn ein Gerät gedreht wird oder externe Peripherie angeschlossen wird)
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const hoverQuery = window.matchMedia("(hover: none)");

    const handleChange = () => checkMobileDevice();

    // Modern browsers support addEventListener on MediaQueryList
    pointerQuery.addEventListener?.("change", handleChange);
    hoverQuery.addEventListener?.("change", handleChange);

    return () => {
      pointerQuery.removeEventListener?.("change", handleChange);
      hoverQuery.removeEventListener?.("change", handleChange);
    };
  }, []);

  return isMobile;
}

/**
 * CSS-Klassen-Helper für Mobile-Only Styles.
 * 
 * Verwendung in Komponenten:
 * className={cn(baseStyles, isMobile && mobileOnlyStyles)}
 */
export function getMobileClass(isMobile: boolean, mobileClass: string, desktopClass: string = ""): string {
  return isMobile ? mobileClass : desktopClass;
}

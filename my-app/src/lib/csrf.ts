import { randomBytes, createHmac } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "change-me-in-production";

/**
 * Generiert einen CSRF Token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString("hex");
  return token;
}

/**
 * Erstellt einen signierten CSRF Token
 */
export function signCSRFToken(token: string): string {
  const hmac = createHmac("sha256", CSRF_SECRET);
  hmac.update(token);
  const signature = hmac.digest("hex");
  return `${token}.${signature}`;
}

/**
 * Validiert einen CSRF Token
 */
export function verifyCSRFToken(signedToken: string): boolean {
  try {
    const [token, signature] = signedToken.split(".");
    if (!token || !signature) {
      return false;
    }

    const hmac = createHmac("sha256", CSRF_SECRET);
    hmac.update(token);
    const expectedSignature = hmac.digest("hex");

    // Timing-safe Vergleich
    return signature.length === expectedSignature.length &&
      signature === expectedSignature;
  } catch {
    return false;
  }
}

/**
 * Generiert einen signierten CSRF Token für die Session
 */
export function generateSignedCSRFToken(): string {
  const token = generateCSRFToken();
  return signCSRFToken(token);
}

/**
 * Validiert CSRF Token aus Request Header oder Body
 */
export function validateCSRFToken(
  requestToken: string | null | undefined
): boolean {
  if (!requestToken) {
    return false;
  }

  return verifyCSRFToken(requestToken);
}


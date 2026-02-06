import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateCsrfToken,
  setCsrfCookie,
  validateCsrfToken,
  withCsrfProtection,
} from '@/lib/csrf';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: new Headers(),
    })),
  },
  NextRequest: vi.fn(),
}));

import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

describe('CSRF Protection', () => {
  const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as ReturnType<typeof vi.fn>).mockReturnValue(mockCookieStore);
  });

  describe('generateCsrfToken', () => {
    it('should generate a token', () => {
      const token = generateCsrfToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens each time', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate hex string', () => {
      const token = generateCsrfToken();
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate token of correct length (64 hex chars = 32 bytes)', () => {
      const token = generateCsrfToken();
      expect(token.length).toBe(64);
    });
  });

  describe('setCsrfCookie', () => {
    it('should set cookie with correct options', async () => {
      const token = 'test-token-123';
      await setCsrfCookie(token);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'csrf_token',
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24,
        })
      );
    });

    it('should use secure flag in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      vi.stubEnv('NODE_ENV', 'production');

      await setCsrfCookie('token');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'csrf_token',
        'token',
        expect.objectContaining({
          secure: true,
        })
      );

      vi.stubEnv('NODE_ENV', originalEnv);
    });

    it('should not use secure flag in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      vi.stubEnv('NODE_ENV', 'development');

      await setCsrfCookie('token');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'csrf_token',
        'token',
        expect.objectContaining({
          secure: false,
        })
      );

      vi.stubEnv('NODE_ENV', originalEnv);
    });
  });

  describe('validateCsrfToken', () => {
    const createMockRequest = (method: string, headers: Record<string, string> = {}) => {
      return {
        method,
        headers: {
          get: (key: string) => headers[key] || null,
        },
      } as unknown as NextRequest;
    };

    it('should skip validation for GET requests', async () => {
      const request = createMockRequest('GET');
      const result = await validateCsrfToken(request);
      expect(result).toBeNull();
    });

    it('should skip validation for HEAD requests', async () => {
      const request = createMockRequest('HEAD');
      const result = await validateCsrfToken(request);
      expect(result).toBeNull();
    });

    it('should skip validation for OPTIONS requests', async () => {
      const request = createMockRequest('OPTIONS');
      const result = await validateCsrfToken(request);
      expect(result).toBeNull();
    });

    it('should validate POST requests', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'cookie-token' });
      const request = createMockRequest('POST', { 'x-csrf-token': 'header-token' });
      
      await validateCsrfToken(request);
      // Should check both cookie and header
      expect(mockCookieStore.get).toHaveBeenCalledWith('csrf_token');
    });

    it('should return error when header token is missing', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'cookie-token' });
      const request = createMockRequest('POST', {});
      
      const result = await validateCsrfToken(request);
      expect(result).not.toBeNull();
    });

    it('should return error when cookie token is missing', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const request = createMockRequest('POST', { 'x-csrf-token': 'header-token' });
      
      const result = await validateCsrfToken(request);
      expect(result).not.toBeNull();
    });

    it('should return error when tokens have different lengths', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'short' });
      const request = createMockRequest('POST', { 'x-csrf-token': 'much-longer-token' });
      
      const result = await validateCsrfToken(request);
      expect(result).not.toBeNull();
    });

    it('should return error when tokens do not match', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'token-a' });
      const request = createMockRequest('POST', { 'x-csrf-token': 'token-b' });
      
      const result = await validateCsrfToken(request);
      expect(result).not.toBeNull();
    });

    it('should return null when tokens match', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'matching-token' });
      const request = createMockRequest('POST', { 'x-csrf-token': 'matching-token' });
      
      const result = await validateCsrfToken(request);
      expect(result).toBeNull();
    });

    it('should handle case-sensitive token comparison', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'Token123' });
      const request = createMockRequest('POST', { 'x-csrf-token': 'token123' });
      
      const result = await validateCsrfToken(request);
      // Should NOT match due to case sensitivity
      expect(result).not.toBeNull();
    });
  });

  describe('withCsrfProtection', () => {
    it('should call handler when CSRF is valid', async () => {
      const mockHandler = vi.fn().mockResolvedValue({ success: true });
      const protectedHandler = withCsrfProtection(mockHandler);
      
      mockCookieStore.get.mockReturnValue({ value: 'valid-token' });
      const request = {
        method: 'POST',
        headers: {
          get: (key: string) => key === 'x-csrf-token' ? 'valid-token' : null,
        },
      } as unknown as NextRequest;
      
      await protectedHandler(request);
      expect(mockHandler).toHaveBeenCalledWith(request);
    });

    it('should return error response when CSRF is invalid', async () => {
      const mockHandler = vi.fn().mockResolvedValue({ success: true });
      const protectedHandler = withCsrfProtection(mockHandler);
      
      mockCookieStore.get.mockReturnValue({ value: 'cookie-token' });
      const request = {
        method: 'POST',
        headers: {
          get: (key: string) => key === 'x-csrf-token' ? 'different-token' : null,
        },
      } as unknown as NextRequest;
      
      const result = await protectedHandler(request);
      expect(mockHandler).not.toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it('should allow GET requests without CSRF token', async () => {
      const mockHandler = vi.fn().mockResolvedValue({ success: true });
      const protectedHandler = withCsrfProtection(mockHandler);
      
      const request = {
        method: 'GET',
        headers: {
          get: () => null,
        },
      } as unknown as NextRequest;
      
      await protectedHandler(request);
      expect(mockHandler).toHaveBeenCalled();
    });
  });
});

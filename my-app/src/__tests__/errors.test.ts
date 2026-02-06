import { describe, it, expect, vi } from 'vitest';
import {
  getUserFriendlyError,
  formatErrorForToast,
  handleApiCall,
  ERROR_MESSAGES,
  type UserFriendlyError,
} from '@/lib/errors';

describe('Error Handling', () => {
  describe('getUserFriendlyError', () => {
    it('should handle network errors (TypeError with fetch)', () => {
      const error = new TypeError('Failed to fetch');
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('network');
      expect(result.message).toBe('Verbindung fehlgeschlagen');
      expect(result.actionable).toContain('Internetverbindung');
    });

    it('should handle HTTP 400 errors', () => {
      const error = { status: 400, error: 'Invalid input' };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('validation');
      expect(result.message).toBe('Ungültige Eingabe');
    });

    it('should handle HTTP 401 errors', () => {
      const error = { status: 401 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('auth');
      expect(result.message).toBe('Sitzung abgelaufen');
    });

    it('should handle HTTP 403 errors', () => {
      const error = { status: 403 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('permission');
      expect(result.message).toBe('Zugriff verweigert');
    });

    it('should handle HTTP 404 errors', () => {
      const error = { status: 404 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('notfound');
      expect(result.message).toBe('Nicht gefunden');
    });

    it('should handle HTTP 429 rate limit errors', () => {
      const error = { status: 429 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('ratelimit');
      expect(result.message).toBe('Zu viele Anfragen');
    });

    it('should handle HTTP 500 server errors', () => {
      const error = { status: 500 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('server');
      expect(result.message).toBe('Server-Fehler');
    });

    it('should handle HTTP 502, 503, 504 errors', () => {
      const errors = [502, 503, 504];
      errors.forEach(status => {
        const result = getUserFriendlyError({ status });
        expect(result.category).toBe('server');
        expect(result.message).toBe('Server-Fehler');
      });
    });

    it('should handle unknown HTTP status codes', () => {
      const error = { status: 418 };
      const result = getUserFriendlyError(error);
      
      expect(result.category).toBe('unknown');
      expect(result.message).toBe('Fehler 418');
    });

    it('should handle string errors', () => {
      const result = getUserFriendlyError('Network connection failed');
      
      expect(result.category).toBe('network');
      expect(result.technical).toBe('Network connection failed');
    });

    it('should handle Error objects', () => {
      const error = new Error('Something went wrong');
      const result = getUserFriendlyError(error);
      
      expect(result.technical).toBe('Something went wrong');
    });

    it('should handle auth-related string errors', () => {
      const result = getUserFriendlyError('Unauthorized access');
      expect(result.category).toBe('auth');
    });

    it('should handle rate limit string errors', () => {
      const result = getUserFriendlyError('Rate limit exceeded');
      expect(result.category).toBe('ratelimit');
    });

    it('should handle validation string errors', () => {
      const result = getUserFriendlyError('Invalid field required');
      expect(result.category).toBe('validation');
    });

    it('should handle not found string errors', () => {
      const result = getUserFriendlyError('Resource not found 404');
      expect(result.category).toBe('notfound');
    });

    it('should handle server error string errors', () => {
      const result = getUserFriendlyError('Internal server error');
      expect(result.category).toBe('server');
    });

    it('should handle null errors', () => {
      const result = getUserFriendlyError(null);
      expect(result.category).toBe('unknown');
    });

    it('should handle undefined errors', () => {
      const result = getUserFriendlyError(undefined);
      expect(result.category).toBe('unknown');
    });

    it('should handle number errors', () => {
      const result = getUserFriendlyError(500);
      expect(result.category).toBe('unknown');
    });
  });

  describe('formatErrorForToast', () => {
    it('should format error with actionable message', () => {
      const error: UserFriendlyError = {
        message: 'Fehler',
        category: 'network',
        actionable: 'Bitte versuche es erneut',
      };
      const result = formatErrorForToast(error);
      expect(result).toBe('Fehler: Bitte versuche es erneut');
    });

    it('should return only message if actionable equals message', () => {
      const error: UserFriendlyError = {
        message: 'Fehler aufgetreten',
        category: 'unknown',
        actionable: 'Fehler aufgetreten',
      };
      const result = formatErrorForToast(error);
      expect(result).toBe('Fehler aufgetreten');
    });

    it('should return only message if no actionable', () => {
      const error: UserFriendlyError = {
        message: 'Einfacher Fehler',
        category: 'unknown',
        actionable: null,
      };
      const result = formatErrorForToast(error);
      expect(result).toBe('Einfacher Fehler');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have upload error messages', () => {
      expect(ERROR_MESSAGES.upload.fileTooLarge).toContain('100MB');
      expect(ERROR_MESSAGES.upload.invalidFileType).toContain('MP4');
      expect(ERROR_MESSAGES.upload.uploadFailed).toBeDefined();
      expect(ERROR_MESSAGES.upload.processingFailed).toBeDefined();
    });

    it('should have chat error messages', () => {
      expect(ERROR_MESSAGES.chat.messageTooLong).toContain('10.000');
      expect(ERROR_MESSAGES.chat.sendFailed).toBeDefined();
      expect(ERROR_MESSAGES.chat.loadFailed).toBeDefined();
    });

    it('should have auth error messages', () => {
      expect(ERROR_MESSAGES.auth.sessionExpired).toContain('Sitzung');
      expect(ERROR_MESSAGES.auth.notAuthenticated).toBeDefined();
      expect(ERROR_MESSAGES.auth.permissionDenied).toBeDefined();
    });

    it('should have general error messages', () => {
      expect(ERROR_MESSAGES.general.networkError).toBeDefined();
      expect(ERROR_MESSAGES.general.serverError).toBeDefined();
      expect(ERROR_MESSAGES.general.unknownError).toBeDefined();
    });
  });

  describe('handleApiCall', () => {
    it('should handle successful API calls', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ success: true, data: 'test' }),
      } as Response;

      const apiCall = () => Promise.resolve(mockResponse);
      const result = await handleApiCall(apiCall);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ success: true, data: 'test' });
    });

    it('should handle failed API calls', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad Request' }),
      } as Response;

      const apiCall = () => Promise.resolve(mockResponse);
      const result = await handleApiCall(apiCall);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle network errors', async () => {
      const apiCall = () => Promise.reject(new TypeError('Network error'));
      const result = await handleApiCall(apiCall);

      expect(result.success).toBe(false);
      expect(result.error?.category).toBe('network');
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const mockResponse = {
        ok: true,
        json: async () => ({ data: 'test' }),
      } as Response;

      await handleApiCall(() => Promise.resolve(mockResponse), { onSuccess });
      expect(onSuccess).toHaveBeenCalledWith({ data: 'test' });
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server Error' }),
      } as Response;

      await handleApiCall(() => Promise.resolve(mockResponse), { onError });
      expect(onError).toHaveBeenCalled();
    });

    it('should call showToast callback on error', async () => {
      const showToast = vi.fn();
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad Request' }),
      } as Response;

      await handleApiCall(() => Promise.resolve(mockResponse), { showToast });
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error');
    });
  });
});

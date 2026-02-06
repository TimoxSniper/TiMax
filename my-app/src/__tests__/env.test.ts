import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateRequiredEnv } from '@/lib/env';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset env before each test
    vi.resetModules();
    process.env = { ...originalEnv };
    // Required by validateRequiredEnv() (Supabase)
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('validateRequiredEnv', () => {
    it('should pass when all required env vars are set', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = 'https://n8n.example.com/chat';
      process.env.N8N_UPLOAD_WEBHOOK_URL = 'https://n8n.example.com/upload';

      const result = validateRequiredEnv();
      expect(result.N8N_CHAT_WEBHOOK_URL).toBe('https://n8n.example.com/chat');
      expect(result.N8N_UPLOAD_WEBHOOK_URL).toBe('https://n8n.example.com/upload');
    });

    it('should throw error when N8N_CHAT_WEBHOOK_URL is missing', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = '';
      process.env.N8N_UPLOAD_WEBHOOK_URL = 'https://n8n.example.com/upload';

      expect(() => validateRequiredEnv()).toThrow('N8N_CHAT_WEBHOOK_URL ist erforderlich');
    });

    it('should throw error when N8N_UPLOAD_WEBHOOK_URL is missing', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = 'https://n8n.example.com/chat';
      process.env.N8N_UPLOAD_WEBHOOK_URL = '';

      expect(() => validateRequiredEnv()).toThrow('N8N_UPLOAD_WEBHOOK_URL ist erforderlich');
    });

    it('should throw error when both required env vars are missing', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = '';
      process.env.N8N_UPLOAD_WEBHOOK_URL = '';

      expect(() => validateRequiredEnv()).toThrow('Fehlende Environment-Variablen');
    });

    it('should provide default values for optional vars', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = 'https://n8n.example.com/chat';
      process.env.N8N_UPLOAD_WEBHOOK_URL = 'https://n8n.example.com/upload';
      // N8N_API_URL not set, should default to localhost

      const result = validateRequiredEnv();
      expect(result.N8N_API_URL).toBe('http://localhost:5678');
    });

    it('should use provided N8N_API_URL', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = 'https://n8n.example.com/chat';
      process.env.N8N_UPLOAD_WEBHOOK_URL = 'https://n8n.example.com/upload';
      process.env.N8N_API_URL = 'https://custom.n8n.com';

      const result = validateRequiredEnv();
      expect(result.N8N_API_URL).toBe('https://custom.n8n.com');
    });

    it('should fallback N8N_TRANSCRIPTION_WEBHOOK_URL to UPLOAD_WEBHOOK_URL', () => {
      process.env.N8N_CHAT_WEBHOOK_URL = 'https://n8n.example.com/chat';
      process.env.N8N_UPLOAD_WEBHOOK_URL = 'https://n8n.example.com/upload';
      // N8N_TRANSCRIPTION_WEBHOOK_URL not set

      const result = validateRequiredEnv();
      expect(result.N8N_TRANSCRIPTION_WEBHOOK_URL).toBe('https://n8n.example.com/upload');
    });
  });

  describe('Environment variables format', () => {
    it('should accept valid URLs', () => {
      const validUrls = [
        'https://n8n.example.com/webhook',
        'http://localhost:5678/webhook',
        'https://n8n.io/webhook/chat',
      ];

      validUrls.forEach((url) => {
        process.env.N8N_CHAT_WEBHOOK_URL = url;
        process.env.N8N_UPLOAD_WEBHOOK_URL = url;
        
        expect(() => validateRequiredEnv()).not.toThrow();
        const result = validateRequiredEnv();
        expect(result.N8N_CHAT_WEBHOOK_URL).toBe(url);
      });
    });
  });
});

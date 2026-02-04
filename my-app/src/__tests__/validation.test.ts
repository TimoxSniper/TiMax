import { describe, it, expect } from 'vitest';
import {
  uploadSchema,
  chatSchema,
  sanitizeString,
  validateFilename,
  validateFileType,
} from '@/lib/validation';
import { UPLOAD_CONFIG } from '@/lib/upload-config';

describe('Validation', () => {
  describe('sanitizeString', () => {
    it('should remove < and > characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeString(input);
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeString(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = '<div onClick="alert(\'xss\')">click me</div>';
      const result = sanitizeString(input);
      // onclick should be removed (javascript: protocol removal)
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onClick');
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const result = sanitizeString(input);
      expect(result).toBe('hello world');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeString(input);
      expect(result).toBe('');
    });

    it('should preserve safe text', () => {
      const input = 'Hello World! How are you?';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World! How are you?');
    });
  });

  describe('validateFilename', () => {
    it('should accept valid filenames', () => {
      expect(validateFilename('document.pdf')).toBe(true);
      expect(validateFilename('my-file_123.txt')).toBe(true);
      expect(validateFilename('image.jpg')).toBe(true);
      expect(validateFilename('video.mp4')).toBe(true);
    });

    it('should reject path traversal attempts', () => {
      expect(validateFilename('../etc/passwd')).toBe(false);
      expect(validateFilename('..\\windows\\system32')).toBe(false);
      expect(validateFilename('file/../../../etc/passwd')).toBe(false);
    });

    it('should reject filenames with special characters', () => {
      expect(validateFilename('file<script>.txt')).toBe(false);
      expect(validateFilename('file;drop table.txt')).toBe(false);
      expect(validateFilename('file|pipe.txt')).toBe(false);
      expect(validateFilename('file&ampersand.txt')).toBe(false);
    });

    it('should handle empty filename', () => {
      expect(validateFilename('')).toBe(false);
    });
  });

  describe('chatSchema', () => {
    it('should validate valid chat message', () => {
      const validInput = {
        message: 'Hello, how are you?',
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
      const invalidInput = {
        message: '',
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject message with XSS', () => {
      const invalidInput = {
        message: '<script>alert("xss")</script>',
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject message that is too long', () => {
      const invalidInput = {
        message: 'a'.repeat(10001),
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid sessionId', () => {
      const invalidInput = {
        message: 'Hello',
        sessionId: 'invalid session id!',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should accept message at maximum length', () => {
      const validInput = {
        message: 'a'.repeat(10000),
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [],
      };
      const result = chatSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate chat history', () => {
      const validInput = {
        message: 'Hello',
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: [
          { role: 'user', content: 'Previous message' },
          { role: 'assistant', content: 'Previous response' },
        ],
      };
      const result = chatSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject too many chat history entries', () => {
      const invalidInput = {
        message: 'Hello',
        sessionId: 'chat-1234567890-abcdef',
        chatHistory: Array(101).fill({ role: 'user', content: 'test' }),
      };
      const result = chatSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('uploadSchema', () => {
    it('should be importable', () => {
      expect(uploadSchema).toBeDefined();
    });
  });
});

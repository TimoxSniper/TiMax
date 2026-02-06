import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('in development mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    it('should log errors', () => {
      logger.error('Test error', { detail: 'info' });
      expect(console.error).toHaveBeenCalledWith('Test error', { detail: 'info' });
    });

    it('should log warnings', () => {
      logger.warn('Test warning');
      expect(console.warn).toHaveBeenCalledWith('Test warning');
    });

    it('should log info', () => {
      logger.info('Test info');
      expect(console.info).toHaveBeenCalledWith('Test info');
    });

    it('should log general messages', () => {
      logger.log('Test log');
      expect(console.log).toHaveBeenCalledWith('Test log');
    });

    it('should handle multiple arguments', () => {
      logger.error('Error:', 'message', 123, { obj: true });
      expect(console.error).toHaveBeenCalledWith('Error:', 'message', 123, { obj: true });
    });

    it('should handle Error objects', () => {
      const error = new Error('Test error');
      logger.error('Something failed:', error);
      expect(console.error).toHaveBeenCalledWith('Something failed:', error);
    });

    it('should handle empty calls', () => {
      logger.log();
      expect(console.log).toHaveBeenCalledWith();
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('should NOT log errors to console', () => {
      logger.error('Test error');
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should NOT log warnings to console', () => {
      logger.warn('Test warning');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should NOT log info to console', () => {
      logger.info('Test info');
      expect(console.info).not.toHaveBeenCalled();
    });

    it('should NOT log general messages to console', () => {
      logger.log('Test log');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('in test mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'test');
    });

    it('should NOT log in test environment', () => {
      logger.error('Test error');
      logger.warn('Test warning');
      logger.info('Test info');
      logger.log('Test log');

      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development');
    });

    it('should handle null values', () => {
      logger.log(null);
      expect(console.log).toHaveBeenCalledWith(null);
    });

    it('should handle undefined values', () => {
      logger.log(undefined);
      expect(console.log).toHaveBeenCalledWith(undefined);
    });

    it('should handle objects', () => {
      const obj = { key: 'value', nested: { a: 1 } };
      logger.log(obj);
      expect(console.log).toHaveBeenCalledWith(obj);
    });

    it('should handle arrays', () => {
      const arr = [1, 2, 3];
      logger.log(arr);
      expect(console.log).toHaveBeenCalledWith(arr);
    });

    it('should handle symbols', () => {
      const sym = Symbol('test');
      logger.log(sym);
      expect(console.log).toHaveBeenCalledWith(sym);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('should filter out falsy values', () => {
      const result = cn('class1', false && 'class2', null, undefined, 'class3');
      expect(result).toBe('class1 class3');
    });

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      // Tailwind-merge should handle conflicting classes
      expect(result).toContain('px-4');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle nested arrays', () => {
      const result = cn(['class1', ['class2', 'class3']], 'class4');
      expect(result).toBe('class1 class2 class3 class4');
    });

    it('should handle objects', () => {
      const result = cn({ active: true, disabled: false });
      expect(result).toBe('active');
    });
  });
});

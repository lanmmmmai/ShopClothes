import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildNocoDBWhere } from '../utils/nocodb.js';
import { isValidEmail, isValidUsername, isValidPassword } from '../utils/validation.js';
import { getJWTSecret } from '../utils/jwt.js';

// Mock environment
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Auth Security - P0', () => {
  describe('NocoDB Query Sanitization', () => {
    it('should quote string values correctly', () => {
      expect(buildNocoDBWhere('email', 'eq', 'test@example.com')).toBe("(email,eq,'test@example.com')");
    });

    it('should escape single quotes in strings', () => {
      expect(buildNocoDBWhere('name', 'eq', "O'Brien")).toBe("(name,eq,'O''Brien')");
    });

    it('should validate field names', () => {
      expect(() => buildNocoDBWhere('email', 'eq', 'test')).not.toThrow();
      expect(() => buildNocoDBWhere('email_123', 'eq', 'test')).not.toThrow();
      expect(() => buildNocoDBWhere('email-123', 'eq', 'test')).toThrow();
      expect(() => buildNocoDBWhere("email'; DROP TABLE", 'eq', 'test')).toThrow();
    });

    it('should validate operators', () => {
      expect(() => buildNocoDBWhere('email', 'eq', 'test')).not.toThrow();
      expect(() => buildNocoDBWhere('email', 'ne', 'test')).not.toThrow();
      expect(() => buildNocoDBWhere('email', 'invalid', 'test')).toThrow();
    });
  });

  describe('Input Validation', () => {
    it('should validate email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should validate username', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('user_name')).toBe(true);
      expect(isValidUsername('user-name')).toBe(true);
      expect(isValidUsername('ab')).toBe(false); // too short
      expect(isValidUsername('user@name')).toBe(false); // invalid char
    });

    it('should validate password', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('12345')).toBe(false); // too short
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('JWT Secret Management', () => {
    it('should require JWT_SECRET in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = undefined;
      expect(() => getJWTSecret()).toThrow('JWT_SECRET is required in production!');
    });

    it('should reject default value in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'change-me-in-production';
      expect(() => getJWTSecret()).toThrow('JWT_SECRET cannot use default value in production!');
    });

    it('should allow default value in development', () => {
      process.env.NODE_ENV = 'development';
      process.env.JWT_SECRET = 'change-me-in-production';
      expect(() => getJWTSecret()).not.toThrow();
    });

    it('should return custom secret when set', () => {
      process.env.NODE_ENV = 'development';
      process.env.JWT_SECRET = 'my-secret-key';
      expect(getJWTSecret()).toBe('my-secret-key');
    });
  });
});

describe('Auth Routes - Smoke Tests', () => {
  it('should export authenticateToken function', async () => {
    const { authenticateToken } = await import('../middleware/auth.js');
    expect(typeof authenticateToken).toBe('function');
  });

  it('should have auth router defined', async () => {
    const { router } = await import('../routes/auth.js');
    expect(router).toBeDefined();
  });
});

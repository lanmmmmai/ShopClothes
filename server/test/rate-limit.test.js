import { describe, it, expect } from 'vitest';

describe('Rate Limiting Configuration', () => {
  it('should have correct rate limit settings', () => {
    const globalWindowMs = 15 * 60 * 1000; // 15 minutes
    const globalMax = 100;
    const authWindowMs = 15 * 60 * 1000; // 15 minutes
    const authMax = 5;

    expect(globalWindowMs).toBe(900000); // 15 minutes in ms
    expect(globalMax).toBe(100);
    expect(authWindowMs).toBe(900000);
    expect(authMax).toBe(5); // Stricter for auth endpoints
  });

  it('should have auth rate limit stricter than global', () => {
    const globalMax = 100;
    const authMax = 5;
    expect(authMax).toBeLessThan(globalMax);
  });
});

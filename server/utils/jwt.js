/**
 * JWT utilities
 * Require JWT_SECRET in production, use fallback in development
 */

export function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && !secret) {
    throw new Error('JWT_SECRET is required in production!');
  }

  if (isProd && secret === 'change-me-in-production') {
    throw new Error('JWT_SECRET cannot use default value in production!');
  }

  return secret || 'change-me-in-production';
}

/**
 * CSRF Protection Middleware
 * 
 * Option 1: Double-submit cookie pattern (for cookie-based auth)
 * Option 2: Authorization header (simpler, no CSRF token needed)
 * 
 * Current implementation: Support both cookie and Authorization header
 * If Authorization header is present, skip CSRF check (token in header is safe from CSRF)
 */

import crypto from 'crypto';

// Generate CSRF token
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// CSRF protection middleware
export function csrfProtection(req, res, next) {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // If using Authorization header, skip CSRF (token in header is safe)
  if (req.headers.authorization) {
    return next();
  }

  // For cookie-based auth, check CSRF token
  const tokenFromCookie = req.cookies.csrf_token;
  const tokenFromHeader = req.headers['x-csrf-token'];

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ error: 'CSRF token không hợp lệ' });
  }

  next();
}

// Set CSRF token cookie (call this on GET requests to set initial token)
export function setCSRFToken(req, res, next) {
  // Only set if not already set
  if (!req.cookies.csrf_token) {
    const token = generateCSRFToken();
    res.cookie('csrf_token', token, {
      httpOnly: false, // Must be readable by JS for double-submit pattern
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    // Also send in response header for frontend to read
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}

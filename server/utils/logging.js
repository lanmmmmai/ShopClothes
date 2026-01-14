/**
 * Safe logging utilities
 * Không log sensitive information (passwords, tokens, etc.)
 */

/**
 * Sanitize object để log an toàn (remove sensitive fields)
 */
export function sanitizeForLog(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitive = ['password', 'token', 'secret', 'xc-token', 'authorization', 'cookie'];
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const lowerKey = key.toLowerCase();
    if (sensitive.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Safe error logging
 */
export function logError(message, error, req = null) {
  const logData = {
    message,
    error: {
      message: error?.message,
      name: error?.name,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    },
  };

  if (req) {
    logData.request = {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      // Don't log body/query/headers to avoid logging sensitive data
    };
  }

  console.error(JSON.stringify(logData, null, 2));
}

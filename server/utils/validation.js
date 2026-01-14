/**
 * Validation helpers
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username (alphanumeric, underscore, dash, min 3 chars)
 */
export function isValidUsername(username) {
  if (typeof username !== 'string') return false;
  return /^[a-zA-Z0-9_-]{3,}$/.test(username);
}

/**
 * Validate password (min 6 chars)
 */
export function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
}

/**
 * Sanitize string input (trim và limit length)
 */
export function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

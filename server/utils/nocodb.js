/**
 * NocoDB query helper - Sanitize và quote string values
 * Tránh SQL injection và đảm bảo format đúng cho NocoDB
 */

/**
 * Escape single quotes trong string
 */
function escapeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

/**
 * Quote và escape string value cho NocoDB filter
 * Format: (field,eq,'value') với value được escape
 */
export function quoteNocoDBValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'string') {
    const escaped = escapeString(value);
    return `'${escaped}'`;
  }
  throw new Error(`Invalid value type for NocoDB: ${typeof value}`);
}

/**
 * Validate và sanitize field name (chỉ cho phép alphanumeric và underscore)
 */
export function validateFieldName(field) {
  if (typeof field !== 'string') {
    throw new Error('Field name must be a string');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(field)) {
    throw new Error(`Invalid field name: ${field}`);
  }
  return field;
}

/**
 * Tạo NocoDB where clause an toàn
 * @param {string} field - Field name (đã được validate)
 * @param {string} operator - Operator (eq, ne, gt, lt, etc.)
 * @param {any} value - Value (sẽ được quote và escape)
 * @returns {string} Safe where clause
 */
export function buildNocoDBWhere(field, operator, value) {
  const safeField = validateFieldName(field);
  const safeValue = quoteNocoDBValue(value);
  const allowedOperators = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'contains'];
  if (!allowedOperators.includes(operator)) {
    throw new Error(`Invalid operator: ${operator}`);
  }
  return `(${safeField},${operator},${safeValue})`;
}

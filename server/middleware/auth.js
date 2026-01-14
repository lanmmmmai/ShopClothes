import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../utils/jwt.js';
import { logError } from '../utils/logging.js';

export function authenticateToken(req, res, next) {
  const token = req.cookies.session_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token đã hết hạn. Vui lòng đăng nhập lại' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token không hợp lệ' });
    }
    logError('Auth middleware error', error, req);
    return res.status(403).json({ error: 'Token không hợp lệ' });
  }
}

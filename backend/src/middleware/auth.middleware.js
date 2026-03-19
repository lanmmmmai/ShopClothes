import { prisma } from '../config/prisma.js';
import { verifyToken } from '../utils/jwt.js';

const FORCE_PASSWORD_ALLOWLIST = new Set([
  '/api/auth/me',
  '/api/auth/change-password',
]);

async function resolveUserFromHeader(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const payload = verifyToken(token);
  return prisma.user.findUnique({ where: { id: payload.sub } });
}

function canAccessWhilePasswordExpired(req) {
  return FORCE_PASSWORD_ALLOWLIST.has(req.originalUrl.split('?')[0]);
}

export async function authRequired(req, res, next) {
  try {
    const user = await resolveUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ message: 'Thiếu access token hoặc token không hợp lệ' });
    }

    if (user.mustChangePassword && !canAccessWhilePasswordExpired(req)) {
      return res.status(403).json({
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'Bạn phải đổi mật khẩu trước khi tiếp tục sử dụng hệ thống',
      });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const user = await resolveUserFromHeader(req);
    if (user) req.user = user;
  } catch (_error) {
  }
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
  };
}

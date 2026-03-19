import { Server } from 'socket.io';
import { verifyToken } from './utils/jwt.js';

let io;

export function initSocket(server, allowOrigins) {
  io = new Server(server, {
    cors: {
      origin: allowOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');
      if (!token) return next(new Error('Unauthorized'));
      const payload = verifyToken(token);
      socket.user = { id: payload.sub, role: String(payload.role || '').toUpperCase() };
      next();
    } catch (_error) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    if (!socket.user?.id) return;
    socket.join(`user:${socket.user.id}`);
    if (socket.user.role === 'ADMIN') {
      socket.join('admins');
    }
  });

  return io;
}

export function getSocketServer() {
  return io;
}

export function emitToUser(userId, event, payload) {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit(event, payload);
}

export function emitToAdmins(event, payload) {
  if (!io) return;
  io.to('admins').emit(event, payload);
}

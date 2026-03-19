import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_TARGET as string | undefined;
  if (envUrl) return envUrl;
  if (typeof window === 'undefined') return 'http://localhost:4000';
  return `${window.location.protocol}//${window.location.hostname}:4000`;
};

export const getSocket = (token?: string) => {
  if (!token) return null;
  if (socket && socket.connected) return socket;
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ['websocket'],
      auth: { token },
    });
  } else {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

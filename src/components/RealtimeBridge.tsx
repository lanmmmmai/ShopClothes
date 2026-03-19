import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { disconnectSocket, getSocket } from '@/lib/socket';
import { createBrowserNotificationSound, emitRealtimeUpdate } from '@/lib/realtime-order';
import { getAccountNotifications, getAccountOrders, saveAccountNotifications, saveAccountOrders } from '@/lib/account-data';
import type { Notification } from '@/types';

const mapStatus = (status?: string) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'pending' || normalized === 'confirmed' || normalized === 'shipping' || normalized === 'delivered' || normalized === 'cancelled') {
    return normalized;
  }
  return undefined;
};

const RealtimeBridge = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem('access_token');
    const socket = getSocket(token || undefined);
    if (!socket) return;

    const handleNotification = (payload: Partial<Notification>) => {
      const nextNotification: Notification = {
        id: payload.id || `noti-${Date.now()}`,
        user_id: user.id,
        title: payload.title || 'Thông báo mới',
        message: payload.message || '',
        type: (payload.type as Notification['type']) || 'system',
        is_read: false,
        created_at: payload.created_at || new Date().toISOString(),
        order_id: payload.order_id,
        action_url: payload.action_url,
      };
      const notifications = getAccountNotifications(user.id);
      saveAccountNotifications(user.id, [nextNotification, ...notifications.filter((item) => item.id !== nextNotification.id)]);
      createBrowserNotificationSound();
    };

    const handleOrderUpdated = (payload: { orderId: string; status?: string; updatedAt?: string }) => {
      const nextStatus = mapStatus(payload.status);
      if (!nextStatus) return;
      const orders = getAccountOrders(user.id).map((order) => order.id === payload.orderId ? { ...order, status: nextStatus, updated_at: payload.updatedAt || new Date().toISOString() } : order);
      saveAccountOrders(user.id, orders);
    };

    const handleChatNew = () => {
      emitRealtimeUpdate('chat:server');
      createBrowserNotificationSound();
    };

    const handleAdminOrderEvents = () => emitRealtimeUpdate('admin:orders');

    socket.on('notification:new', handleNotification);
    socket.on('order:updated', handleOrderUpdated);
    socket.on('chat:new', handleChatNew);
    socket.on('admin:order:new', handleAdminOrderEvents);
    socket.on('admin:order:updated', handleAdminOrderEvents);

    return () => {
      socket.off('notification:new', handleNotification);
      socket.off('order:updated', handleOrderUpdated);
      socket.off('chat:new', handleChatNew);
      socket.off('admin:order:new', handleAdminOrderEvents);
      socket.off('admin:order:updated', handleAdminOrderEvents);
    };
  }, [isAuthenticated, user?.id]);

  return null;
};

export default RealtimeBridge;

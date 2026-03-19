import type { ChatMessage, Notification, Order } from '@/types';

const REALTIME_EVENT = 'shopclothes:realtime';
const STORAGE_PING_KEY = 'shopclothes:realtime:ping';

const scopedKey = (userId: string, key: string) => `shopclothes:${userId}:${key}`;

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const emitRealtimeUpdate = (scope = 'global') => {
  if (typeof window === 'undefined') return;
  const payload = { scope, time: Date.now() };
  window.dispatchEvent(new CustomEvent(REALTIME_EVENT, { detail: payload }));
  window.localStorage.setItem(STORAGE_PING_KEY, JSON.stringify(payload));
};

export const subscribeRealtimeUpdate = (callback: () => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const onCustom = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_PING_KEY) callback();
  };

  window.addEventListener(REALTIME_EVENT, onCustom as EventListener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(REALTIME_EVENT, onCustom as EventListener);
    window.removeEventListener('storage', onStorage);
  };
};

export const getOrderChatMessages = (userId: string, orderId: string): ChatMessage[] => {
  const seed: ChatMessage[] = [
    {
      id: `seed-${orderId}`,
      order_id: orderId,
      sender: 'admin',
      content: 'Shop đã nhận được đơn hàng của bạn. Bạn có thể nhắn trực tiếp tại đây nếu cần hỗ trợ về giao hàng.',
      created_at: new Date().toISOString(),
      sender_name: 'Admin Shop',
      is_read: true,
    },
  ];

  return readJson(scopedKey(userId, `order-chat:${orderId}`), seed);
};

export const saveOrderChatMessages = (userId: string, orderId: string, messages: ChatMessage[]) => {
  writeJson(scopedKey(userId, `order-chat:${orderId}`), messages);
  emitRealtimeUpdate(`chat:${orderId}`);
};

export const createBrowserNotificationSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const context = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);

    window.setTimeout(() => {
      context.close().catch(() => undefined);
    }, 400);
  } catch {
    // ignore audio failures caused by browser policies
  }
};

export const buildOrderStatusNotification = (userId: string, order: Order, title?: string, message?: string): Notification => ({
  id: `noti-${order.id}-${Date.now()}`,
  user_id: userId,
  title: title || 'Cập nhật đơn hàng',
  message: message || `Đơn hàng #${order.id} hiện ở trạng thái ${order.status}.`,
  type: 'order',
  is_read: false,
  created_at: new Date().toISOString(),
  order_id: order.id,
  action_url: `/account/orders/${order.id}`,
});

export const applyOrderStatusLocal = (userId: string, orderId: string, nextStatus: Order['status']) => {
  const orders = readJson<Order[]>(scopedKey(userId, 'orders'), []);
  const nextOrders = orders.map((order) => order.id === orderId ? { ...order, status: nextStatus, updated_at: new Date().toISOString() } : order);
  writeJson(scopedKey(userId, 'orders'), nextOrders);
  emitRealtimeUpdate(`order:${orderId}`);
  return nextOrders.find((order) => order.id === orderId);
};

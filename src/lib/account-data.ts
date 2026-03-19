import { mockAddresses, mockNotifications, mockOrders } from '@/data/mock';
import { emitRealtimeUpdate } from '@/lib/realtime-order';
import type { Address, Notification, Order, User } from '@/types';

export interface AccountProfile {
  full_name: string;
  phone: string;
  email: string;
  birthday?: string;
  gender?: 'female' | 'male' | 'other';
  avatar_url?: string;
  address?: string;
  role_label?: string;
}

export interface StoredPaymentMethod {
  id: string;
  user_id: string;
  label: string;
  card_holder: string;
  last4: string;
  expiry: string;
  brand: 'Visa' | 'Mastercard' | 'JCB' | 'ATM';
  is_default: boolean;
}

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

export const getAccountProfile = (user: Pick<User, 'id' | 'full_name' | 'phone' | 'email' | 'avatar_url'>): AccountProfile => {
  const fallback: AccountProfile = {
    full_name: user.full_name || '',
    phone: user.phone || '',
    email: user.email,
    avatar_url: user.avatar_url,
    role_label: 'Khách hàng',
  };
  return readJson(scopedKey(user.id, 'profile'), fallback);
};

export const saveAccountProfile = (userId: string, profile: AccountProfile) => {
  writeJson(scopedKey(userId, 'profile'), profile);
  emitRealtimeUpdate(`profile:${userId}`);
};

export const getAccountAddresses = (userId: string): Address[] => {
  const seed = mockAddresses.filter((item) => item.user_id === userId);
  return readJson(scopedKey(userId, 'addresses'), seed);
};

export const saveAccountAddresses = (userId: string, addresses: Address[]) => {
  writeJson(scopedKey(userId, 'addresses'), addresses);
  emitRealtimeUpdate(`addresses:${userId}`);
};

export const getAccountPaymentMethods = (userId: string): StoredPaymentMethod[] => {
  return readJson(scopedKey(userId, 'payment_methods'), []);
};

export const saveAccountPaymentMethods = (userId: string, methods: StoredPaymentMethod[]) => {
  writeJson(scopedKey(userId, 'payment_methods'), methods);
  emitRealtimeUpdate(`payments:${userId}`);
};

export const getAccountOrders = (userId: string): Order[] => {
  const seed = mockOrders.filter((order) => order.user_id === userId);
  return readJson(scopedKey(userId, 'orders'), seed);
};

export const saveAccountOrders = (userId: string, orders: Order[]) => {
  writeJson(scopedKey(userId, 'orders'), orders);
  emitRealtimeUpdate(`orders:${userId}`);
};

export const addAccountOrder = (userId: string, order: Order) => {
  const next = [order, ...getAccountOrders(userId).filter((item) => item.id !== order.id)];
  saveAccountOrders(userId, next);
  return next;
};

export const getAccountNotifications = (userId: string): Notification[] => {
  const seed = mockNotifications.filter((item) => item.user_id === userId);
  return readJson(scopedKey(userId, 'notifications'), seed);
};

export const saveAccountNotifications = (userId: string, notifications: Notification[]) => {
  writeJson(scopedKey(userId, 'notifications'), notifications);
  emitRealtimeUpdate(`notifications:${userId}`);
};

export const markNotificationRead = (userId: string, notificationId: string) => {
  const next = getAccountNotifications(userId).map((item) =>
    item.id === notificationId ? { ...item, is_read: true } : item,
  );
  saveAccountNotifications(userId, next);
  return next;
};

export const markAllNotificationsRead = (userId: string) => {
  const next = getAccountNotifications(userId).map((item) => ({ ...item, is_read: true }));
  saveAccountNotifications(userId, next);
  return next;
};

export const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

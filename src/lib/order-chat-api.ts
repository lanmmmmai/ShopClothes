import { apiFetch } from '@/lib/api';
import type { ChatMessage } from '@/types';

export type BackendOrderChatMessage = {
  id: string;
  content: string;
  senderRole: 'ADMIN' | 'USER';
  senderName: string;
  createdAt: string;
  orderId: string;
};

const normalizeChatMessage = (message: BackendOrderChatMessage): ChatMessage => ({
  id: message.id,
  order_id: message.orderId,
  content: message.content,
  sender: message.senderRole === 'ADMIN' ? 'admin' : 'user',
  sender_name: message.senderName,
  created_at: message.createdAt,
  is_read: true,
});

export const fetchOrderChatMessages = async (orderId: string): Promise<ChatMessage[]> => {
  const data = await apiFetch<BackendOrderChatMessage[]>(`/orders/${orderId}/chat`);
  return data.map(normalizeChatMessage);
};

export const sendOrderChatMessage = async (orderId: string, content: string): Promise<ChatMessage> => {
  const data = await apiFetch<BackendOrderChatMessage>(`/orders/${orderId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return normalizeChatMessage(data);
};

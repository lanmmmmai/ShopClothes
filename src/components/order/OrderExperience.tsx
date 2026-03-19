import { useEffect, useMemo, useState } from 'react';
import { BellRing, CheckCircle2, Circle, MapPinned, MessageCircleMore, PackageCheck, Send, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage, Order } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { createBrowserNotificationSound, subscribeRealtimeUpdate } from '@/lib/realtime-order';
import { fetchOrderChatMessages, sendOrderChatMessage } from '@/lib/order-chat-api';

const statusProgress: Record<Order['status'], number> = {
  pending: 0.2,
  confirmed: 0.42,
  shipping: 0.72,
  delivered: 1,
  cancelled: 0.08,
};

const timelineForOrder = (order: Order) => {
  const base = new Date(order.created_at).getTime();
  const timeline = [
    { key: 'pending', label: 'Đơn đã tạo', icon: BellRing, description: 'Shop đã tiếp nhận đơn và đang kiểm tra thanh toán.', time: new Date(base).toISOString() },
    { key: 'confirmed', label: 'Xác nhận đơn', icon: CheckCircle2, description: 'Kho đã xác nhận tồn kho và chuẩn bị đóng gói.', time: new Date(base + 35 * 60 * 1000).toISOString() },
    { key: 'shipping', label: 'Đang giao', icon: Truck, description: 'Shipper đang di chuyển theo lộ trình giả lập.', time: new Date(base + 4 * 60 * 60 * 1000).toISOString() },
    { key: 'delivered', label: 'Giao thành công', icon: PackageCheck, description: 'Đơn hàng đã giao đến người nhận.', time: new Date(base + 28 * 60 * 60 * 1000).toISOString() },
  ] as const;

  const activeIndex = order.status === 'cancelled' ? 0 : timeline.findIndex((item) => item.key === order.status);
  return timeline.map((item, index) => ({ ...item, active: order.status !== 'cancelled' && index <= activeIndex }));
};

const mapStops = [
  { left: '6%', top: '72%', label: 'Kho tổng' },
  { left: '28%', top: '30%', label: 'Trạm phân loại' },
  { left: '56%', top: '54%', label: 'Bưu cục gần bạn' },
  { left: '84%', top: '22%', label: 'Điểm giao hàng' },
];

export const OrderDetailPopup = ({ order, open, onOpenChange }: { order: Order | null; open: boolean; onOpenChange: (open: boolean) => void; userId: string; }) => {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    if (!order) return;
    setLoadingMessages(true);
    try {
      const data = await fetchOrderChatMessages(order.id);
      setMessages(data);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!order || !open) return;
    loadMessages();
  }, [order?.id, open]);

  useEffect(() => {
    if (!order || !open) return;
    return subscribeRealtimeUpdate(() => {
      loadMessages();
    });
  }, [order?.id, open]);

  const timeline = useMemo(() => (order ? timelineForOrder(order) : []), [order]);
  const progress = order ? statusProgress[order.status] ?? 0.1 : 0;

  const sendMessage = async () => {
    if (!order || !draft.trim()) return;
    setSending(true);
    try {
      const message = await sendOrderChatMessage(order.id, draft.trim());
      setMessages((prev) => [...prev, message]);
      setDraft('');
      createBrowserNotificationSound();
    } catch {
      // no-op, backend message will be surfaced by global toast handler if any
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] overflow-hidden">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-3">
                <span>Chi tiết đơn hàng #{order.id}</span>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="grid xl:grid-cols-[1.25fr_0.9fr] gap-5 overflow-hidden">
              <ScrollArea className="max-h-[74vh] pr-4">
                <div className="space-y-5 pb-6">
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày đặt: {formatDate(order.created_at)}</p>
                        <p className="text-sm text-muted-foreground mt-1">Địa chỉ: {order.shipping_address.street}, {order.shipping_address.district}, {order.shipping_address.city}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1">{order.payment_method}</Badge>
                    </div>
                    <div className="space-y-4">
                      {timeline.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className="flex gap-3">
                            <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border ${item.active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 pb-4 border-b last:border-0 last:pb-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium">{item.label}</p>
                                <span className="text-xs text-muted-foreground">{formatDate(item.time)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background p-5">
                    <div className="flex items-center gap-2 mb-4"><MapPinned className="h-4 w-4 text-primary" /><h3 className="font-semibold">Bản đồ giao hàng giả lập</h3></div>
                    <div className="relative overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_32%),linear-gradient(180deg,rgba(148,163,184,0.08),rgba(148,163,184,0.02))] h-72">
                      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
                      <div className="absolute left-[8%] right-[10%] top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary/15" />
                      <div className="absolute left-[8%] top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(12, progress * 82)}%` }} />
                      {mapStops.map((stop, index) => (
                        <div key={stop.label} className="absolute" style={{ left: stop.left, top: stop.top }}>
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${progress >= (index + 1) / mapStops.length ? 'border-primary bg-primary' : 'border-background bg-muted'}`}>
                            <Circle className="h-2.5 w-2.5 text-background fill-current" />
                          </div>
                          <span className="mt-2 block text-[11px] font-medium text-foreground/80">{stop.label}</span>
                        </div>
                      ))}
                      <div className="absolute top-[46%] -translate-y-1/2 -translate-x-1/2 rounded-full border bg-background p-2 shadow-lg transition-all duration-700" style={{ left: `${Math.max(10, progress * 83)}%` }}>
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background p-5 space-y-4">
                    <h3 className="font-semibold">Sản phẩm và thanh toán</h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <img src={item.product.images[0]} alt="" className="w-16 h-20 rounded-md object-cover bg-muted" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop'; }} />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.variant.color} / {item.variant.size} × {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(order.subtotal || order.total_amount)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span>{(order.shipping_fee || 0) === 0 ? 'Miễn phí' : formatCurrency(order.shipping_fee || 0)}</span></div>
                      {(order.discount_amount || 0) > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatCurrency(order.discount_amount || 0)}</span></div>}
                      <div className="flex justify-between font-semibold text-base pt-2 border-t"><span>Tổng cộng</span><span className="text-primary">{formatCurrency(order.total_amount)}</span></div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="rounded-2xl border bg-background p-5 flex flex-col max-h-[74vh]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2"><MessageCircleMore className="h-4 w-4 text-primary" /><h3 className="font-semibold">Chat trực tiếp với admin</h3></div>
                  </div>
                  <Badge className="rounded-full">Online</Badge>
                </div>

                <ScrollArea className="flex-1 rounded-2xl border bg-muted/20 px-3 py-4">
                  <div className="space-y-3">
                    {loadingMessages && <p className="text-sm text-muted-foreground">Đang tải hội thoại...</p>}
                    {!loadingMessages && messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm shadow-sm ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                          <p className="text-[11px] mb-1 opacity-70">{message.sender === 'user' ? 'Bạn' : message.sender_name || 'Admin Shop'}</p>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="mt-4 space-y-3">
                  <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nhập tin nhắn cho admin về đơn hàng này..." className="min-h-[110px] resize-none" />
                  <Button type="button" className="w-full" onClick={sendMessage} disabled={sending}>
                    <Send className="h-4 w-4 mr-2" /> {sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

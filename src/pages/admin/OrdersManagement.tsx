import { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircleMore, PackageSearch, RefreshCcw, Send } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { getAccountOrders } from '@/lib/account-data';
import { subscribeRealtimeUpdate } from '@/lib/realtime-order';
import { apiFetch } from '@/lib/api';
import { fetchOrderChatMessages, sendOrderChatMessage } from '@/lib/order-chat-api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts, mockUsers } from '@/data/mock';
import type { ChatMessage, Order } from '@/types';

type AdminOrder = {
  id: string;
  orderCode: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  voucherCode?: string | null;
  totalAmount: number;
  paymentMethod: 'COD' | 'BANKING' | 'VNPAY';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  user: { id: string; fullName: string; email: string; };
  address: { fullName: string; phone: string; street: string; district: string; city: string; };
  items: Array<{ id: string; productName: string; quantity: number; unitPrice: number; productId?: string; imageUrl?: string; }>;
  source: 'api' | 'local';
};

const paymentMethodLabel: Record<string, string> = { COD: 'COD', BANKING: 'Chuyển khoản', VNPAY: 'VNPay' };
const paymentStatusLabel: Record<string, string> = { PENDING: 'Chờ thanh toán', PAID: 'Đã thanh toán', FAILED: 'Thanh toán lỗi' };
const normalizeStatus = (status: AdminOrder['status']) => status.toLowerCase() as 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
const fallbackImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop';
const getImageUrl = (productId?: string, imageUrl?: string) => imageUrl || mockProducts.find((product) => product.id === productId)?.images?.[0] || fallbackImage;

const normalizeLocalOrder = (order: Order): AdminOrder => {
  const matchedUser = mockUsers.find((user) => user.id === order.user_id);
  return {
    id: order.id,
    orderCode: order.id,
    status: order.status.toUpperCase() as AdminOrder['status'],
    subtotal: order.subtotal || order.total_amount,
    shippingFee: order.shipping_fee || 0,
    discountAmount: order.discount_amount || 0,
    voucherCode: order.voucher_code || null,
    totalAmount: order.total_amount,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status || 'PENDING',
    createdAt: order.created_at,
    user: {
      id: order.user_id,
      fullName: matchedUser?.full_name || 'Khách hàng',
      email: matchedUser?.email || `${order.user_id}@local.shop`,
    },
    address: {
      fullName: order.shipping_address.full_name,
      phone: order.shipping_address.phone,
      street: order.shipping_address.street,
      district: order.shipping_address.district,
      city: order.shipping_address.city,
    },
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.price,
      imageUrl: item.product.images?.[0],
    })),
    source: 'local',
  };
};

const dedupeOrders = (orders: AdminOrder[]) => {
  const map = new Map<string, AdminOrder>();
  orders.forEach((order) => {
    const existing = map.get(order.id);
    if (!existing || (existing.source === 'local' && order.source === 'api')) map.set(order.id, order);
  });
  return Array.from(map.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
};

const getBrowserLocalOrders = (): AdminOrder[] => {
  if (typeof window === 'undefined') return mockUsers.flatMap((user) => getAccountOrders(user.id).map(normalizeLocalOrder));
  const ids = new Set(mockUsers.map((user) => user.id));
  Object.keys(window.localStorage).forEach((key) => {
    const match = key.match(/^shopclothes:(.+):orders$/);
    if (match?.[1]) ids.add(match[1]);
  });
  return Array.from(ids).flatMap((userId) => getAccountOrders(userId).map(normalizeLocalOrder));
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const syncSelectedOrder = (allOrders: AdminOrder[]) => {
    setSelectedOrder((prev) => (prev ? allOrders.find((order) => order.id === prev.id) || prev : null));
  };

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const apiOrders = await apiFetch<any[]>('/orders/admin').catch(() => []);
      const normalizedApiOrders: AdminOrder[] = apiOrders.map((order) => ({
        ...order,
        source: 'api' as const,
        items: (order.items || []).map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          imageUrl: getImageUrl(item.productId, item.product?.imageUrl),
        })),
      }));
      const merged = dedupeOrders([...normalizedApiOrders, ...getBrowserLocalOrders()]);
      setOrders(merged);
      syncSelectedOrder(merged);
    } catch (err) {
      const merged = dedupeOrders(getBrowserLocalOrders());
      setOrders(merged);
      syncSelectedOrder(merged);
      setError(err instanceof Error ? err.message : 'Không tải được danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async () => {
    if (!selectedOrder) return;
    setLoadingChat(true);
    try {
      const data = await fetchOrderChatMessages(selectedOrder.id);
      setChatMessages(data);
    } catch {
      setChatMessages([]);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);
  useEffect(() => subscribeRealtimeUpdate(() => { loadOrders(); }), []);
  useEffect(() => {
    if (!selectedOrder) { setChatMessages([]); return; }
    loadChat();
  }, [selectedOrder?.id]);
  useEffect(() => subscribeRealtimeUpdate(() => { if (selectedOrder) loadChat(); }), [selectedOrder?.id]);

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0), [orders]);

  const handleStatusChange = async (status: AdminOrder['status']) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      if (selectedOrder.source === 'api') {
        await apiFetch(`/orders/admin/${selectedOrder.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, paymentStatus: status === 'DELIVERED' ? 'PAID' : selectedOrder.paymentStatus }),
        });
      }
      await loadOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không cập nhật được trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedOrder || !chatDraft.trim()) return;
    try {
      const message = await sendOrderChatMessage(selectedOrder.id, chatDraft.trim());
      setChatMessages((prev) => [...prev, message]);
      setChatDraft('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không gửi được phản hồi');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-sm text-muted-foreground mt-1">Chat admin đã lưu DB thật và tự reload khi có socket/websocket.</p>
        </div>
        <Button type="button" variant="outline" onClick={loadOrders} disabled={loading}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Làm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background rounded-lg shadow-soft p-5"><p className="text-sm text-muted-foreground">Tổng đơn hàng</p><p className="text-2xl font-bold mt-2">{orders.length}</p></div>
        <div className="bg-background rounded-lg shadow-soft p-5"><p className="text-sm text-muted-foreground">Tổng doanh thu</p><p className="text-2xl font-bold mt-2">{formatCurrency(totalRevenue)}</p></div>
        <div className="bg-background rounded-lg shadow-soft p-5"><p className="text-sm text-muted-foreground">Đơn đã thanh toán</p><p className="text-2xl font-bold mt-2">{orders.filter((order) => order.paymentStatus === 'PAID').length}</p></div>
      </div>

      <div className="bg-background rounded-lg shadow-soft overflow-hidden">
        {loading ? <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />Đang tải đơn hàng...</div>
          : error && orders.length === 0 ? <div className="p-10 text-center text-red-500 space-y-3"><p>{error}</p><Button type="button" variant="outline" onClick={loadOrders}>Thử lại</Button></div>
          : orders.length === 0 ? <div className="p-12 text-center text-muted-foreground"><PackageSearch className="w-10 h-10 mx-auto mb-3 opacity-40" />Chưa có đơn hàng nào trong hệ thống.</div>
            : <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1280px]">
                <thead><tr className="border-b bg-muted/30"><th className="text-left p-4 font-medium">Mã đơn</th><th className="text-left p-4 font-medium">Khách hàng</th><th className="text-left p-4 font-medium">Sản phẩm</th><th className="text-left p-4 font-medium">Ngày đặt</th><th className="text-left p-4 font-medium">Thanh toán</th><th className="text-left p-4 font-medium">Trạng thái</th><th className="text-right p-4 font-medium">Tổng tiền</th><th className="text-right p-4 font-medium">Chi tiết</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={`${order.source}-${order.id}`} className="border-b align-top hover:bg-muted/20">
                      <td className="p-4"><p className="font-medium">#{order.orderCode}</p>{order.voucherCode && <p className="text-xs text-green-600 mt-1">Voucher: {order.voucherCode}</p>}</td>
                      <td className="p-4"><p className="font-medium">{order.address.fullName || order.user.fullName}</p><p className="text-muted-foreground text-xs">{order.user.email}</p><p className="text-muted-foreground text-xs">{order.address.phone}</p></td>
                      <td className="p-4"><div className="space-y-2">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3"><img src={getImageUrl(item.productId, item.imageUrl)} alt="" className="w-11 h-14 rounded-md object-cover bg-muted border" onError={(event) => { event.currentTarget.src = fallbackImage; }} /><div><p className="text-xs font-medium line-clamp-1">{item.productName}</p><p className="text-xs text-muted-foreground">SL: {item.quantity}</p></div></div>)}</div></td>
                      <td className="p-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="p-4"><p>{paymentMethodLabel[order.paymentMethod] || order.paymentMethod}</p><p className="text-xs text-muted-foreground">{paymentStatusLabel[order.paymentStatus] || order.paymentStatus}</p></td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(normalizeStatus(order.status))}`}>{getStatusLabel(normalizeStatus(order.status))}</span></td>
                      <td className="p-4 text-right"><p className="font-medium">{formatCurrency(order.totalAmount)}</p></td>
                      <td className="p-4 text-right"><Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Xem chi tiết</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader><DialogTitle>Chi tiết đơn hàng {selectedOrder ? `#${selectedOrder.orderCode}` : ''}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-5 text-sm">
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 space-y-2">
                    <p className="font-semibold">Khách hàng</p>
                    <p>{selectedOrder.address.fullName}</p><p>{selectedOrder.user.email}</p><p>{selectedOrder.address.phone}</p><p>{selectedOrder.address.street}, {selectedOrder.address.district}, {selectedOrder.address.city}</p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-2">
                    <p className="font-semibold">Thanh toán</p>
                    <p>Phương thức: {paymentMethodLabel[selectedOrder.paymentMethod]}</p><p>Trạng thái thanh toán: {paymentStatusLabel[selectedOrder.paymentStatus]}</p><p>Tạm tính: {formatCurrency(selectedOrder.subtotal)}</p><p>Phí ship: {formatCurrency(selectedOrder.shippingFee)}</p>{selectedOrder.discountAmount > 0 && <p>Giảm giá: -{formatCurrency(selectedOrder.discountAmount)}</p>}{selectedOrder.voucherCode && <p>Voucher: {selectedOrder.voucherCode}</p>}<p className="font-semibold">Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="font-semibold">Sản phẩm trong đơn</p>
                  {selectedOrder.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border-b last:border-0 pb-3 last:pb-0"><div className="flex items-center gap-3 min-w-0"><img src={getImageUrl(item.productId, item.imageUrl)} alt="" className="w-14 h-16 rounded-md object-cover bg-muted border" onError={(event) => { event.currentTarget.src = fallbackImage; }} /><div><p className="font-medium line-clamp-1">{item.productName}</p><p className="text-muted-foreground">SL: {item.quantity}</p></div></div><p>{formatCurrency(item.unitPrice)}</p></div>)}
                </div>
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="font-semibold">Cập nhật trạng thái</p>
                  <div className="flex flex-wrap gap-2">{(['PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED'] as const).map((status) => <Button key={status} variant={selectedOrder.status === status ? 'default' : 'outline'} disabled={updating || selectedOrder.source !== 'api'} onClick={() => handleStatusChange(status)}>{status === 'PENDING' ? 'Chờ xử lý' : status === 'CONFIRMED' ? 'Đã xác nhận' : status === 'SHIPPING' ? 'Đang vận chuyển' : status === 'DELIVERED' ? 'Thành công' : 'Đã huỷ'}</Button>)}</div>
                  {selectedOrder.source !== 'api' && <p className="text-xs text-muted-foreground">Đơn local chỉ xem/chat, trạng thái thật cập nhật trên backend.</p>}
                </div>
              </div>
              <div className="rounded-lg border p-4 flex flex-col min-h-[560px]">
                <div className="flex items-center justify-between gap-3 mb-4"><div><div className="flex items-center gap-2"><MessageCircleMore className="w-4 h-4 text-primary" /><p className="font-semibold">Chat với khách trong đơn hàng</p></div><p className="text-muted-foreground text-sm mt-1">Tin nhắn đã lưu DB thật.</p></div><Badge className="rounded-full">Online</Badge></div>
                <ScrollArea className="flex-1 rounded-xl border bg-muted/20 px-3 py-4"><div className="space-y-3">{loadingChat && <p className="text-sm text-muted-foreground">Đang tải hội thoại...</p>}{!loadingChat && chatMessages.map((message) => <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-3 py-2 ${message.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}><p className="text-[11px] mb-1 opacity-70">{message.sender === 'admin' ? 'Admin Shop' : message.sender_name || 'Khách hàng'}</p><p>{message.content}</p></div></div>)}</div></ScrollArea>
                <div className="mt-4 space-y-3"><Textarea value={chatDraft} onChange={(e) => setChatDraft(e.target.value)} disabled={selectedOrder.source !== 'api'} className="min-h-[120px] resize-none" placeholder={selectedOrder.source === 'api' ? 'Nhập nội dung phản hồi cho khách hàng...' : 'Đơn local chỉ hỗ trợ chat khi đã có trên backend'} /><Button onClick={handleSendReply} className="w-full" disabled={selectedOrder.source !== 'api'}><Send className="w-4 h-4 mr-2" /> Gửi phản hồi</Button></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;

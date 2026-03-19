import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getAccountNotifications, getAccountOrders, markAllNotificationsRead, markNotificationRead } from '@/lib/account-data';
import { Button } from '@/components/ui/button';
import type { Notification, Order } from '@/types';
import { OrderDetailPopup } from '@/components/order/OrderExperience';
import { createBrowserNotificationSound, subscribeRealtimeUpdate } from '@/lib/realtime-order';

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(user ? getAccountNotifications(user.id) : []);
  const [orders, setOrders] = useState<Order[]>(user ? getAccountOrders(user.id) : []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const previousUnread = useRef(0);

  useEffect(() => {
    if (!user) return;
    const sync = () => {
      const nextNotifications = getAccountNotifications(user.id);
      const nextUnread = nextNotifications.filter((item) => !item.is_read).length;
      if (nextUnread > previousUnread.current) createBrowserNotificationSound();
      previousUnread.current = nextUnread;
      setNotifications(nextNotifications);
      setOrders(getAccountOrders(user.id));
    };
    sync();
    return subscribeRealtimeUpdate(sync);
  }, [user]);

  const orderMap = useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);

  const handleReadAll = () => {
    if (!user) return;
    markAllNotificationsRead(user.id);
    setNotifications(getAccountNotifications(user.id));
  };

  const handleReadOne = (notification: Notification) => {
    if (!user) return;
    markNotificationRead(user.id, notification.id);
    setNotifications(getAccountNotifications(user.id));
    const order = notification.order_id ? orderMap.get(notification.order_id) : undefined;
    if (order) setSelectedOrder(order);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        {notifications.length > 0 && isAuthenticated && (
          <Button variant="outline" size="sm" onClick={handleReadAll}>
            <CheckCheck className="w-4 h-4 mr-1" /> Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {!isAuthenticated ? (
          <div className="bg-background rounded-lg shadow-soft p-6 text-sm text-muted-foreground">Hãy đăng nhập để xem thông báo tài khoản của bạn.</div>
        ) : notifications.length === 0 ? (
          <div className="bg-background rounded-lg shadow-soft p-6 text-sm text-muted-foreground">Bạn chưa có thông báo nào.</div>
        ) : notifications.map((n) => (
          <button key={n.id} onClick={() => handleReadOne(n)} className={`w-full text-left bg-background rounded-lg shadow-soft p-4 flex gap-3 transition hover:shadow-md ${!n.is_read ? 'border-l-2 border-l-primary' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{n.title}</h3>
                {!n.is_read && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(n.created_at)}</p>
              {n.order_id && <p className="text-xs text-primary mt-2">Nhấn để mở popup chi tiết đơn hàng #{n.order_id}</p>}
            </div>
          </button>
        ))}
      </div>
      {user && <OrderDetailPopup userId={user.id} order={selectedOrder} open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)} />}
    </div>
  );
};

export default Notifications;

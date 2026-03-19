import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getAccountNotifications, getAccountOrders, markAllNotificationsRead, markNotificationRead } from '@/lib/account-data';
import { Button } from '@/components/ui/button';
import type { Notification, Order } from '@/types';
import { OrderDetailPopup } from '@/components/order/OrderExperience';
import { createBrowserNotificationSound, subscribeRealtimeUpdate } from '@/lib/realtime-order';

const AccountNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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

  if (!user) return null;

  const handleReadAll = () => {
    markAllNotificationsRead(user.id);
    setNotifications(getAccountNotifications(user.id));
  };

  const handleReadOne = (notification: Notification) => {
    markNotificationRead(user.id, notification.id);
    setNotifications(getAccountNotifications(user.id));
    const order = notification.order_id ? orderMap.get(notification.order_id) : undefined;
    if (order) setSelectedOrder(order);
  };

  return (
    <>
      <div className="bg-background rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-lg font-semibold">Thông báo</h2>
            <p className="text-sm text-muted-foreground mt-1">Cập nhật trạng thái đơn hàng theo thời gian thực, click là mở thẳng popup chi tiết.</p>
          </div>
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleReadAll}>
              <CheckCheck className="w-4 h-4 mr-1" /> Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Bạn chưa có thông báo nào.</div>
          ) : notifications.map((n) => (
            <button key={n.id} className={`w-full text-left rounded-lg p-4 flex gap-3 ${!n.is_read ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}`} onClick={() => handleReadOne(n)}>
              <Bell className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium">{n.title}</h3>
                  {!n.is_read && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(n.created_at)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <OrderDetailPopup userId={user.id} order={selectedOrder} open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)} />
    </>
  );
};

export default AccountNotifications;

import { useEffect, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getAccountOrders } from '@/lib/account-data';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { OrderDetailPopup } from '@/components/order/OrderExperience';
import { subscribeRealtimeUpdate } from '@/lib/realtime-order';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(user ? getAccountOrders(user.id) : []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    setOrders(getAccountOrders(user.id));
    return subscribeRealtimeUpdate(() => {
      setOrders(getAccountOrders(user.id));
      setSelectedOrder((prev) => prev ? getAccountOrders(user.id).find((order) => order.id === prev.id) || null : null);
    });
  }, [user]);

  return (
    <>
      <div className="bg-background rounded-lg shadow-soft">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Đơn hàng của tôi</h2>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi trạng thái, timeline giao hàng, bản đồ giả lập và chat trực tiếp với admin.</p>
        </div>
        <div className="divide-y">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <PackageSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Bạn chưa có đơn hàng nào.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div>
                    <span className="text-sm font-medium">#{order.id}</span>
                    <span className="text-xs text-muted-foreground ml-3">{formatDate(order.created_at)}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    {order.items.slice(0, 3).map((item) => (
                      <img key={item.id} src={item.product.images[0]} alt="" className="w-12 h-14 rounded object-cover bg-muted" />
                    ))}
                    <div className="text-sm">
                      <p className="text-muted-foreground">{order.items.length} sản phẩm{order.voucher_code ? ` • Voucher ${order.voucher_code}` : ''}</p>
                      <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedOrder(order)}>Xem popup chi tiết</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {user && (
        <OrderDetailPopup
          userId={user.id}
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default Orders;

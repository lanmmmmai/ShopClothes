import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAccountOrders } from '@/lib/account-data';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { OrderDetailPopup } from '@/components/order/OrderExperience';
import { subscribeRealtimeUpdate } from '@/lib/realtime-order';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(user ? getAccountOrders(user.id).find((o) => o.id === id) || null : null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    setOrder(getAccountOrders(user.id).find((o) => o.id === id) || null);
    return subscribeRealtimeUpdate(() => {
      setOrder(getAccountOrders(user.id).find((o) => o.id === id) || null);
    });
  }, [id, user]);

  if (!order || !user) return <div className="p-6 bg-background rounded-lg shadow-soft text-muted-foreground">Không tìm thấy đơn hàng</div>;

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>
      <div className="bg-background rounded-lg shadow-soft p-6 space-y-3">
        <h2 className="text-lg font-semibold">Đơn hàng #{order.id}</h2>
        <p className="text-sm text-muted-foreground">Trang này giờ mở popup trải nghiệm mới gồm timeline giao hàng, bản đồ giả lập và chat trực tiếp với admin.</p>
        <Button onClick={() => setOpen(true)}>Mở popup chi tiết đơn hàng</Button>
      </div>
      <OrderDetailPopup userId={user.id} order={order} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default OrderDetail;

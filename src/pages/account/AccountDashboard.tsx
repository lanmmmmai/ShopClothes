import { Bell, Coins, CreditCard, MapPin, Package, Ticket, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getAccountAddresses, getAccountNotifications, getAccountOrders, getAccountPaymentMethods } from '@/lib/account-data';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';

const AccountDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const orders = getAccountOrders(user.id);
  const notifications = getAccountNotifications(user.id);
  const addresses = getAccountAddresses(user.id);
  const payments = getAccountPaymentMethods(user.id);

  const unreadNotifications = notifications.filter((item) => !item.is_read).length;
  const deliveredOrders = orders.filter((item) => item.status === 'delivered').length;
  const totalSpent = orders
    .filter((item) => item.status !== 'cancelled')
    .reduce((sum, item) => sum + item.total_amount, 0);
  const latestOrders = orders.slice(0, 3);
  const orderStatusSummary = [
    { label: 'Chờ xử lý', count: orders.filter((item) => item.status === 'pending').length },
    { label: 'Đã xác nhận', count: orders.filter((item) => item.status === 'confirmed').length },
    { label: 'Đang giao', count: orders.filter((item) => item.status === 'shipping').length },
    { label: 'Đã giao', count: orders.filter((item) => item.status === 'delivered').length },
  ];
  const maxStatusCount = Math.max(...orderStatusSummary.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border bg-background p-6 md:p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Trang tổng quan</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Xin chào, {user.full_name || user.fullName}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Theo dõi đơn hàng, số xu hiện có, thông báo mới và truy cập nhanh các mục tài khoản từ một màn hình gọn gàng hơn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-primary hover:bg-primary/90">
              <Link to="/account/profile">Cập nhật hồ sơ</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/account/orders">Xem đơn hàng</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border bg-gradient-to-br from-primary/10 via-background to-rose-50 p-5 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Package className="h-5 w-5" /><span className="font-medium">Tổng đơn hàng</span></div>
          <p className="mt-4 text-3xl font-bold">{orders.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">{deliveredOrders} đơn đã hoàn tất</p>
        </div>
        <div className="rounded-[24px] border bg-background p-5 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Coins className="h-5 w-5" /><span className="font-medium">Xu tích lũy</span></div>
          <p className="mt-4 text-3xl font-bold">{user.coinBalance ?? user.loyalty_points ?? 0}</p>
          <p className="mt-1 text-sm text-muted-foreground">Có thể dùng khi áp voucher / vòng quay</p>
        </div>
        <div className="rounded-[24px] border bg-background p-5 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Bell className="h-5 w-5" /><span className="font-medium">Thông báo mới</span></div>
          <p className="mt-4 text-3xl font-bold">{unreadNotifications}</p>
          <p className="mt-1 text-sm text-muted-foreground">Cần đọc và xử lý trong tài khoản</p>
        </div>
        <div className="rounded-[24px] border bg-background p-5 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><TrendingUp className="h-5 w-5" /><span className="font-medium">Tổng chi tiêu</span></div>
          <p className="mt-4 text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Tính trên các đơn chưa bị hủy</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[28px] border bg-background p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">Đơn hàng gần đây</h3>
              <p className="mt-1 text-sm text-muted-foreground">Xem nhanh tình trạng đơn và giá trị thanh toán gần nhất.</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/account/orders">Tất cả đơn</Link>
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {latestOrders.length ? latestOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">#{order.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.created_at)} • {order.items.length} sản phẩm</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{getStatusLabel(order.status)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Bạn chưa có đơn hàng nào để hiển thị trên dashboard.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border bg-background p-6 shadow-soft">
            <h3 className="text-xl font-semibold">Trạng thái đơn hàng</h3>
            <p className="mt-1 text-sm text-muted-foreground">Phân bố đơn hàng hiện tại trong tài khoản của bạn.</p>
            <div className="mt-5 space-y-4">
              {orderStatusSummary.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted">
                    <div className="h-2.5 rounded-full bg-primary" style={{ width: `${(item.count / maxStatusCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border bg-background p-6 shadow-soft">
            <h3 className="text-xl font-semibold">Truy cập nhanh</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link to="/account/addresses" className="rounded-2xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3 font-medium"><MapPin className="h-4 w-4 text-primary" /> Địa chỉ</div>
                <p className="mt-2 text-sm text-muted-foreground">{addresses.length} địa chỉ đã lưu</p>
              </Link>
              <Link to="/account/payments" className="rounded-2xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3 font-medium"><CreditCard className="h-4 w-4 text-primary" /> Thanh toán</div>
                <p className="mt-2 text-sm text-muted-foreground">{payments.length} phương thức đã thêm</p>
              </Link>
              <Link to="/account/vouchers" className="rounded-2xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3 font-medium"><Ticket className="h-4 w-4 text-primary" /> Voucher</div>
                <p className="mt-2 text-sm text-muted-foreground">Quản lý mã giảm giá của bạn</p>
              </Link>
              <Link to="/account/notifications" className="rounded-2xl border p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3 font-medium"><Bell className="h-4 w-4 text-primary" /> Thông báo</div>
                <p className="mt-2 text-sm text-muted-foreground">{unreadNotifications} thông báo chưa đọc</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountDashboard;

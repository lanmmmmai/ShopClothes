import { useEffect, useMemo, useState } from 'react';
import { DollarSign, Package, ShoppingCart, Ticket, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { apiFetch } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type Order = { id: string; orderCode: string; totalAmount: number; createdAt: string; voucherCode?: string | null; };
type Product = { id: string; name: string; imageUrl?: string | null; soldCount: number; stock: number; };
type User = { id: string; fullName: string; };
type Voucher = { id: string; code: string; quantity: number; usedCount: number; };

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<Order[]>('/orders/admin').catch(() => []),
      apiFetch<Product[]>('/products').catch(() => []),
      apiFetch<User[]>('/auth/admin/users').catch(() => []),
      apiFetch<{ vouchers: Voucher[] }>('/admin/rewards').then((data) => data.vouchers).catch(() => []),
    ]).then(([orderData, productData, userData, voucherData]) => {
      setOrders(orderData);
      setProducts(productData);
      setUsers(userData);
      setVouchers(voucherData);
    });
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, item) => sum + item.totalAmount, 0), [orders]);

  const revenueChartData = useMemo(() => {
    const grouped = new Map<string, { day: string; revenue: number; orders: number }>();
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          day: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          revenue: 0,
          orders: 0,
        });
      }
      const item = grouped.get(key)!;
      item.revenue += order.totalAmount;
      item.orders += 1;
    });
    return [...grouped.values()].slice(-7);
  }, [orders]);

  const stats = [
    { label: 'Doanh thu', value: formatCurrency(revenue), icon: DollarSign },
    { label: 'Đơn hàng', value: String(orders.length), icon: ShoppingCart },
    { label: 'Sản phẩm', value: String(products.length), icon: Package },
    { label: 'Người dùng', value: String(users.length), icon: Users },
    { label: 'Voucher', value: String(vouchers.length), icon: Ticket },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">Dashboard đã đồng bộ dữ liệu thật từ backend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-background rounded-lg shadow-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold break-all">{s.value}</p>
            {s.label === 'Doanh thu' && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Dữ liệu từ đơn hàng thật</p>}
          </div>
        ))}
      </div>

      <div className="bg-background rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <div className="flex items-center gap-3"><h3 className="font-semibold">Biểu đồ doanh thu 7 ngày gần nhất</h3><Link to="/admin/revenue" className="text-sm text-primary hover:underline">Xem theo tháng / năm</Link></div>
            <p className="text-sm text-muted-foreground">Theo tổng tiền đơn hàng đã phát sinh trên hệ thống.</p>
          </div>
          <span className="text-sm text-muted-foreground">Tổng {formatCurrency(revenue)}</span>
        </div>
        <ChartContainer
          config={{ revenue: { label: 'Doanh thu', color: 'hsl(var(--primary))' } }}
          className="h-[260px] w-full"
        >
          <BarChart data={revenueChartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-lg shadow-soft p-6">
          <h3 className="font-semibold mb-4">Đơn hàng gần đây</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between text-sm gap-3">
                <div>
                  <span className="font-medium block">#{o.orderCode}</span>
                  <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <span className="text-muted-foreground">{formatCurrency(o.totalAmount)}</span>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-muted-foreground">Chưa có đơn hàng nào.</p>}
          </div>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline mt-4 inline-block">Xem tất cả →</Link>
        </div>
        <div className="bg-background rounded-lg shadow-soft p-6">
          <h3 className="font-semibold mb-4">Sản phẩm bán chạy</h3>
          <div className="space-y-3">
            {[...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <img src={p.imageUrl || 'https://placehold.co/80x100?text=No+Image'} alt="" className="w-10 h-12 rounded object-cover bg-muted" />
                <div className="flex-1 min-w-0"><p className="truncate font-medium">{p.name}</p></div>
                <span className="text-muted-foreground">Bán {p.soldCount}</span>
              </div>
            ))}
            {!products.length && <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

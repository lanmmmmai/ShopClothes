import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { apiFetch } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';


type Order = {
  id: string;
  orderCode: string;
  totalAmount: number;
  createdAt: string;
  status?: string;
};

type RangeMode = 'month' | 'year';

type ChartPoint = {
  label: string;
  revenue: number;
  orders: number;
  fullLabel: string;
};

const fillMissingDailyData = (year: number, month: number, raw: Map<number, { revenue: number; orders: number }>) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const item = raw.get(day) || { revenue: 0, orders: 0 };
    return {
      label: `${day}`,
      fullLabel: `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`,
      revenue: item.revenue,
      orders: item.orders,
    };
  });
};

const Revenue = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode] = useState<RangeMode>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Order[]>('/orders/admin')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const paidOrders = useMemo(() => {
    return orders.filter((order) => !['CANCELLED', 'FAILED'].includes((order.status || '').toUpperCase()));
  }, [orders]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyChartData = useMemo<ChartPoint[]>(() => {
    const grouped = new Map<number, { revenue: number; orders: number }>();
    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) return;
      const key = date.getDate();
      const prev = grouped.get(key) || { revenue: 0, orders: 0 };
      grouped.set(key, {
        revenue: prev.revenue + (order.totalAmount || 0),
        orders: prev.orders + 1,
      });
    });
    return fillMissingDailyData(currentYear, currentMonth, grouped);
  }, [paidOrders, currentMonth, currentYear]);

  const yearlyChartData = useMemo<ChartPoint[]>(() => {
    const grouped = new Map<number, { revenue: number; orders: number }>();
    paidOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const key = date.getMonth();
      const prev = grouped.get(key) || { revenue: 0, orders: 0 };
      grouped.set(key, {
        revenue: prev.revenue + (order.totalAmount || 0),
        orders: prev.orders + 1,
      });
    });
    return Array.from({ length: 12 }, (_, index) => {
      const item = grouped.get(index) || { revenue: 0, orders: 0 };
      return {
        label: `T${index + 1}`,
        fullLabel: `Tháng ${index + 1}/${currentYear}`,
        revenue: item.revenue,
        orders: item.orders,
      };
    });
  }, [paidOrders, currentYear]);

  const chartData = mode === 'month' ? monthlyChartData : yearlyChartData;
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const bestPoint = [...chartData].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Doanh thu</h1>
          <p className="text-sm text-muted-foreground">Xem biểu đồ doanh thu theo tháng hoặc theo năm từ đơn hàng thật.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-background p-1 w-fit">
          <Button type="button" variant={mode === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setMode('month')}>
            Theo tháng
          </Button>
          <Button type="button" variant={mode === 'year' ? 'default' : 'ghost'} size="sm" onClick={() => setMode('year')}>
            Theo năm
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-background p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{mode === 'month' ? 'Trong tháng hiện tại' : 'Trong năm hiện tại'}</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Số đơn hàng</p>
          <p className="mt-2 text-2xl font-bold">{totalOrders}</p>
          <p className="mt-1 text-xs text-muted-foreground">Đơn hợp lệ đã phát sinh doanh thu</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Mốc cao nhất</p>
          <p className="mt-2 text-xl font-bold">{bestPoint ? bestPoint.fullLabel : 'Chưa có dữ liệu'}</p>
          <p className="mt-1 text-xs text-muted-foreground">{bestPoint ? formatCurrency(bestPoint.revenue) : '0 đ'}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="font-semibold">{mode === 'month' ? 'Biểu đồ doanh thu theo ngày trong tháng' : 'Biểu đồ doanh thu theo tháng trong năm'}</h3>
          <p className="text-sm text-muted-foreground">
            {mode === 'month'
              ? `Tháng ${currentMonth + 1}/${currentYear}`
              : `Năm ${currentYear}`}
          </p>
        </div>

        {loading ? (
          <div className="h-[360px] rounded-xl bg-muted/40 animate-pulse" />
        ) : (
          <ChartContainer
            config={{ revenue: { label: 'Doanh thu', color: 'hsl(var(--primary))' } }}
            className="h-[360px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 12, right: 12, top: 8 }} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} minTickGap={mode === 'month' ? 10 : 18} />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`} tickLine={false} axisLine={false} width={52} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, _name, item) => {
                        const payload = item?.payload as ChartPoint | undefined;
                        return (
                          <div className="space-y-1">
                            <p className="font-medium">{payload?.fullLabel}</p>
                            <p>{formatCurrency(Number(value || 0))}</p>
                            <p className="text-xs text-muted-foreground">{payload?.orders || 0} đơn hàng</p>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.label}-${index}`} fill={entry.revenue > 0 ? 'var(--color-revenue)' : 'hsl(var(--muted))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default Revenue;

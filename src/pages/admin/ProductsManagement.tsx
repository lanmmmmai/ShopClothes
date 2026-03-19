import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Edit, LineChart, Package2, Plus, RefreshCcw, Sparkles, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  soldCount: number;
};

const COLORS = ['#d63b64', '#161616', '#5ab66f', '#c96d88', '#e5b8c6', '#f2d7ad'];
const fallbackImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop';

const ProductsManagement = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<AdminProduct[]>('/products');
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (product: AdminProduct) => {
    const ok = window.confirm(`Xoá sản phẩm "${product.name}"?`);
    if (!ok) return;
    try {
      await apiFetch(`/products/${product.id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xoá sản phẩm');
    }
  };

  const sortedByPrice = useMemo(() => [...products].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)), [products]);
  const popularProducts = useMemo(() => [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5), [products]);
  const chartData = useMemo(() => [...products]
    .sort((a, b) => ((b.salePrice || b.price) * Math.max(b.soldCount, 1)) - ((a.salePrice || a.price) * Math.max(a.soldCount, 1)))
    .slice(0, 6)
    .map((product) => ({
      name: product.name.length > 16 ? `${product.name.slice(0, 16)}…` : product.name,
      fullName: product.name,
      revenue: (product.salePrice || product.price) * Math.max(product.soldCount, 1),
      soldCount: product.soldCount,
    })), [products]);

  const totalRevenue = useMemo(() => products.reduce((sum, product) => sum + (product.salePrice || product.price) * Math.max(product.soldCount, 1), 0), [products]);
  const totalOrders = useMemo(() => products.reduce((sum, product) => sum + product.soldCount, 0), [products]);
  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Phân tích sản phẩm</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Giữ tinh thần bố cục của trang voucher: ít màu, chia lớp rõ, tiêu đề đậm và thẻ bo tròn mềm hơn.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={loadProducts} disabled={loading} className="rounded-2xl"><RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Làm mới</Button>
          <Link to="/admin/products/new"><Button className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1"><Plus className="w-4 h-4" /> Thêm sản phẩm</Button></Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border bg-gradient-to-br from-primary/10 via-background to-amber-50 p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Sparkles className="w-5 h-5" /><span className="font-semibold">Tổng doanh thu</span></div>
          <p className="mt-4 text-4xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Tính theo giá đang bán và số lượng đã bán của từng sản phẩm.</p>
        </div>
        <div className="rounded-[28px] border bg-background p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Package2 className="w-5 h-5" /><span className="font-semibold">Tổng số lượt bán</span></div>
          <p className="mt-4 text-4xl font-bold">{totalOrders}</p>
          <p className="mt-2 text-sm text-muted-foreground">Tổng đơn vị sản phẩm đã bán ra trong hệ thống.</p>
        </div>
        <div className="rounded-[28px] border bg-background p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><LineChart className="w-5 h-5" /><span className="font-semibold">Tồn kho hiện tại</span></div>
          <p className="mt-4 text-4xl font-bold">{totalStock}</p>
          <p className="mt-2 text-sm text-muted-foreground">Số lượng còn lại để theo dõi nhập hàng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-6">
        <div className="rounded-[28px] border bg-background p-6 shadow-soft overflow-x-auto">
          <div className="flex items-center justify-between mb-5 gap-3">
            <div>
              <h3 className="text-2xl font-semibold">Sản phẩm nổi bật</h3>
              <p className="text-sm text-muted-foreground mt-1">Danh sách được ưu tiên theo giá bán cao, bố cục gọn tương tự khu danh sách voucher.</p>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2 rounded-xl">Sort: Giá bán ↓</Badge>
          </div>
          {error ? <div className="p-6 text-red-500">{error}</div> : (
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="bg-muted/30 text-base text-muted-foreground">
                  <th className="p-4">STT</th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Giá thành</th>
                  <th className="p-4">Đã bán</th>
                  <th className="p-4">Doanh thu</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedByPrice.map((product, index) => (
                  <tr key={product.id} className="border-b align-middle text-sm">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl || fallbackImage} alt="" className="w-14 h-14 rounded-2xl object-cover border" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                        <div>
                          <p className="font-semibold text-base text-foreground">{product.name}</p>
                          <p className="text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(product.salePrice || product.price)}</td>
                    <td className="p-4">{product.soldCount.toLocaleString('vi-VN')} cái</td>
                    <td className="p-4">{formatCurrency((product.salePrice || product.price) * Math.max(product.soldCount, 1))}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${product.id}`}><Button variant="outline" size="sm" className="rounded-xl"><Edit className="w-4 h-4" /> Sửa</Button></Link>
                        <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => handleDelete(product)}><Trash2 className="w-4 h-4" /> Xoá</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && !products.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Chưa có sản phẩm nào.</td></tr>}
                {loading && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Đang tải sản phẩm...</td></tr>}
              </tbody>
            </table>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border bg-background p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-semibold">Sản phẩm phổ biến</h3><span className="text-sm text-muted-foreground">Tuần này</span></div>
            <div className="space-y-5">
              {popularProducts.map((product, index) => {
                const percent = popularProducts[0]?.soldCount ? Math.max((product.soldCount / popularProducts[0].soldCount) * 100, 10) : 10;
                return (
                  <div key={product.id}>
                    <div className="flex items-center justify-between gap-3"><p className="font-medium">{product.name}</p><span className="text-sm text-muted-foreground">{product.soldCount.toLocaleString('vi-VN')} lượt bán</span></div>
                    <div className="mt-2 h-3 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: COLORS[index % COLORS.length] }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border bg-background p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-semibold">Phân tích doanh số</h3><span className="text-sm text-muted-foreground">Biểu đồ theo sản phẩm</span></div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 0, right: 0, top: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tickMargin={10} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`} />
                  <Tooltip formatter={(value: number, _name, item: any) => [formatCurrency(value), item?.payload?.fullName || '']} />
                  <Bar dataKey="revenue" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Biểu đồ cột thay cho vòng tròn để dễ so sánh doanh thu giữa các sản phẩm hơn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;

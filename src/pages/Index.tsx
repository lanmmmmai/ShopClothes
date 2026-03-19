import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCcw, Headphones, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/data/mock';
import { getProductViewCounts, getRecommendedProducts } from '@/lib/product-insights';
import { useMemo } from 'react';

const features = [
  { icon: Truck, title: 'Giao nhanh toàn quốc', desc: 'Đóng gói đẹp, theo dõi đơn dễ dàng.' },
  { icon: RefreshCcw, title: 'Đổi trả linh hoạt', desc: 'Hỗ trợ đổi size trong thời gian quy định.' },
  { icon: ShieldCheck, title: 'Cam kết chính hãng', desc: 'Hình thật, mô tả rõ, chất liệu chọn lọc.' },
  { icon: Headphones, title: 'Chatbot tư vấn 24/7', desc: 'Gợi ý theo nhu cầu và gửi link sản phẩm.' },
];

const Index = () => {
  const featuredProducts = [...mockProducts].sort((a, b) => b.sold_count - a.sold_count).slice(0, 4);
  const newProducts = [...mockProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);
  const personalizedProducts = useMemo(() => getRecommendedProducts(mockProducts, 8), []);
  const viewCounts = getProductViewCounts();
  const topViewed = [...mockProducts]
    .filter(product => viewCounts[product.id])
    .sort((a, b) => (viewCounts[b.id] || 0) - (viewCounts[a.id] || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-muted/30 to-primary/10">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_rgba(255,110,166,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.16),_transparent_28%)]" />
        <div className="container relative mx-auto px-4 py-14 md:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-2 text-xs font-medium text-primary mb-5">
              <Sparkles className="w-4 h-4" /> Bộ sưu tập mới mỗi tuần
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
              Mặc đẹp hơn mỗi ngày với gợi ý mua sắm thông minh.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl leading-7">
              Trang chủ giờ ưu tiên hiển thị nhiều mẫu cùng loại dựa trên lượt xem sản phẩm của bạn, giúp bạn khám phá đúng gu nhanh hơn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="rounded-full px-6 gap-2">Mua ngay <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <Link to="/products?sort=popular">
                <Button size="lg" variant="outline" className="rounded-full px-6">Xem bán chạy</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
              <div className="rounded-2xl bg-background/90 border p-4">
                <p className="text-2xl font-bold">{mockProducts.length}+</p>
                <p className="text-sm text-muted-foreground">Mẫu đang bán</p>
              </div>
              <div className="rounded-2xl bg-background/90 border p-4">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Tư vấn AI</p>
              </div>
              <div className="rounded-2xl bg-background/90 border p-4">
                <p className="text-2xl font-bold">Top gu</p>
                <p className="text-sm text-muted-foreground">Gợi ý theo lượt xem</p>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="grid grid-cols-2 gap-4">
            {mockProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className={`rounded-[28px] overflow-hidden border bg-card shadow-sm ${index === 1 ? 'mt-8' : ''}`}>
                <img src={product.images[0]} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                <div className="p-4">
                  <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{product.detail_fields['Kiểu dáng'] || 'Thanh lịch'}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {topViewed.length > 0 ? topViewed.map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} className="rounded-2xl border bg-card p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.name} className="w-16 h-20 rounded-xl object-cover" />
                <div>
                  <div className="inline-flex items-center gap-1 text-xs text-primary mb-1"><Eye className="w-3 h-3" /> {viewCounts[product.id]} lượt xem</div>
                  <p className="font-medium line-clamp-1">{product.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="md:col-span-3 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
              Hãy xem vài sản phẩm, trang chủ sẽ tự gợi ý thêm nhiều mẫu cùng loại cho bạn.
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Gợi ý theo lượt xem</h2>
            <p className="text-sm text-muted-foreground">Ưu tiên hiện nhiều mẫu cùng loại bạn đã quan tâm.</p>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {personalizedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Danh mục</h2>
          <Link to="/products" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockCategories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-sm font-semibold text-background">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
          <Link to="/products?sort=popular" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="relative rounded-[32px] overflow-hidden bg-muted h-[320px] shadow-sm">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=400&fit=crop" alt="Sale banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/55 to-transparent flex items-center">
            <div className="px-8 md:px-12 max-w-xl">
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Ưu đãi đặc biệt</p>
              <h2 className="text-2xl md:text-4xl font-bold text-background mb-3">Giảm đến 30%</h2>
              <p className="text-background/80 text-sm mb-5">Áp dụng cho bộ sưu tập mới, nhiều mẫu công sở và dạo phố.</p>
              <Link to="/products">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">Mua ngay</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Hàng mới về</h2>
          <Link to="/products?sort=newest" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 rounded-2xl border bg-background/80 p-5">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

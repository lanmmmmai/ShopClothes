import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Heart, Star, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mock';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { getProductViewCounts, getRelatedByViewPreference, trackProductView } from '@/lib/product-insights';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = mockProducts.find(p => p.slug === slug);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (!product) return;
    trackProductView(product.id);
    setViewCount(getProductViewCounts()[product.id] || 1);
  }, [product?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getRelatedByViewPreference(mockProducts, product, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || product.variants[0];

  const handleAddToCart = () => {
    if (variant) addItem(product, variant, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-foreground">Sản phẩm</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-sm border border-border/50">
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Bộ sưu tập nổi bật
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {product.rating} ({product.review_count} đánh giá)</span>
              <span>Đã bán {product.sold_count}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {viewCount} lượt xem gần đây</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.sale_price || product.price)}</span>
            {product.sale_price && (
              <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Phong cách</p>
                <p className="font-medium">{product.detail_fields['Kiểu dáng'] || 'Hiện đại'}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Chất liệu</p>
                <p className="font-medium">{product.detail_fields['Chất liệu'] || 'Cao cấp'}</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Phù hợp</p>
                <p className="font-medium">{product.detail_fields['Dịp mặc'] || 'Đi làm, đi chơi'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Màu sắc: <span className="font-normal text-muted-foreground">{selectedColor}</span></h3>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color, i) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-colors ${selectedColor === color ? 'border-primary' : 'border-border'}`}
                  style={{ backgroundColor: product.color_hexes[i] }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Kích cỡ</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm rounded-xl border transition-colors ${selectedSize === size ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/30'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Số lượng</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-xl flex items-center justify-center hover:bg-muted">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border rounded-xl flex items-center justify-center hover:bg-muted">
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground">Còn {variant?.stock || product.stock_quantity} sản phẩm</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleAddToCart} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2" size="lg">
              <ShoppingBag className="w-4 h-4" /> Thêm vào giỏ
            </Button>
            <Button variant="outline" size="lg" className="px-4 rounded-xl">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {Object.keys(product.detail_fields).length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-3">Chi tiết sản phẩm</h3>
              <div className="space-y-2">
                {Object.entries(product.detail_fields).map(([key, value]) => (
                  <div key={key} className="flex text-sm">
                    <span className="w-32 text-muted-foreground shrink-0">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold mb-6">Đánh giá ({product.review_count})</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map(review => (
              <div key={review.id} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                    {review.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user_name}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Chưa có đánh giá nào</p>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Mẫu cùng gu với bạn</h2>
              <p className="text-sm text-muted-foreground">Ưu tiên các sản phẩm cùng loại dựa trên lượt xem gần đây.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;

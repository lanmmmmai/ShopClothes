import { Link } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg font-medium mb-2">Giỏ hàng trống</p>
        <p className="text-sm text-muted-foreground mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng</p>
        <Link to="/products"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Tiếp tục mua sắm</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 bg-background rounded-lg shadow-soft p-4">
              <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-28 object-cover rounded-md bg-muted" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-primary">{item.product.name}</Link>
                <p className="text-xs text-muted-foreground mt-1">{item.variant.color} / {item.variant.size}</p>
                <p className="text-sm font-semibold mt-2">{formatCurrency(item.product.sale_price || item.product.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-muted">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-muted">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
                <p className="text-sm font-semibold">{formatCurrency((item.product.sale_price || item.product.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-background rounded-lg shadow-soft p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phí vận chuyển</span><span>{totalAmount >= 500000 ? 'Miễn phí' : formatCurrency(30000)}</span></div>
          </div>
          <div className="border-t my-4" />
          <div className="flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(totalAmount + (totalAmount >= 500000 ? 0 : 30000))}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              Thanh toán <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

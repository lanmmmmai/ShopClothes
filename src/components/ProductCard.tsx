import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      addItem(product, product.variants[0]);
    }
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative flex flex-col gap-3"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.sale_price && (
            <div className="absolute top-3 left-3 bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground rounded-sm">
              Giảm giá
            </div>
          )}
          {/* Quick add */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 bg-background/90 backdrop-blur-sm p-2.5 rounded-full shadow-soft hover:bg-background"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-foreground tracking-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums">
              {formatCurrency(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>★ {product.rating}</span>
            <span>·</span>
            <span>Đã bán {product.sold_count}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;

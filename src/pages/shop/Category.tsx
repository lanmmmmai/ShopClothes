import { useParams, Link } from 'react-router-dom';
import { mockCategories, mockProducts } from '@/data/mock';
import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

const Category = () => {
  const { slug } = useParams();
  const category = mockCategories.find(c => c.slug === slug);
  const products = mockProducts.filter(p => {
    const cat = mockCategories.find(c => c.slug === slug);
    return cat && p.category_id === cat.id && p.is_active;
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Không tìm thấy danh mục</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category hero */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-muted mb-8">
        <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-2xl font-bold text-background">{category.name}</h1>
            <p className="text-background/70 text-sm">{products.length} sản phẩm</p>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">Chưa có sản phẩm trong danh mục này</p>
      )}
    </div>
  );
};

export default Category;

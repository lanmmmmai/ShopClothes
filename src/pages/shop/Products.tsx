import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allColors = ['Trắng', 'Đen', 'Hồng', 'Đỏ', 'Xám', 'Be', 'Kem', 'Xanh', 'Nâu', 'Cam'];
const allSizes = ['S', 'M', 'L', 'XL', 'One Size'];
const ratingOptions = [4, 3, 2, 1];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let results = mockProducts.filter(p => p.is_active);

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (category) results = results.filter(p => p.category_id === category);
    if (selectedColors.length) results = results.filter(p => p.colors.some(c => selectedColors.includes(c)));
    if (selectedSizes.length) results = results.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    if (minPrice) results = results.filter(p => (p.sale_price || p.price) >= Number(minPrice));
    if (maxPrice) results = results.filter(p => (p.sale_price || p.price) <= Number(maxPrice));
    if (minRating) results = results.filter(p => p.rating >= minRating);

    switch (sort) {
      case 'price_asc': results.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)); break;
      case 'price_desc': results.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)); break;
      case 'popular': results.sort((a, b) => b.sold_count - a.sold_count); break;
      default: results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return results;
  }, [search, category, sort, selectedColors, selectedSizes, minPrice, maxPrice, minRating]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSelectedColors([]); setSelectedSizes([]);
    setMinPrice(''); setMaxPrice(''); setMinRating(0); setPage(1);
  };

  const hasFilters = search || category || selectedColors.length || selectedSizes.length || minPrice || maxPrice || minRating;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} sản phẩm</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm..."
              className="w-full bg-muted rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 ring-primary/20"
            />
          </div>
          <Select value={sort} onValueChange={v => setSort(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến</SelectItem>
              <SelectItem value="price_asc">Giá tăng</SelectItem>
              <SelectItem value="price_desc">Giá giảm</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'} lg:block lg:static lg:w-56 shrink-0 space-y-6`}>
          <div className="flex items-center justify-between lg:hidden">
            <h3 className="font-semibold">Bộ lọc</h3>
            <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Danh mục</h4>
            <div className="space-y-2">
              <button onClick={() => { setCategory(''); setPage(1); }} className={`block text-sm ${!category ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                Tất cả
              </button>
              {mockCategories.map(c => (
                <button key={c.id} onClick={() => { setCategory(c.id); setPage(1); }} className={`block text-sm ${category === c.id ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Giá (₫)</h4>
            <div className="flex gap-2">
              <input value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} placeholder="Từ" className="w-full bg-muted rounded-md px-3 py-1.5 text-sm outline-none" />
              <input value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} placeholder="Đến" className="w-full bg-muted rounded-md px-3 py-1.5 text-sm outline-none" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Đánh giá</h4>
            <div className="space-y-2">
              {ratingOptions.map(r => (
                <button key={r} onClick={() => { setMinRating(minRating === r ? 0 : r); setPage(1); }} className={`flex items-center gap-1 text-sm ${minRating === r ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {'★'.repeat(r)}{'☆'.repeat(5 - r)} <span>trở lên</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Màu sắc</h4>
            <div className="flex flex-wrap gap-2">
              {allColors.map(c => (
                <button key={c} onClick={() => { toggleColor(c); setPage(1); }} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedColors.includes(c) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-foreground/30'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Kích cỡ</h4>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(s => (
                <button key={s} onClick={() => { toggleSize(s); setPage(1); }} className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedSizes.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-foreground/30'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">Xóa bộ lọc</Button>
          )}
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-1">Không tìm thấy sản phẩm</p>
              <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginated.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-md text-sm transition-colors ${p === page ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

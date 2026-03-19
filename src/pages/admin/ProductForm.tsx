import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiFetch, uploadImage } from '@/lib/api';

type Category = { id: string; name: string; };

type FormState = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  stock: '0',
  categoryId: '',
  imageUrl: '',
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = useMemo(() => !!id, [id]);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        const categoryData = await apiFetch<Category[]>('/products/categories');
        setCategories(categoryData);
        if (id) {
          const product = await apiFetch<any>(`/products/${id}`);
          setForm({
            name: product.name || '',
            description: product.description || '',
            price: String(product.price ?? ''),
            salePrice: product.salePrice ? String(product.salePrice) : '',
            stock: String(product.stock ?? 0),
            categoryId: product.categoryId || '',
            imageUrl: product.imageUrl || '',
          });
        } else if (categoryData[0]) {
          setForm((prev) => ({ ...prev, categoryId: prev.categoryId || categoryData[0].id }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được dữ liệu sản phẩm');
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const result = await uploadImage(file, 'products');
      handleChange('imageUrl', result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể upload ảnh sản phẩm');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        categoryId: form.categoryId,
        imageUrl: form.imageUrl || null,
      };
      if (isEdit) {
        await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
        <p className="text-sm text-muted-foreground mt-1">Ảnh sản phẩm sẽ được upload vào thư mục server và lưu bằng URL thật thay vì base64.</p>
      </div>

      {pageLoading ? <div className="p-8 bg-background rounded-lg shadow-soft">Đang tải dữ liệu...</div> : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1.25fr,0.75fr] gap-6">
            <div className="bg-background rounded-lg shadow-soft p-6 space-y-4">
              <div className="space-y-2"><Label>Tên sản phẩm</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Áo sơ mi lụa cao cấp" /></div>
              <div className="space-y-2"><Label>Mô tả nội dung sản phẩm</Label><Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Mô tả chi tiết sản phẩm..." rows={8} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Giá (₫)</Label><Input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="890000" /></div>
                <div className="space-y-2"><Label>Giá sale (₫)</Label><Input type="number" value={form.salePrice} onChange={(e) => handleChange('salePrice', e.target.value)} placeholder="690000" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Số lượng tồn kho</Label><Input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="100" /></div>
                <div className="space-y-2"><Label>Danh mục</Label>
                  <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-soft p-6 space-y-4">
              <div className="space-y-2"><Label>Đường dẫn ảnh</Label><Input value={form.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} placeholder="/uploads/products/..." /></div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  <UploadCloud className="w-4 h-4 mr-2" /> {uploadingImage ? 'Đang upload...' : 'Upload ảnh'}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview" className="w-full aspect-[4/5] rounded-lg object-cover bg-muted" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full aspect-[4/5] rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">Chưa có ảnh xem trước</div>
                )}
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading || uploadingImage} className="bg-primary text-primary-foreground hover:bg-primary/90">{loading ? 'Đang lưu...' : 'Lưu sản phẩm'}</Button>
            <Link to="/admin/products"><Button type="button" variant="outline">Hủy</Button></Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;

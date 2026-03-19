import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Pencil, Ticket } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { addAccountOrder, getAccountAddresses, getAccountProfile, getAccountNotifications, saveAccountNotifications, createId } from '@/lib/account-data';
import { formatCurrency } from '@/lib/utils';
import type { Order, Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiFetch } from '@/lib/api';
import { mockProducts } from '@/data/mock';

const emptyForm = { fullName: '', phone: '', street: '', district: '', city: '', note: '' };

type VoucherSummary = { id?: string; code: string; title: string; description?: string | null; discountType: string; discountValue: number; minOrderAmount: number; maxDiscount?: number | null; isActive: boolean; expiresAt?: string | null; };
type SavedUserVoucher = { id: string; isValid: boolean; redeemedAt?: string | null; voucher: VoucherSummary };
type RewardDashboard = { storeVouchers: VoucherSummary[]; myVouchers: SavedUserVoucher[] };
type BackendOrderResponse = { id: string; status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'; subtotal: number; shippingFee: number; discountAmount: number; voucherCode?: string | null; totalAmount: number; paymentMethod: 'COD' | 'BANKING'; paymentStatus: 'PENDING' | 'PAID' | 'FAILED'; createdAt: string; updatedAt: string; items: Array<{ id: string; productId: string; productName: string; quantity: number; unitPrice: number; }>; address: { id: string; fullName: string; phone: string; street: string; district: string; city: string; }; };

const statusMap: Record<BackendOrderResponse['status'], Order['status']> = { PENDING: 'pending', CONFIRMED: 'confirmed', SHIPPING: 'shipping', DELIVERED: 'delivered', CANCELLED: 'cancelled' };

const normalizeOrder = (order: BackendOrderResponse, userId: string): Order => ({
  id: order.id,
  user_id: userId,
  status: statusMap[order.status] || 'pending',
  total_amount: order.totalAmount,
  subtotal: order.subtotal,
  shipping_fee: order.shippingFee,
  discount_amount: order.discountAmount,
  payment_method: order.paymentMethod,
  payment_status: order.paymentStatus,
  shipping_address: { id: order.address.id, user_id: userId, full_name: order.address.fullName, phone: order.address.phone, street: order.address.street, ward: '', district: order.address.district, city: order.address.city, is_default: false },
  voucher_code: order.voucherCode || undefined,
  loyalty_points_used: 0,
  items: order.items.map((item) => {
    const matchedProduct = mockProducts.find((product) => product.id === item.productId || product.slug === item.productId || product.name === item.productName);
    return {
      id: item.id,
      order_id: order.id,
      price: item.unitPrice,
      quantity: item.quantity,
      product: matchedProduct || { id: item.productId, name: item.productName, slug: item.productId, description: '', price: item.unitPrice, category_id: '', stock_quantity: 0, images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop'], colors: [], color_hexes: [], sizes: [], variants: [], detail_fields: {}, reviews: [], rating: 0, review_count: 0, sold_count: 0, is_active: true, created_at: order.createdAt },
      variant: matchedProduct?.variants?.[0] || { id: `variant-${item.id}`, product_id: item.productId, color: 'Mặc định', color_hex: '#000000', size: 'Mặc định', stock: 0, sku: item.productId },
    };
  }),
  created_at: order.createdAt,
  updated_at: order.updatedAt,
});

const pushOrderNotification = (userId: string, order: Order) => {
  const notifications = getAccountNotifications(userId);
  const notification: Notification = { id: createId('noti'), user_id: userId, title: 'Đặt hàng thành công', message: `Đơn hàng #${order.id} đã được tạo thành công${order.voucher_code ? ` với voucher ${order.voucher_code}` : ''}. Nhấn để mở popup theo dõi chi tiết.`, type: 'order', is_read: false, created_at: new Date().toISOString(), order_id: order.id, action_url: `/account/orders/${order.id}` };
  saveAccountNotifications(userId, [notification, ...notifications]);
};

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANKING'>('COD');
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherSummary | null>(null);
  const [savedVouchers, setSavedVouchers] = useState<SavedUserVoucher[]>([]);
  const [storeVouchers, setStoreVouchers] = useState<VoucherSummary[]>([]);
  const [paymentOtp, setPaymentOtp] = useState('');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const shipping = totalAmount >= 500000 ? 0 : 30000;
  const savedAddress = useMemo(() => user ? (getAccountAddresses(user.id).find((item) => item.is_default) || getAccountAddresses(user.id)[0] || null) : null, [user]);
  const savedProfile = useMemo(() => user ? getAccountProfile({ id: user.id, full_name: user.full_name, phone: user.phone, email: user.email }) : null, [user]);
  const defaultForm = useMemo(() => ({ fullName: savedAddress?.full_name || savedProfile?.full_name || '', phone: savedAddress?.phone || savedProfile?.phone || '', street: savedAddress?.street || '', district: savedAddress?.district || '', city: savedAddress?.city || '', note: '' }), [savedAddress, savedProfile]);

  useEffect(() => {
    setForm((prev) => {
      const hasManualValue = Object.entries(prev).some(([key, value]) => key !== 'note' && value.trim() !== '');
      if (hasManualValue) return prev;
      return { ...prev, ...defaultForm };
    });
    setIsEditingAddress(!savedAddress && !savedProfile?.phone && !savedProfile?.full_name);
  }, [defaultForm, savedAddress, savedProfile]);

  useEffect(() => {
    apiFetch<RewardDashboard>('/rewards/dashboard')
      .then((data) => {
        setSavedVouchers(data.myVouchers.filter((item) => item.isValid && !item.redeemedAt));
        setStoreVouchers(data.storeVouchers || []);
      })
      .catch(() => {
        setSavedVouchers([]);
        setStoreVouchers([]);
      });
  }, []);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (totalAmount < appliedVoucher.minOrderAmount) return 0;
    const raw = appliedVoucher.discountType === 'percent' ? totalAmount * (appliedVoucher.discountValue / 100) : appliedVoucher.discountValue;
    const capped = appliedVoucher.maxDiscount ? Math.min(raw, appliedVoucher.maxDiscount) : raw;
    return Math.max(0, Math.min(capped, totalAmount));
  }, [appliedVoucher, totalAmount]);

  useEffect(() => {
    if (appliedVoucher) return;
    const calc = (voucher: VoucherSummary) => {
      const raw = voucher.discountType === 'percent' ? totalAmount * (voucher.discountValue / 100) : voucher.discountValue;
      return voucher.maxDiscount ? Math.min(raw, voucher.maxDiscount) : raw;
    };
    const validChoices = savedVouchers.map((item) => item.voucher).filter((voucher) => totalAmount >= voucher.minOrderAmount);
    if (validChoices.length) {
      const best = [...validChoices].sort((a, b) => calc(b) - calc(a))[0];
      setAppliedVoucher(best);
      setVoucherCode(best.code);
      return;
    }
    const welcomeVoucher = storeVouchers.find((voucher) => voucher.code === 'WELCOME50K' && totalAmount >= voucher.minOrderAmount);
    if (welcomeVoucher) {
      setAppliedVoucher(welcomeVoucher);
      setVoucherCode(welcomeVoucher.code);
    }
  }, [savedVouchers, storeVouchers, totalAmount, appliedVoucher]);

  const grandTotal = Math.max(totalAmount + shipping - discountAmount, 0);

  const handleApplyVoucher = async (selectedCode?: string) => {
    const normalized = (selectedCode || voucherCode).trim().toUpperCase();
    if (!normalized) return toast.error('Vui lòng nhập mã voucher');
    setVoucherLoading(true);
    try {
      const data = await apiFetch<RewardDashboard>('/rewards/dashboard');
      const ownedVoucher = data.myVouchers.find((item) => item.voucher.code.toUpperCase() === normalized && item.isValid && !item.redeemedAt)?.voucher;
      const voucher = ownedVoucher || data.storeVouchers.find((item) => item.code.toUpperCase() === normalized && item.isActive);
      if (!voucher) throw new Error('Voucher không tồn tại hoặc chưa được lưu vào tài khoản');
      if (totalAmount < voucher.minOrderAmount) throw new Error(`Đơn hàng cần tối thiểu ${formatCurrency(voucher.minOrderAmount)} để áp dụng voucher này`);
      setAppliedVoucher(voucher);
      setVoucherCode(voucher.code);
      toast.success(`Đã áp dụng voucher ${voucher.code}`);
    } catch (err) {
      setAppliedVoucher(null);
      toast.error(err instanceof Error ? err.message : 'Không áp dụng được voucher');
    } finally {
      setVoucherLoading(false);
    }
  };

  const requestOtp = async () => {
    setOtpLoading(true);
    try {
      const result = await apiFetch<{ message: string }>('/orders/request-banking-otp', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod,
          voucherCode: appliedVoucher?.code || undefined,
          items: items.map((item) => ({ productId: item.product.id, productSlug: item.product.slug, productName: item.product.name, quantity: item.quantity })),
        }),
      });
      toast.success(result.message);
      setOtpDialogOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không gửi được OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch<{ message: string; order: BackendOrderResponse }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          paymentMethod,
          voucherCode: appliedVoucher?.code || undefined,
          paymentOtp: paymentMethod === 'BANKING' ? paymentOtp : undefined,
          items: items.map((item) => ({ productId: item.product.id, productSlug: item.product.slug, productName: item.product.name, quantity: item.quantity })),
        }),
      });
      if (user && result.order) {
        const normalizedOrder = normalizeOrder(result.order, user.id);
        addAccountOrder(user.id, normalizedOrder);
        pushOrderNotification(user.id, normalizedOrder);
      }
      setOtpDialogOpen(false);
      setPlaced(true);
      clearCart();
      toast.success(result.message || 'Đặt hàng thành công');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đặt hàng thất bại';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'BANKING') {
      await requestOtp();
      return;
    }
    await submitOrder();
  };

  if (placed) return <div className="container mx-auto px-4 py-20 text-center max-w-md"><CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" /><h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1><p className="text-muted-foreground text-sm">Hóa đơn đã được gửi về Gmail của bạn. Đơn hàng đã được lưu vào cơ sở dữ liệu.</p></div>;
  if (items.length === 0) return <div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Giỏ hàng trống. Hãy thêm sản phẩm trước khi thanh toán.</p></div>;

  const hasSavedContact = Boolean(defaultForm.fullName && defaultForm.phone && defaultForm.street && defaultForm.district && defaultForm.city);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-background rounded-lg shadow-soft p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div><h2 className="font-semibold">Địa chỉ giao hàng</h2><p className="text-sm text-muted-foreground mt-1">{hasSavedContact ? 'Đã tự động điền từ thông tin liên hệ/địa chỉ mặc định của bạn.' : 'Vui lòng nhập địa chỉ giao hàng để hoàn tất đơn hàng.'}</p></div>
              {hasSavedContact && !isEditingAddress && <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingAddress(true)}><Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa</Button>}
            </div>
            {hasSavedContact && !isEditingAddress ? (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm"><p className="font-medium text-base">{form.fullName}</p><p className="text-muted-foreground">{form.phone}</p><p className="text-muted-foreground">{form.street}, {form.district}, {form.city}</p>{form.note && <p className="text-muted-foreground">Ghi chú: {form.note}</p>}</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Họ và tên</Label><Input placeholder="Nguyễn Văn A" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Số điện thoại</Label><Input placeholder="0901 234 567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
                <div className="col-span-2 space-y-2"><Label>Địa chỉ</Label><Input placeholder="123 Nguyễn Huệ" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Quận/Huyện</Label><Input placeholder="Quận 1" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Thành phố</Label><Input placeholder="TP. Hồ Chí Minh" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required /></div>
                <div className="col-span-2 space-y-2"><Label>Ghi chú</Label><Input placeholder="Giao giờ hành chính..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></div>
                {hasSavedContact && <div className="col-span-2 flex justify-end"><Button type="button" variant="ghost" onClick={() => { setForm({ ...defaultForm, note: form.note }); setIsEditingAddress(false); }}>Dùng lại địa chỉ mặc định</Button></div>}
              </div>
            )}
          </div>

          <div className="bg-background rounded-lg shadow-soft p-6 space-y-4">
            <h2 className="font-semibold">Voucher</h2>
            {savedVouchers.length > 0 && (
              <div className="rounded-lg border p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-3"><Ticket className="w-4 h-4 text-primary" /><p className="font-medium">Voucher đã lưu và hợp lệ</p></div>
                <div className="space-y-2">{savedVouchers.map((item) => <button key={item.id} type="button" className={`w-full text-left rounded-lg border p-3 ${appliedVoucher?.code === item.voucher.code ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => handleApplyVoucher(item.voucher.code)}><div className="flex justify-between gap-3"><div><p className="font-medium">{item.voucher.code} - {item.voucher.title}</p><p className="text-sm text-muted-foreground">{item.voucher.description}</p></div>{item.voucher.expiresAt && <span className="text-xs text-muted-foreground">HSD {new Date(item.voucher.expiresAt).toLocaleDateString('vi-VN')}</span>}</div></button>)}</div>
              </div>
            )}
            <div className="flex gap-3"><Input placeholder="Nhập mã voucher" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} /><Button type="button" variant="outline" disabled={voucherLoading} onClick={() => handleApplyVoucher()}>{voucherLoading ? 'Đang kiểm tra...' : 'Áp dụng'}</Button></div>
            {appliedVoucher && <div className="rounded-lg border bg-muted/30 p-4 text-sm"><p className="font-medium">{appliedVoucher.code} - {appliedVoucher.title}</p><p className="text-muted-foreground">{appliedVoucher.description || 'Voucher đã được áp dụng cho đơn hàng này.'}</p><div className="mt-3 flex gap-2"><Button type="button" variant="ghost" className="px-0" onClick={() => { setAppliedVoucher(null); setVoucherCode(''); }}>Bỏ voucher</Button></div></div>}
          </div>

          <div className="bg-background rounded-lg shadow-soft p-6">
            <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">{[{ value: 'COD' as const, label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán sau khi nhận được hàng' }, { value: 'BANKING' as const, label: 'Chuyển khoản', desc: 'Sau khi bấm đặt hàng sẽ hiện form gửi OTP và xác nhận thanh toán' }].map(method => <button key={method.value} type="button" onClick={() => setPaymentMethod(method.value)} className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}><p className="text-sm font-medium">{method.label}</p><p className="text-xs text-muted-foreground">{method.desc}</p></button>)}</div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-background rounded-lg shadow-soft p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Đơn hàng ({items.length} sản phẩm)</h2>
            <div className="space-y-3 mb-4">{items.map(item => <div key={item.id} className="flex gap-3 text-sm"><img src={item.product.images[0]} alt="" className="w-12 h-14 rounded object-cover bg-muted" /><div className="flex-1 min-w-0"><p className="truncate">{item.product.name}</p><p className="text-xs text-muted-foreground">{item.variant.color} / {item.variant.size} × {item.quantity}</p></div><p className="font-medium shrink-0">{formatCurrency((item.product.sale_price || item.product.price) * item.quantity)}</p></div>)}</div>
            <div className="border-t pt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatCurrency(totalAmount)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span></div>{discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá voucher</span><span>-{formatCurrency(discountAmount)}</span></div>}</div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold"><span>Tổng cộng</span><span className="text-primary">{formatCurrency(grandTotal)}</span></div>
            <Button type="submit" disabled={loading || otpLoading} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">{paymentMethod === 'BANKING' ? (otpLoading ? 'Đang gửi OTP...' : 'Thanh toán') : (loading ? 'Đang xử lý...' : 'Đặt hàng')}</Button>
          </div>
        </div>
      </form>

      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán chuyển khoản</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Mã OTP đã được gửi về Gmail của bạn. Nhập mã OTP để xác nhận thanh toán rồi hoàn tất đặt đơn.</p>
            <div className="space-y-2">
              <Label>Mã OTP thanh toán</Label>
              <Input value={paymentOtp} onChange={(e) => setPaymentOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Nhập 6 số OTP" maxLength={6} />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={requestOtp} disabled={otpLoading}>{otpLoading ? 'Đang gửi lại...' : 'Gửi lại OTP'}</Button>
              <Button type="button" onClick={submitOrder} disabled={loading || paymentOtp.length !== 6}>{loading ? 'Đang xác nhận...' : 'Xác nhận và đặt đơn'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;

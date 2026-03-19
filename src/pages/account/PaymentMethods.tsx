import { useMemo, useState } from 'react';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { createId, getAccountPaymentMethods, saveAccountPaymentMethods, type StoredPaymentMethod } from '@/lib/account-data';

const emptyMethod = {
  label: '',
  card_holder: '',
  card_number: '',
  expiry: '',
  brand: 'Visa' as StoredPaymentMethod['brand'],
  is_default: false,
};

const PaymentMethods = () => {
  const { user } = useAuth();
  const methods = useMemo(() => (user ? getAccountPaymentMethods(user.id) : []), [user]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyMethod);

  if (!user) return null;

  const resetForm = () => setForm(emptyMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StoredPaymentMethod = {
      id: createId('pm'),
      user_id: user.id,
      label: form.label,
      card_holder: form.card_holder,
      last4: form.card_number.slice(-4),
      expiry: form.expiry,
      brand: form.brand,
      is_default: form.is_default,
    };

    let next = [payload, ...methods];
    if (payload.is_default || methods.length === 0) {
      next = next.map((item) => ({ ...item, is_default: item.id === payload.id }));
    }
    saveAccountPaymentMethods(user.id, next);
    toast.success('Đã thêm phương thức thanh toán');
    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const next = methods.filter((item) => item.id !== id);
    saveAccountPaymentMethods(user.id, next);
    toast.success('Đã xóa phương thức thanh toán');
  };

  const handleSetDefault = (id: string) => {
    const next = methods.map((item) => ({ ...item, is_default: item.id === id }));
    saveAccountPaymentMethods(user.id, next);
    toast.success('Đã đặt làm phương thức mặc định');
  };

  return (
    <div className="bg-background rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
          <p className="text-sm text-muted-foreground mt-1">Lưu thẻ hoặc tài khoản thanh toán để checkout nhanh hơn.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1" onClick={() => { resetForm(); setOpen(true); }}>
              <Plus className="w-4 h-4" /> Thêm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Tên gợi nhớ</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ví dụ: Thẻ lương" required />
              </div>
              <div className="space-y-2">
                <Label>Tên chủ thẻ</Label>
                <Input value={form.card_holder} onChange={(e) => setForm({ ...form, card_holder: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số thẻ</Label>
                  <Input value={form.card_number} onChange={(e) => setForm({ ...form, card_number: e.target.value.replace(/\D/g, '').slice(0, 16) })} placeholder="1234123412341234" required />
                </div>
                <div className="space-y-2">
                  <Label>Ngày hết hạn</Label>
                  <Input value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="MM/YY" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Loại thẻ</Label>
                <Select value={form.brand} onValueChange={(value: StoredPaymentMethod['brand']) => setForm({ ...form, brand: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                    <SelectItem value="JCB">JCB</SelectItem>
                    <SelectItem value="ATM">ATM nội địa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
                Đặt làm phương thức mặc định
              </label>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Lưu phương thức</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {methods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
          <CreditCard className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Chưa có phương thức thanh toán nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{method.label}</p>
                    {method.is_default && <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-1">Mặc định</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.brand} •••• {method.last4}</p>
                  <p className="text-sm text-muted-foreground">{method.card_holder} · HSD {method.expiry}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.is_default && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                    <Star className="w-4 h-4 mr-1" /> Mặc định
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={() => handleDelete(method.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;

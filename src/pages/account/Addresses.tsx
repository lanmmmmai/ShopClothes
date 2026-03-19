import { useMemo, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { createId, getAccountAddresses, saveAccountAddresses } from '@/lib/account-data';
import type { Address } from '@/types';

const emptyAddress = {
  full_name: '',
  phone: '',
  street: '',
  ward: '',
  district: '',
  city: '',
  is_default: false,
};

const Addresses = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const addresses = useMemo(() => (user ? getAccountAddresses(user.id) : []), [user]);

  if (!user) return null;

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyAddress);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      full_name: address.full_name,
      phone: address.phone,
      street: address.street,
      ward: address.ward,
      district: address.district,
      city: address.city,
      is_default: address.is_default,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Address = {
      id: editingId || createId('addr'),
      user_id: user.id,
      ...form,
    };

    let next = editingId
      ? addresses.map((item) => (item.id === editingId ? payload : item))
      : [payload, ...addresses];

    if (payload.is_default) {
      next = next.map((item) => ({ ...item, is_default: item.id === payload.id }));
    }

    saveAccountAddresses(user.id, next);
    toast.success(editingId ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới');
    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const next = addresses.filter((item) => item.id !== id);
    saveAccountAddresses(user.id, next);
    toast.success('Đã xóa địa chỉ');
  };

  const handleSetDefault = (id: string) => {
    const next = addresses.map((item) => ({ ...item, is_default: item.id === id }));
    saveAccountAddresses(user.id, next);
    toast.success('Đã cập nhật địa chỉ mặc định');
  };

  return (
    <div className="bg-background rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Địa chỉ</h2>
          <p className="text-sm text-muted-foreground mt-1">Quản lý các địa chỉ giao hàng để đặt đơn nhanh hơn.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4" /> Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Số nhà, tên đường" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Phường/Xã</Label>
                  <Input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Quận/Huyện</Label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Tỉnh/Thành phố</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
                Đặt làm địa chỉ mặc định
              </label>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{editingId ? 'Lưu thay đổi' : 'Thêm địa chỉ'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Bạn chưa có địa chỉ giao hàng nào.
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="border rounded-lg p-4 flex gap-3 justify-between flex-col sm:flex-row">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{addr.full_name}</span>
                    <span className="text-sm text-muted-foreground">{addr.phone}</span>
                    {addr.is_default && <Badge variant="secondary" className="text-[10px]">Mặc định</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.street}, {addr.ward}, {addr.district}, {addr.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {!addr.is_default && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                    <Check className="w-4 h-4 mr-1" /> Mặc định
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={() => handleEdit(addr)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(addr.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Addresses;

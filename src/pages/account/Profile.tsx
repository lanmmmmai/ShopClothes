import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Mail, MapPin, Phone, ShieldCheck, User2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { uploadImage } from '@/lib/api';
import { getAccountNotifications, getAccountOrders, getAccountProfile, saveAccountProfile } from '@/lib/account-data';

const Profile = () => {
  const { user, isAdmin, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const initialProfile = useMemo(() => {
    if (!user) return null;
    return getAccountProfile({
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      email: user.email,
      avatar_url: user.avatar_url || undefined,
    });
  }, [user]);

  const [form, setForm] = useState(initialProfile);

  useEffect(() => {
    setForm(initialProfile);
  }, [initialProfile]);

  if (!user || !form) return null;

  const orders = getAccountOrders(user.id);
  const unreadNotifications = getAccountNotifications(user.id).filter((item) => !item.is_read).length;
  const initials = form.full_name.split(' ').map((item) => item[0]).join('').slice(0, 2).toUpperCase() || user.email.charAt(0).toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveAccountProfile(user.id, form);
      if (form.full_name !== user.full_name || form.avatar_url !== (user.avatar_url || '')) {
        await updateProfile({ fullName: form.full_name, avatarUrl: form.avatar_url || null });
      }
      toast.success('Đã cập nhật thông tin tài khoản');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật hồ sơ');
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const result = await uploadImage(file, 'avatars');
      const nextForm = { ...form, avatar_url: result.url };
      setForm(nextForm);
      saveAccountProfile(user.id, nextForm);
      await updateProfile({ avatarUrl: result.url });
      toast.success('Đã upload ảnh đại diện lên server');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể upload ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const summary = [
    { label: 'Đơn hàng', value: orders.length },
    { label: 'Thông báo mới', value: unreadNotifications },
    { label: 'Xu tích lũy', value: user.coinBalance ?? user.loyalty_points ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border bg-background p-6 md:p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Thông tin tài khoản</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Chỉnh sửa hồ sơ</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Form đã được thu gọn lại để cân đối hơn với giao diện tổng thể, dễ nhìn và đúng tỉ lệ hơn so với bản cũ.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            {summary.map((item) => (
              <div key={item.label} className="rounded-2xl border bg-muted/20 px-4 py-3 text-center lg:min-w-[128px]">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <div className="rounded-[24px] border bg-muted/20 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                {form.avatar_url ? <img src={form.avatar_url} alt="avatar" className="h-full w-full object-cover" /> : initials}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold">Ảnh đại diện</p>
                  <p className="text-sm text-muted-foreground">Ảnh được lưu trong thư mục upload trên server và dùng URL thật.</p>
                </div>
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
                  <Camera className="mr-2 h-4 w-4" />
                  {uploadingAvatar ? 'Đang upload...' : 'Đổi ảnh đại diện'}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Họ và tên</Label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="h-11 rounded-xl pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.email} disabled className="h-11 rounded-xl bg-muted/50 pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Số điện thoại</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl pl-10" placeholder="0987 XXX 321" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Vai trò hiển thị</Label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.role_label || (isAdmin ? 'Admin' : 'Khách hàng')} onChange={(e) => setForm({ ...form, role_label: e.target.value })} className="h-11 rounded-xl pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Địa chỉ liên hệ</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input value={form.address || '123 Hai Bà Trưng, Quận 1, TP.HCM'} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11 rounded-xl pl-10" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="rounded-xl bg-primary px-6 hover:bg-primary/90">Lưu thay đổi</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiFetch } from '@/lib/api';
import { BadgePercent, Clock3, Gift, Settings2, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type Task = { id: string; title: string; description?: string; coinReward: number; isActive: boolean };
type Voucher = {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  coinCost: number;
  quantity: number;
  usedCount: number;
  isActive: boolean;
  isSpinEnabled: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
};
type AdminRewardData = { tasks: Task[]; vouchers: Voucher[]; settings: { spinCost: number } };

type VoucherForm = {
  code: string;
  title: string;
  description: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | '';
  startsAt: string;
  expiresAt: string;
  coinCost: number;
  quantity: number;
  isSpinEnabled: boolean;
  isActive: boolean;
};

const emptyVoucherForm: VoucherForm = { code: '', title: '', description: '', discountType: 'fixed', discountValue: 50000, minOrderAmount: 0, maxDiscount: '', startsAt: '', expiresAt: '', coinCost: 50, quantity: 100, isSpinEnabled: true, isActive: true };
const voucherBenefit = (voucher: Voucher | VoucherForm) => voucher.discountType === 'percent' ? `Giảm ${voucher.discountValue}%${voucher.maxDiscount ? ` · tối đa ${formatCurrency(Number(voucher.maxDiscount))}` : ''}` : `Giảm ${formatCurrency(voucher.discountValue)}`;

const VoucherManagement = () => {
  const [data, setData] = useState<AdminRewardData | null>(null);
  const [message, setMessage] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', coinReward: 10 });
  const [voucherForm, setVoucherForm] = useState<VoucherForm>(emptyVoucherForm);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  const [spinCost, setSpinCost] = useState(50);

  const load = async () => {
    const result = await apiFetch<AdminRewardData>('/admin/rewards');
    setData(result);
    setSpinCost(result.settings.spinCost);
  };

  useEffect(() => { load().catch(() => setMessage('Không tải được dữ liệu thưởng.')); }, []);

  const createTask = async () => {
    try {
      const result = await apiFetch<{ message: string }>('/admin/rewards/tasks', { method: 'POST', body: JSON.stringify(taskForm) });
      setMessage(result.message);
      setTaskForm({ title: '', description: '', coinReward: 10 });
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra'); }
  };

  const saveVoucher = async (forceSpin = false) => {
    try {
      const payload = {
        ...voucherForm,
        isSpinEnabled: forceSpin ? true : voucherForm.isSpinEnabled,
        maxDiscount: voucherForm.maxDiscount === '' ? null : Number(voucherForm.maxDiscount),
        startsAt: voucherForm.startsAt ? new Date(voucherForm.startsAt).toISOString() : null,
        expiresAt: voucherForm.expiresAt ? new Date(voucherForm.expiresAt).toISOString() : null,
      };
      const url = editingVoucherId ? `/admin/rewards/vouchers/${editingVoucherId}` : '/admin/rewards/vouchers';
      const method = editingVoucherId ? 'PATCH' : 'POST';
      const result = await apiFetch<{ message: string }>(url, { method, body: JSON.stringify(payload) });
      setMessage(result.message);
      setVoucherForm(emptyVoucherForm);
      setEditingVoucherId(null);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra'); }
  };

  const saveSpinCost = async () => {
    try {
      const result = await apiFetch<{ message: string }>('/admin/rewards/settings', { method: 'PUT', body: JSON.stringify({ spinCost }) });
      setMessage(result.message);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra'); }
  };

  const toggleTask = async (task: Task) => {
    await apiFetch('/admin/rewards/tasks/' + task.id, { method: 'PATCH', body: JSON.stringify({ isActive: !task.isActive }) });
    await load();
  };

  const toggleVoucher = async (voucher: Voucher, patch: Partial<Voucher>) => {
    await apiFetch('/admin/rewards/vouchers/' + voucher.id, { method: 'PATCH', body: JSON.stringify(patch) });
    await load();
  };

  const editVoucher = (voucher: Voucher) => {
    setEditingVoucherId(voucher.id);
    setVoucherForm({
      code: voucher.code,
      title: voucher.title,
      description: voucher.description || '',
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minOrderAmount: voucher.minOrderAmount,
      maxDiscount: voucher.maxDiscount ?? '',
      startsAt: voucher.startsAt ? new Date(voucher.startsAt).toISOString().slice(0, 16) : '',
      expiresAt: voucher.expiresAt ? new Date(voucher.expiresAt).toISOString().slice(0, 16) : '',
      coinCost: voucher.coinCost,
      quantity: voucher.quantity,
      isSpinEnabled: voucher.isSpinEnabled,
      isActive: voucher.isActive,
    });
  };

  const validSpinVouchers = useMemo(() => data?.vouchers.filter((voucher) => voucher.isSpinEnabled && voucher.isActive) || [], [data?.vouchers]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Voucher và vòng quay</h1>
        <p className="text-sm text-muted-foreground mt-1">Voucher hiện được thiết kế theo kiểu thẻ đẹp hơn và mỗi mã chỉ dùng 1 lần cho mỗi tài khoản.</p>
        {message && <p className="text-sm text-primary mt-2">{message}</p>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-amber-50 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary" /><h2 className="font-semibold">Cấu hình vòng quay</h2></div>
          <div className="space-y-2"><Label>Số xu mỗi lượt quay</Label><Input type="number" value={spinCost} onChange={(e) => setSpinCost(Number(e.target.value))} /></div>
          <Button onClick={saveSpinCost}>Lưu phí quay</Button>
          <div className="rounded-3xl border bg-white/80 p-4 backdrop-blur">
            <p className="font-medium mb-3">Voucher đang có trên vòng quay</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {validSpinVouchers.map((voucher) => <div key={voucher.id} className="rounded-2xl border bg-background px-3 py-2"><p className="font-medium">{voucher.code}</p><p className="text-xs text-muted-foreground">{voucher.title}</p></div>)}
              <div className="rounded-2xl border bg-background px-3 py-2"><p className="font-medium">LOSE</p><p className="text-xs text-muted-foreground">Chúc bạn may mắn lần sau</p></div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-3xl shadow-soft p-6 space-y-4 border">
          <div className="flex items-center gap-2"><Gift className="w-5 h-5 text-primary" /><h2 className="font-semibold">Tạo nhiệm vụ</h2></div>
          <div className="space-y-2"><Label>Tên nhiệm vụ</Label><Input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Mô tả</Label><Input value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} /></div>
          <div className="space-y-2"><Label>Số xu thưởng</Label><Input type="number" value={taskForm.coinReward} onChange={(e) => setTaskForm({ ...taskForm, coinReward: Number(e.target.value) })} /></div>
          <Button onClick={createTask}>Tạo nhiệm vụ</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-background shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b p-6"><div><h2 className="font-semibold text-lg">{editingVoucherId ? 'Sửa voucher' : 'Tạo voucher'}</h2><p className="text-sm text-muted-foreground mt-1">Thẻ preview hiển thị ngay để admin dễ kiểm tra giao diện voucher.</p></div>{editingVoucherId && <Button variant="outline" onClick={() => { setEditingVoucherId(null); setVoucherForm(emptyVoucherForm); }}>Huỷ sửa</Button>}</div>
        <div className="grid xl:grid-cols-[1.3fr,0.7fr] gap-6 p-6">
          <div className="grid lg:grid-cols-4 gap-4">
            <div><Label>Mã voucher</Label><Input value={voucherForm.code} onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })} /></div>
            <div><Label>Tiêu đề</Label><Input value={voucherForm.title} onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })} /></div>
            <div><Label>Giá trị giảm</Label><Input type="number" value={voucherForm.discountValue} onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })} /></div>
            <div><Label>Kiểu giảm</Label><select value={voucherForm.discountType} onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as 'fixed' | 'percent' })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="fixed">Tiền cố định</option><option value="percent">Phần trăm</option></select></div>
            <div><Label>Số xu đổi</Label><Input type="number" value={voucherForm.coinCost} onChange={(e) => setVoucherForm({ ...voucherForm, coinCost: Number(e.target.value) })} /></div>
            <div><Label>Đơn tối thiểu</Label><Input type="number" value={voucherForm.minOrderAmount} onChange={(e) => setVoucherForm({ ...voucherForm, minOrderAmount: Number(e.target.value) })} /></div>
            <div><Label>Giảm tối đa</Label><Input type="number" value={voucherForm.maxDiscount} onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscount: e.target.value === '' ? '' : Number(e.target.value) })} /></div>
            <div><Label>Số lượng</Label><Input type="number" value={voucherForm.quantity} onChange={(e) => setVoucherForm({ ...voucherForm, quantity: Number(e.target.value) })} /></div>
            <div><Label>Bắt đầu</Label><Input type="datetime-local" value={voucherForm.startsAt} onChange={(e) => setVoucherForm({ ...voucherForm, startsAt: e.target.value })} /></div>
            <div><Label>Hạn sử dụng</Label><Input type="datetime-local" value={voucherForm.expiresAt} onChange={(e) => setVoucherForm({ ...voucherForm, expiresAt: e.target.value })} /></div>
            <div className="lg:col-span-2"><Label>Mô tả</Label><Input value={voucherForm.description} onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })} /></div>
            <div className="flex items-end gap-3"><Switch checked={voucherForm.isSpinEnabled} onCheckedChange={(v) => setVoucherForm({ ...voucherForm, isSpinEnabled: v })} /><span className="text-sm">Cho phép lên vòng quay</span></div>
            <div className="flex items-end gap-3"><Switch checked={voucherForm.isActive} onCheckedChange={(v) => setVoucherForm({ ...voucherForm, isActive: v })} /><span className="text-sm">Đang hoạt động</span></div>
            <div className="lg:col-span-4 flex flex-wrap gap-3"><Button onClick={() => saveVoucher(false)}>{editingVoucherId ? 'Lưu chỉnh sửa' : 'Tạo voucher'}</Button><Button variant="outline" onClick={() => saveVoucher(true)}>{editingVoucherId ? 'Lưu và thêm vào spin' : 'Tạo và thêm vào spin'}</Button></div>
          </div>
          <div className="rounded-3xl border bg-gradient-to-br from-primary/10 to-amber-50 p-5">
            <div className="flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /> Preview</div>
            <div className="mt-4 overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="border-b bg-primary/5 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary">{voucherForm.code || 'CODE'}</p>
                    <p className="mt-1 text-lg font-bold">{voucherForm.title || 'Tên voucher'}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">1 lần/tài khoản</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{voucherForm.description || 'Mô tả voucher sẽ hiển thị ở đây.'}</p>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><BadgePercent className="w-4 h-4 text-primary" /> {voucherBenefit(voucherForm)}</div>
                <div className="text-sm text-muted-foreground">Đơn từ {formatCurrency(voucherForm.minOrderAmount)}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="w-4 h-4" /> {voucherForm.expiresAt ? `HSD ${new Date(voucherForm.expiresAt).toLocaleDateString('vi-VN')}` : 'Chưa đặt hạn sử dụng'}</div>
                <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">Giá đổi: <span className="font-semibold text-primary">{voucherForm.coinCost} xu</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-soft p-6 border">
        <h2 className="font-semibold mb-4">Danh sách nhiệm vụ</h2>
        <div className="space-y-3">
          {data?.tasks.map((task) => (
            <div key={task.id} className="border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <p className="text-sm text-primary">{task.coinReward} xu</p>
              </div>
              <Button variant="outline" onClick={() => toggleTask(task)}>{task.isActive ? 'Tắt' : 'Bật'}</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-soft p-6 border">
        <h2 className="font-semibold mb-4">Danh sách voucher</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data?.vouchers.map((voucher) => (
            <div key={voucher.id} className="overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-primary/5">
              <div className="border-b bg-primary/5 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary">{voucher.code}</p>
                    <p className="mt-1 text-lg font-bold">{voucher.title}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">1 lần/tài khoản</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{voucher.description || 'Voucher ưu đãi đang hoạt động.'}</p>
              </div>
              <div className="space-y-3 p-5">
                <div className="text-sm font-medium">{voucherBenefit(voucher)}</div>
                <div className="text-sm text-muted-foreground">Đổi: {voucher.coinCost} xu · Đã phát: {voucher.usedCount}/{voucher.quantity}</div>
                <div className="text-xs text-muted-foreground">{voucher.isSpinEnabled ? 'Đang có trong vòng quay' : 'Chưa đưa vào vòng quay'}{voucher.expiresAt ? ` · HSD ${new Date(voucher.expiresAt).toLocaleDateString('vi-VN')}` : ''}</div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Button variant="outline" onClick={() => editVoucher(voucher)}>Sửa</Button>
                  <Button variant="outline" onClick={() => toggleVoucher(voucher, { isSpinEnabled: !voucher.isSpinEnabled })}>{voucher.isSpinEnabled ? 'Bỏ khỏi spin' : 'Cho vào spin'}</Button>
                  <Button variant="outline" onClick={() => toggleVoucher(voucher, { isActive: !voucher.isActive })}>{voucher.isActive ? 'Ngưng' : 'Mở'}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoucherManagement;

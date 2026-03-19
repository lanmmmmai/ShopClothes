import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Gift, Ticket, Coins, Sparkles, BadgePercent, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

type Voucher = {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  coinCost: number;
  isSpinEnabled: boolean;
  maxDiscount?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  ownedAlready?: boolean;
};

type UserVoucher = { id: string; source: string; createdAt: string; redeemedAt?: string | null; isValid: boolean; voucher: Voucher };
type RewardDashboard = {
  coinBalance: number;
  spinCost: number;
  storeVouchers: Voucher[];
  myVouchers: UserVoucher[];
  spinVouchers: Voucher[];
};

const colors = ['#ff7ca8', '#ffb347', '#ffd966', '#7dd3fc', '#86efac', '#c084fc', '#fca5a5', '#a5b4fc', '#fdba74', '#67e8f9'];

const benefitLabel = (voucher: Voucher) => voucher.discountType === 'percent'
  ? `Giảm ${voucher.discountValue}%${voucher.maxDiscount ? ` tối đa ${formatCurrency(Number(voucher.maxDiscount))}` : ''}`
  : `Giảm ${formatCurrency(voucher.discountValue)}`;

const VoucherTone = ({ children }: { children: ReactNode }) => <span className="rounded-full border border-white/40 bg-white/70 px-3 py-1 text-[11px] font-medium text-foreground/80">{children}</span>;

const Vouchers = () => {
  const { refreshMe } = useAuth();
  const [data, setData] = useState<RewardDashboard | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [rotation, setRotation] = useState(0);

  const load = async () => {
    const result = await apiFetch<RewardDashboard>('/rewards/dashboard');
    setData(result);
  };

  useEffect(() => {
    load().catch(() => setMessage('Không tải được voucher.'));
  }, []);

  const wheelItems = useMemo(() => {
    const items = [...(data?.spinVouchers || [])];
    return [...items, { id: 'lose', code: 'LOSE', title: 'Chúc bạn may mắn lần sau', description: 'Không nhận được voucher', discountType: 'fixed', discountValue: 0, minOrderAmount: 0, coinCost: 0, isSpinEnabled: true }];
  }, [data?.spinVouchers]);

  const spinToOutcome = (outcomeCode: string) => {
    const index = Math.max(0, wheelItems.findIndex((item) => item.code === outcomeCode));
    const segment = 360 / Math.max(1, wheelItems.length);
    const target = 360 * 6 + (360 - index * segment - segment / 2);
    setRotation(target);
  };

  const redeem = async (voucherId: string) => {
    setLoading(voucherId);
    try {
      const result = await apiFetch<{ message: string }>('/rewards/vouchers/' + voucherId + '/redeem', { method: 'POST' });
      setMessage(result.message);
      await load();
      await refreshMe();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading('');
    }
  };

  const spin = async () => {
    setLoading('spin');
    try {
      const result = await apiFetch<{ message: string; prize: UserVoucher | null; outcomeCode: string }>('/rewards/spin', { method: 'POST' });
      spinToOutcome(result.outcomeCode || 'LOSE');
      setMessage(result.prize ? `${result.message}: ${result.prize.voucher.code}` : result.message);
      await load();
      await refreshMe();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoading('');
    }
  };

  const segmentAngle = 360 / Math.max(1, wheelItems.length);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-amber-50 shadow-soft">
        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-6 p-6 lg:p-8 items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-[320px] h-[320px] max-w-full">
              <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[22px] border-l-transparent border-r-transparent border-b-foreground z-20" />
              <div
                className="relative w-full h-full rounded-full border-[10px] border-white shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition-transform duration-[4200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(${wheelItems.map((item, index) => `${colors[index % colors.length]} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`).join(', ')})`,
                }}
              >
                {wheelItems.map((item, index) => {
                  const angle = index * segmentAngle + segmentAngle / 2;
                  return (
                    <div key={item.id} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-center w-28 -rotate-90 origin-center leading-tight text-foreground/90">
                        {item.title}
                      </div>
                    </div>
                  );
                })}
                <div className="absolute inset-[38%] rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">Spin</div>
              </div>
            </div>
            <Button onClick={spin} disabled={loading === 'spin'} className="rounded-full px-8">{loading === 'spin' ? 'Đang quay...' : `Quay ngay (${data?.spinCost || 0} xu)`}</Button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary"><Sparkles className="w-4 h-4" /> Vòng quay may mắn</div>
              <h2 className="text-2xl font-bold">Săn voucher đẹp, nhận 1 lần cho mỗi tài khoản</h2>
              <p className="text-sm text-muted-foreground">Voucher quay trúng hoặc đổi bằng xu sẽ được lưu vào tài khoản. Mỗi mã chỉ nhận và dùng 1 lần trên cùng tài khoản để tránh trùng lặp.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <VoucherTone>Số xu hiện có: {data?.coinBalance || 0}</VoucherTone>
              <VoucherTone>Luôn có ô may mắn lần sau</VoucherTone>
              <VoucherTone>Voucher hợp lệ tự hiện ở checkout</VoucherTone>
            </div>
            {message && <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">{message}</div>}
            <div className="rounded-3xl border bg-white/80 p-4 backdrop-blur">
              <p className="mb-3 font-semibold">Voucher đang có trên vòng quay</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {wheelItems.map((item) => <div key={item.id} className="rounded-2xl border bg-background/80 px-3 py-2 text-sm"><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.code !== 'LOSE' ? item.code : '---'}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-soft p-6 border">
        <div className="flex items-center gap-2 mb-4"><Coins className="w-5 h-5 text-primary" /><h3 className="font-semibold text-lg">Đổi voucher</h3></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.storeVouchers?.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-primary/5">
              <div className="border-b bg-primary/5 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary">{v.code}</p>
                    <p className="mt-1 text-lg font-bold">{v.title}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">1 lần/tài khoản</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{v.description || 'Voucher ưu đãi dành riêng cho bạn.'}</p>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><BadgePercent className="w-4 h-4 text-primary" /> {benefitLabel(v)}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Ticket className="w-4 h-4" /> Đơn từ {formatCurrency(v.minOrderAmount)}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="w-4 h-4" /> {v.expiresAt ? `HSD ${new Date(v.expiresAt).toLocaleDateString('vi-VN')}` : 'Không giới hạn ngày hết hạn'}</div>
                <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Giá đổi</span>
                  <span className="font-semibold text-primary">{v.coinCost} xu</span>
                </div>
                <Button disabled={loading === v.id || v.ownedAlready} onClick={() => redeem(v.id)} className="w-full rounded-xl">{v.ownedAlready ? 'Đã nhận voucher này' : loading === v.id ? 'Đang đổi...' : 'Đổi voucher'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-3xl shadow-soft p-6 border">
        <div className="flex items-center gap-2 mb-4"><Gift className="w-5 h-5 text-primary" /><h3 className="font-semibold text-lg">Voucher đã lưu</h3></div>
        <div className="grid gap-4 md:grid-cols-2">
          {data?.myVouchers?.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-secondary/40">
              <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"><Ticket className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary">{item.voucher.code}</p>
                    <p className="font-bold text-lg">{item.voucher.title}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.redeemedAt ? 'bg-slate-100 text-slate-600' : item.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.redeemedAt ? 'Đã dùng' : item.isValid ? 'Sẵn sàng dùng' : 'Chưa hợp lệ / hết hạn'}</span>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm text-muted-foreground">{item.voucher.description || 'Voucher đã được lưu vào tài khoản của bạn.'}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <VoucherTone>{benefitLabel(item.voucher)}</VoucherTone>
                  <VoucherTone>Nguồn: {item.source === 'SPIN' ? 'Vòng quay' : 'Đổi xu'}</VoucherTone>
                  <VoucherTone>1 lần/tài khoản</VoucherTone>
                </div>
                <p className="text-sm text-muted-foreground">Nhận lúc {new Date(item.createdAt).toLocaleString('vi-VN')}{item.voucher.expiresAt ? ` · HSD ${new Date(item.voucher.expiresAt).toLocaleDateString('vi-VN')}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vouchers;

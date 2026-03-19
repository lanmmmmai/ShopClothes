import { useEffect, useState } from 'react';
import { Coins, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type Task = { id: string; title: string; description?: string; coinReward: number; claimed: boolean };
type Transaction = { id: string; amount: number; description: string; createdAt: string };
type RewardDashboard = {
  coinBalance: number;
  spinCost: number;
  tasks: Task[];
  transactions: Transaction[];
};

const LoyaltyCoins = () => {
  const { refreshMe } = useAuth();
  const [data, setData] = useState<RewardDashboard | null>(null);
  const [loadingId, setLoadingId] = useState<string>('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const result = await apiFetch<RewardDashboard>('/rewards/dashboard');
    setData(result);
  };

  useEffect(() => {
    load().catch(() => setMessage('Không tải được dữ liệu xu.'));
  }, []);

  const claimTask = async (taskId: string) => {
    setLoadingId(taskId);
    setMessage('');
    try {
      const result = await apiFetch<{ message: string }>('/rewards/tasks/' + taskId + '/claim', { method: 'POST' });
      setMessage(result.message);
      await load();
      await refreshMe();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setLoadingId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold mb-6">Xu tích lũy</h2>
        <div className="flex items-center gap-4 bg-primary/5 rounded-lg p-6 mb-3">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Coins className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số xu hiện có</p>
            <p className="text-3xl font-bold text-primary">{data?.coinBalance?.toLocaleString() || 0}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Admin có thể tạo nhiệm vụ nhận xu, đặt giá đổi voucher bằng xu và đặt phí quay vòng quay voucher.</p>
        {message && <p className="text-sm mt-3 text-primary">{message}</p>}
      </div>

      <div className="bg-background rounded-lg shadow-soft p-6">
        <div className="flex items-center gap-2 mb-4"><Gift className="w-5 h-5 text-primary" /><h3 className="font-semibold">Nhiệm vụ nhận xu</h3></div>
        <div className="space-y-3">
          {data?.tasks?.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.description || 'Hoàn thành nhiệm vụ để nhận thưởng.'}</p>
                <p className="text-sm text-primary font-medium mt-1">+{task.coinReward} xu</p>
              </div>
              <Button disabled={task.claimed || loadingId === task.id} onClick={() => claimTask(task.id)}>
                {task.claimed ? 'Đã nhận' : loadingId === task.id ? 'Đang xử lý...' : 'Nhận xu'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-lg shadow-soft p-6">
        <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-primary" /><h3 className="font-semibold">Lịch sử biến động xu</h3></div>
        <div className="space-y-3">
          {data?.transactions?.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3 text-sm">
              <div>
                <p>{item.description}</p>
                <p className="text-muted-foreground">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <p className={item.amount >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{item.amount >= 0 ? '+' : ''}{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCoins;

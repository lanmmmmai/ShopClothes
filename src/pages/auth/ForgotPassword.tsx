import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mật khẩu mới');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-10 w-10" />
        </div>
        <div>
          <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Email đã gửi</p>
          <h1 className="mt-4 text-3xl font-bold">Kiểm tra hộp thư của bạn</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Gmail nhận mật khẩu mới đã được gửi đến <strong>{email}</strong>
          </p>
        </div>
        <div className="rounded-3xl border bg-muted/30 p-5 text-left">
          <p className="text-sm font-semibold">Sau khi nhận email:</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Đăng nhập bằng mật khẩu tạm thời trong email.</li>
            <li>Hệ thống sẽ khóa mọi trang khác cho tới khi bạn đổi mật khẩu mới.</li>
            <li>Kiểm tra cả mục Spam nếu chưa thấy thư.</li>
          </ul>
        </div>
        <Link to="/auth/login">
          <Button variant="outline" className="gap-2 rounded-2xl">
            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/auth/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="rounded-[28px] border bg-gradient-to-br from-primary/10 via-background to-amber-50 p-6 shadow-soft">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-sm">
          <KeyRound className="w-4 h-4" /> Khôi phục mật khẩu
        </div>
        <h1 className="mt-4 text-3xl font-bold">Lấy lại quyền truy cập tài khoản</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Nhập email đã đăng ký. Hệ thống sẽ gửi mật khẩu tạm thời với giao diện email mới đẹp hơn và yêu cầu bạn đổi mật khẩu ngay sau khi đăng nhập.
        </p>
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/80 p-4 text-sm text-muted-foreground backdrop-blur">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <span>Để bảo mật, tài khoản dùng mật khẩu tạm thời sẽ không được vào bất kỳ trang nào khác ngoài trang đổi mật khẩu.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border bg-background p-6 shadow-soft">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-2xl" required />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi mật khẩu mới'}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;

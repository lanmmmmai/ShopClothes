import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, verifyOtp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signup({ fullName: form.fullName, email: form.email, password: form.password });
      setMessage(result.message);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(form.email, form.otp);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Tạo tài khoản</h1>
      <p className="text-muted-foreground text-sm mb-8">Đăng ký để bắt đầu mua sắm</p>

      {step === 'register' ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label>Họ và tên</Label>
            <Input placeholder="Nguyễn Văn A" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Xác nhận mật khẩu</Label>
            <Input type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-emerald-600">{message || 'OTP đã được gửi về Gmail của bạn.'}</p>
          <div className="space-y-2">
            <Label>Mã OTP</Label>
            <Input placeholder="Nhập 6 số OTP" value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Xác nhận tài khoản'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Đã có tài khoản? <Link to="/auth/login" className="text-primary hover:underline font-medium">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default Signup;

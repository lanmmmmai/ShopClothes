import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

const ChangePassword = () => {
  const { changePassword, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const forced = params.get('forced') === '1' || user?.mustChangePassword;
  const nextUrl = params.get('next') ? decodeURIComponent(params.get('next') as string) : '/';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu chưa khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      toast.success(result.message || 'Đã cập nhật mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate(nextUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-soft p-6">
      <h2 className="text-lg font-semibold mb-2">Đổi mật khẩu</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {forced ? 'Bạn đang đăng nhập bằng mật khẩu tạm thời từ Gmail. Hãy đổi sang mật khẩu mới trước khi tiếp tục.' : 'Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn tốt hơn.'}
      </p>
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>{forced ? 'Mật khẩu tạm thời' : 'Mật khẩu hiện tại'}</Label>
          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <div className="space-y-2">
          <Label>Mật khẩu mới</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <div className="space-y-2">
          <Label>Xác nhận mật khẩu mới</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>{loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}</Button>
      </form>
    </div>
  );
};

export default ChangePassword;

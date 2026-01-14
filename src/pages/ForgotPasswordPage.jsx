import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPasswordWithToken } from '../auth/authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(token ? 'reset' : 'request'); // 'request' or 'reset'
  const [success, setSuccess] = useState(false);

  // Step 1: Request reset (forgot password)
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Không thể gửi email đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset with token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token không hợp lệ. Vui lòng sử dụng link từ email.');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithToken(token, newPassword);
      setSuccess(true);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'reset') {
    // Step 2: Reset password with token
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[720px] border border-gray-300 rounded-lg p-8">
          <h1 className="text-center text-4xl font-extrabold mb-2">Đặt lại mật khẩu</h1>
          <p className="text-center text-gray-500 mb-10">Nhập mật khẩu mới</p>

          {success ? (
            <div className="text-center">
              <div className="text-green-600 mb-4">Đặt lại mật khẩu thành công!</div>
              <p className="text-gray-600 mb-4">Đang chuyển đến trang đăng nhập...</p>
              <Link className="text-blue-600 font-bold" to="/login">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 max-w-[560px] mx-auto">
              <div>
                <label className="block font-bold mb-2">Mật khẩu mới</label>
                <input
                  className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="******"
                  type="password"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Xác nhận mật khẩu</label>
                <input
                  className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="******"
                  type="password"
                  minLength={6}
                  required
                />
              </div>

              {error && <div className="text-red-600">{error}</div>}

              <button
                disabled={loading}
                className="w-full h-[58px] rounded-full bg-black text-white font-bold disabled:opacity-60"
                type="submit"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>

              <div className="text-center">
                <Link className="font-bold" to="/login">
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Step 1: Request reset
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[720px] border border-gray-300 rounded-lg p-8">
        <h1 className="text-center text-4xl font-extrabold mb-2">Quên mật khẩu</h1>
        <p className="text-center text-gray-500 mb-10">Nhập email để nhận link đặt lại mật khẩu</p>

        {success ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">
              Đã gửi email! Vui lòng kiểm tra hộp thư và click vào link để đặt lại mật khẩu.
            </div>
            <p className="text-gray-600 mb-4">Link sẽ hết hạn sau 1 giờ.</p>
            <Link className="text-blue-600 font-bold" to="/login">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-6 max-w-[560px] mx-auto">
            <div>
              <label className="block font-bold mb-2">Email</label>
              <input
                className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                type="email"
                required
              />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <button
              disabled={loading}
              className="w-full h-[58px] rounded-full bg-black text-white font-bold disabled:opacity-60"
              type="submit"
            >
              {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
            </button>

            <div className="text-center">
              <Link className="font-bold" to="/login">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("Vui lòng nhập tên đăng nhập");
    if (!password) return setError("Vui lòng nhập mật khẩu");

    try {
      setLoading(true);
      await login(username.trim(), password);
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block md:w-1/2">
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/2wjrgk1o_expires_30_days.png"}
            className="w-full h-full object-cover"
            alt="cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-[520px] flex flex-col items-center bg-white py-8 px-6 sm:px-10 gap-6 rounded-lg border border-solid border-[#8C8C8C]"
            style={{ boxShadow: "0px 1px 4px #18203C12" }}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-black text-4xl font-bold">Đăng Nhập</span>
              <span className="text-[#3C3C43] text-sm">Chào mừng bạn đã đến với chúng tôi</span>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-black text-sm font-bold">Tên đăng nhập</span>
                <input
                  className="bg-white w-full h-[46px] rounded-[50px] border border-solid border-[#D9D9D9] px-5 outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-black text-sm font-bold">Mật khẩu</span>
                <input
                  type="password"
                  className="bg-white w-full h-[46px] rounded-[50px] border border-solid border-[#D9D9D9] px-5 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end">
                <Link className="text-[#3C3C43] text-sm" to="/forgot">Quên mật khẩu?</Link>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                disabled={loading}
                className="bg-black text-white text-sm font-bold py-3.5 rounded-[50px] disabled:opacity-60"
                style={{ boxShadow: "0px 1px 4px #18203C12" }}
                type="submit"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="text-center text-base">
                <span className="text-[#3C3C43]">Bạn chưa có tài khoản? </span>
                <Link className="text-black font-semibold" to="/signup">Đăng ký</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

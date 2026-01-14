import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) return setError("Vui lòng nhập tên đăng nhập");
    if (!form.email.trim()) return setError("Vui lòng nhập email");
    if (!form.password) return setError("Vui lòng nhập mật khẩu");
    if (form.password !== form.confirmPassword) return setError("Mật khẩu xác nhận không khớp");

    try {
      setLoading(true);
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      alert("Tạo tài khoản thành công! Vui lòng kiểm tra Gmail.");
      navigate("/");
    } catch (err) {
      setError(err?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[720px] border border-gray-300 rounded-lg p-8">
        <h1 className="text-center text-5xl font-extrabold mb-2">Đăng Ký</h1>
        <p className="text-center text-gray-500 mb-10">Tạo tài khoản mới</p>

        <form onSubmit={onSubmit} className="space-y-6 max-w-[560px] mx-auto">
          <div>
            <label className="block font-bold mb-2">Tên đăng nhập</label>
            <input
              className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
              value={form.username}
              onChange={onChange("username")}
              placeholder="username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
              value={form.email}
              onChange={onChange("email")}
              placeholder="email@gmail.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Mật khẩu</label>
            <input
              className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
              value={form.password}
              onChange={onChange("password")}
              placeholder="******"
              type="password"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Xác nhận mật khẩu</label>
            <input
              className="w-full h-[54px] rounded-full border border-gray-300 px-6 outline-none"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              placeholder="******"
              type="password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button
            disabled={loading}
            className="w-full h-[58px] rounded-full bg-black text-white font-bold disabled:opacity-60"
            type="submit"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <div className="text-center">
            Đã có tài khoản? <Link className="font-bold" to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Customers from "./pages/generated/customers.jsx";
import Report from "./pages/generated/report.jsx";
import Schedule from "./pages/generated/schedule.jsx";
import Settings from "./pages/generated/settings.jsx";

import Placeholder from "./pages/Placeholder.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Placeholder title="Trang chủ" />
          </ProtectedRoute>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        <Route path="/customers" element={
          <ProtectedRoute allowRoles={["admin", "staff"]}>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute allowRoles={["admin", "staff"]}>
            <Report />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute allowRoles={["admin", "staff", "user"]}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowRoles={["admin"]}>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <Placeholder title="Các sản phẩm" />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={<ProtectedRoute><Placeholder title="Dashboard" /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Placeholder title="Giỏ hàng" /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Placeholder title="Thanh toán" /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Placeholder title="Quản lý tài khoản" /></ProtectedRoute>} />
        <Route path="/detail-product" element={<ProtectedRoute><Placeholder title="Chi tiết sản phẩm" /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        <Route path="/403" element={<Placeholder title="403 - Không có quyền truy cập" />} />
        <Route path="*" element={<Placeholder title="404 - Không tìm thấy" />} />
      </Routes>

      <ChatWidget />
    </>
  );
}

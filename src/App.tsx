import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import PasswordChangeEnforcer from '@/components/PasswordChangeEnforcer';
import RealtimeBridge from '@/components/RealtimeBridge';

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AccountLayout from "@/layouts/AccountLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Auth pages
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Shop pages
import Index from "@/pages/Index";
import Products from "@/pages/shop/Products";
import ProductDetail from "@/pages/shop/ProductDetail";
import Category from "@/pages/shop/Category";
import Cart from "@/pages/shop/Cart";
import Checkout from "@/pages/shop/Checkout";
import About from "@/pages/About";
import Notifications from "@/pages/Notifications";

// Account pages
import AccountDashboard from "@/pages/account/AccountDashboard";
import Profile from "@/pages/account/Profile";
import Orders from "@/pages/account/Orders";
import OrderDetail from "@/pages/account/OrderDetail";
import Addresses from "@/pages/account/Addresses";
import PaymentMethods from "@/pages/account/PaymentMethods";
import Vouchers from "@/pages/account/Vouchers";
import LoyaltyCoins from "@/pages/account/LoyaltyCoins";
import AccountNotifications from "@/pages/account/AccountNotifications";
import ChangePassword from "@/pages/account/ChangePassword";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import Revenue from "@/pages/admin/Revenue";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import ProductForm from "@/pages/admin/ProductForm";
import UsersManagement from "@/pages/admin/UsersManagement";
import VoucherManagement from "@/pages/admin/VoucherManagement";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <RealtimeBridge />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PasswordChangeEnforcer />
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Main shop routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Account routes */}
              <Route element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                <Route path="/account" element={<AccountDashboard />} />
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/orders" element={<Orders />} />
                <Route path="/account/orders/:id" element={<OrderDetail />} />
                <Route path="/account/addresses" element={<Addresses />} />
                <Route path="/account/payments" element={<PaymentMethods />} />
                <Route path="/account/vouchers" element={<Vouchers />} />
                <Route path="/account/coins" element={<LoyaltyCoins />} />
                <Route path="/account/notifications" element={<AccountNotifications />} />
                <Route path="/account/password" element={<ChangePassword />} />
              </Route>

              {/* Admin routes */}
              <Route element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/revenue" element={<Revenue />} />
                <Route path="/admin/orders" element={<OrdersManagement />} />
                <Route path="/admin/products" element={<ProductsManagement />} />
                <Route path="/admin/products/new" element={<ProductForm />} />
                <Route path="/admin/products/:id" element={<ProductForm />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/vouchers" element={<VoucherManagement />} />
                <Route path="/admin/coins" element={<VoucherManagement />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

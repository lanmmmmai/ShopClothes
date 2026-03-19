import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Package, MapPin, Ticket, Coins, Bell, Lock, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useAuth } from '@/hooks/useAuth';

const accountLinks = [
  { label: 'Tổng quan', href: '/account', icon: LayoutDashboard },
  { label: 'Hồ sơ', href: '/account/profile', icon: User },
  { label: 'Đơn hàng', href: '/account/orders', icon: Package },
  { label: 'Địa chỉ', href: '/account/addresses', icon: MapPin },
  { label: 'Phương thức thanh toán', href: '/account/payments', icon: CreditCard },
  { label: 'Voucher', href: '/account/vouchers', icon: Ticket },
  { label: 'Xu tích lũy', href: '/account/coins', icon: Coins },
  { label: 'Thông báo', href: '/account/notifications', icon: Bell },
  { label: 'Đổi mật khẩu', href: '/account/password', icon: Lock },
];

const AccountLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-72 shrink-0 space-y-4">
              <div className="bg-background rounded-lg shadow-soft p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user?.full_name || user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <nav className="bg-background rounded-lg shadow-soft p-2 space-y-0.5">
                {accountLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default AccountLayout;

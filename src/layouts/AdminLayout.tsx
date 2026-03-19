import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Package, ShoppingCart, Users, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const adminLinks = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { label: 'Doanh thu', href: '/admin/revenue', icon: TrendingUp },
  { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package },
  { label: 'Người dùng', href: '/admin/users', icon: Users },
  { label: 'Voucher', href: '/admin/vouchers', icon: Ticket },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border/50 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="text-lg font-bold">
            Shop<span className="text-primary">Clothes</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Quản trị viên</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {adminLinks.map(link => {
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

        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-semibold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

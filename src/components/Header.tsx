import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Bell, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAccountNotifications } from '@/lib/account-data';
import { createBrowserNotificationSound, subscribeRealtimeUpdate } from '@/lib/realtime-order';

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Áo', href: '/category/ao' },
  { label: 'Váy & Đầm', href: '/category/vay-dam' },
  { label: 'Quần', href: '/category/quan' },
  { label: 'Giới thiệu', href: '/about' },
];

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const previousUnread = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      setUnreadNotifications(0);
      previousUnread.current = 0;
      return;
    }
    const sync = () => {
      const nextUnread = getAccountNotifications(user.id).filter((item) => !item.is_read).length;
      if (nextUnread > previousUnread.current) createBrowserNotificationSound();
      previousUnread.current = nextUnread;
      setUnreadNotifications(nextUnread);
    };
    sync();
    return subscribeRealtimeUpdate(sync);
  }, [user?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const userInitial = useMemo(() => user?.full_name?.charAt(0)?.toUpperCase() || user?.fullName?.charAt(0)?.toUpperCase() || 'U', [user]);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="bg-foreground text-background text-xs py-1.5 text-center tracking-wide">
        Miễn phí vận chuyển cho đơn hàng từ 500.000₫ | Mã: <span className="font-semibold">WELCOME10</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="text-xl font-bold tracking-tight">
            Shop<span className="text-primary">Clothes</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/notifications" className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-sm animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary border-0">
                  {totalItems}
                </Badge>
              )}
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded-full transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary border border-primary/20">
                      {userInitial}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="pb-1">
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.full_name || user?.fullName}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/account')}>
                    <Settings className="mr-2 h-4 w-4" />
                    {isAdmin ? 'Bảng quản trị' : 'Cài đặt tài khoản'}
                  </DropdownMenuItem>
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                        <Package className="mr-2 h-4 w-4" /> Đơn hàng của tôi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/notifications')}>
                        <Bell className="mr-2 h-4 w-4" /> Thông báo
                        {unreadNotifications > 0 && (
                          <Badge className="ml-auto bg-primary text-primary-foreground rounded-full min-w-6 justify-center">{unreadNotifications}</Badge>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login" className="p-2 hover:bg-muted rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-muted rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 ring-primary/20"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && !isAdmin && (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-primary">
                  Cài đặt tài khoản
                </Link>
                <Link to="/account/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-muted-foreground">
                  Đơn hàng của tôi
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-primary">
                Quản trị
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

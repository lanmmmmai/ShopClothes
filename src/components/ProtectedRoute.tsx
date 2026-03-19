import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.mustChangePassword && location.pathname !== '/account/password') {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/account/password?forced=1&next=${next}`} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const PasswordChangeEnforcer = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user?.mustChangePassword) return;
    if (location.pathname === '/account/password') return;

    const next = encodeURIComponent(location.pathname + location.search);
    navigate(`/account/password?forced=1&next=${next}`, { replace: true });
  }, [loading, user?.mustChangePassword, location.pathname, location.search, navigate]);

  return null;
};

export default PasswordChangeEnforcer;

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  full_name: string;
  role: 'admin' | 'user';
  isVerified: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
  coinBalance: number;
  loyalty_points: number;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  phone?: string;
};

interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<{ userId?: string; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ message: string }>;
  updateProfile: (payload: { fullName?: string; avatarUrl?: string | null }) => Promise<{ message: string }>;
  refreshMe: () => Promise<void>;
  logout: () => void;
  hasRole: (role: 'admin' | 'staff' | 'user') => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (raw: any): AuthUser => ({
  ...raw,
  fullName: raw.fullName || raw.full_name,
  full_name: raw.full_name || raw.fullName,
  coinBalance: raw.coinBalance ?? raw.loyalty_points ?? 0,
  loyalty_points: raw.loyalty_points ?? raw.coinBalance ?? 0,
  mustChangePassword: Boolean(raw.mustChangePassword),
  avatarUrl: raw.avatarUrl ?? raw.avatar_url ?? null,
  avatar_url: raw.avatar_url ?? raw.avatarUrl ?? null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const me = await apiFetch<any>('/auth/me');
    setUser(normalizeUser(me));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    refreshMe()
      .catch(() => {
        localStorage.removeItem('access_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const result = await apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('access_token', result.token);
    const nextUser = normalizeUser(result.user);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    return apiFetch<{ userId?: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const result = await apiFetch<{ token: string; user: any }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    localStorage.setItem('access_token', result.token);
    setUser(normalizeUser(result.user));
    return true;
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const result = await apiFetch<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    await refreshMe();
    return result;
  }, [refreshMe]);

  const updateProfile = useCallback(async (payload: { fullName?: string; avatarUrl?: string | null }) => {
    const result = await apiFetch<{ message: string; user: any }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    setUser(normalizeUser(result.user));
    return { message: result.message };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  const hasRole = useCallback((role: 'admin' | 'staff' | 'user') => {
    if (role === 'staff') return false;
    return user?.role === role;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isStaff: user?.role === 'admin',
      login,
      signup,
      verifyOtp,
      forgotPassword,
      changePassword,
      updateProfile,
      refreshMe,
      logout,
      hasRole,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

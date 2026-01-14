import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginWithNoco, logout as doLogout, registerWithNoco, requestPasswordReset, resetPasswordWithToken } from './authApi';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user on mount
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      loading,
      async login(username, password) {
        const u = await loginWithNoco(username, password);
        setUser(u);
        return u;
      },
      async register(payload) {
        const u = await registerWithNoco(payload);
        setUser(u);
        return u;
      },
      async requestPasswordReset(email) {
        return await requestPasswordReset(email);
      },
      async resetPasswordWithToken(token, newPassword) {
        return await resetPasswordWithToken(token, newPassword);
      },
      async logout() {
        await doLogout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

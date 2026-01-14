import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ allowRoles, children }) {
  const { isAuthed, user, loading } = useAuth();

  // Loading gate: wait for auth to finish loading before making decisions
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;

  if (allowRoles && allowRoles.length > 0) {
    const role = user?.role;
    if (!allowRoles.includes(role)) return <Navigate to="/403" replace />;
  }

  return children;
}

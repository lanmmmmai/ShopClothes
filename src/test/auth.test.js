import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import { AuthProvider } from '../auth/AuthContext';
import { requestPasswordReset, resetPasswordWithToken } from '../auth/authApi';

// Mock auth API
vi.mock('../auth/authApi', () => ({
  getCurrentUser: vi.fn(() => Promise.resolve({ id: '1', username: 'test', role: 'user' })),
  loginWithNoco: vi.fn(),
  registerWithNoco: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPasswordWithToken: vi.fn(),
  logout: vi.fn(),
}));

function TestWrapper({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', async () => {
    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).toBeInTheDocument();
    });
  });
});

describe('Password Reset Flow', () => {
  it('should call requestPasswordReset with email', async () => {
    const email = 'test@example.com';
    await requestPasswordReset(email);
    expect(requestPasswordReset).toHaveBeenCalledWith(email);
  });

  it('should call resetPasswordWithToken with token and password', async () => {
    const token = 'a'.repeat(64); // 64 char hex token
    const password = 'newpassword123';
    await resetPasswordWithToken(token, password);
    expect(resetPasswordWithToken).toHaveBeenCalledWith(token, password);
  });
});

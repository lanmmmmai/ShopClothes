import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get current user from backend
 * Token is stored in httpOnly cookie, so we just call the API
 */
export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/me');
    return response.data.user || null;
  } catch (error) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

/**
 * Login with backend API
 * Token is set as httpOnly cookie by backend
 */
export async function loginWithNoco(username, password) {
  const response = await api.post('/auth/login', { username, password });
  return response.data.user;
}

/**
 * Register with backend API
 * Token is set as httpOnly cookie by backend
 */
export async function registerWithNoco({ username, email, password }) {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data.user;
}

/**
 * Step 1: Request password reset (forgot password)
 * Sends email with reset token
 */
export async function requestPasswordReset(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}

/**
 * Step 2: Reset password with token
 * Uses token from email to reset password
 */
export async function resetPasswordWithToken(token, newPassword) {
  await api.post('/auth/reset-password', { token, newPassword });
  return true;
}

/**
 * Legacy: Reset password by email (deprecated, use 2-step flow instead)
 * @deprecated Use requestPasswordReset + resetPasswordWithToken instead
 */
export async function resetPasswordByEmail(email, newPassword) {
  await api.post('/auth/reset-password', { email, newPassword });
  return true;
}

/**
 * Logout - clears httpOnly cookie
 */
export async function logout() {
  await api.post('/auth/logout');
}

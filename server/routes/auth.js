import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/n8n.js';
import { buildNocoDBWhere } from '../utils/nocodb.js';
import { isValidEmail, isValidUsername, isValidPassword, sanitizeString } from '../utils/validation.js';
import { getJWTSecret } from '../utils/jwt.js';
import { logError } from '../utils/logging.js';

const router = express.Router();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'http://localhost:8080';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const NOCODB_PROJECT = process.env.NOCODB_PROJECT;

// Helper to get NocoDB axios instance
function getNocoDBClient() {
  return axios.create({
    baseURL: `${NOCODB_BASE_URL}/api/v1/db/data/v1/${NOCODB_PROJECT}`,
    headers: {
      'xc-token': NOCODB_TOKEN,
      'Content-Type': 'application/json',
    },
  });
}

// Helper to sanitize user (remove password)
function sanitizeUser(user) {
  if (!user) return null;
  const { password, resetToken, resetTokenExpiry, ...rest } = user;
  return rest;
}

// Helper to create JWT token
function createToken(user) {
  const JWT_SECRET = getJWTSecret();
  return jwt.sign({ id: user.Id || user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Generate secure reset token
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }

    const sanitizedUsername = sanitizeString(username);
    if (!isValidUsername(sanitizedUsername)) {
      return res.status(400).json({ error: 'Tên đăng nhập không hợp lệ' });
    }

    const nocodb = getNocoDBClient();
    // Use safe NocoDB where clause
    const whereClause = buildNocoDBWhere('username', 'eq', sanitizedUsername);
    const response = await nocodb.get('/users', {
      params: { where: whereClause, limit: 1 },
    });

    const user = response?.data?.list?.[0];
    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại' });
    }

    // Verify password (must be bcrypt hashed)
    if (!user.password || !user.password.startsWith('$2')) {
      return res.status(401).json({ error: 'Tài khoản cần được cấu hình lại' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }

    const safeUser = sanitizeUser(user);
    const token = createToken(safeUser);

    // Set httpOnly cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ user: safeUser });
  } catch (error) {
    logError('Login error', error, req);
    res.status(500).json({ error: 'Lỗi đăng nhập' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tên đăng nhập, email và mật khẩu là bắt buộc' });
    }

    const sanitizedUsername = sanitizeString(username);
    const sanitizedEmail = sanitizeString(email).toLowerCase();

    if (!isValidUsername(sanitizedUsername)) {
      return res.status(400).json({ error: 'Tên đăng nhập không hợp lệ (tối thiểu 3 ký tự, chỉ chữ, số, _, -)' });
    }

    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const nocodb = getNocoDBClient();

    // Check username - use safe where clause
    const usernameWhere = buildNocoDBWhere('username', 'eq', sanitizedUsername);
    const usernameCheck = await nocodb.get('/users', {
      params: { where: usernameWhere, limit: 1 },
    });
    if (usernameCheck?.data?.list?.length) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }

    // Check email - use safe where clause
    const emailWhere = buildNocoDBWhere('email', 'eq', sanitizedEmail);
    const emailCheck = await nocodb.get('/users', {
      params: { where: emailWhere, limit: 1 },
    });
    if (emailCheck?.data?.list?.length) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const response = await nocodb.post('/users', {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
      role: 'user',
    });

    const user = response?.data;
    const safeUser = sanitizeUser(user);
    const token = createToken(safeUser);

    // Set httpOnly cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email (best effort, don't fail registration)
    try {
      await sendWelcomeEmail({ email: sanitizedEmail, username: sanitizedUsername });
    } catch (emailError) {
      // Log but don't fail registration
      logError('Failed to send welcome email', emailError, req);
    }

    res.status(201).json({ user: safeUser });
  } catch (error) {
    logError('Register error', error, req);
    res.status(500).json({ error: 'Lỗi đăng ký' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.session_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }

    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET);
    const nocodb = getNocoDBClient();
    const response = await nocodb.get(`/users/${decoded.id}`);
    const user = response?.data;
    const safeUser = sanitizeUser(user);

    res.json({ user: safeUser });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    logError('Get me error', error, req);
    res.status(500).json({ error: 'Lỗi lấy thông tin người dùng' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('session_token');
  res.json({ message: 'Đã đăng xuất' });
});

// Step 1: Request password reset (forgot password)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    const sanitizedEmail = sanitizeString(email).toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    const nocodb = getNocoDBClient();

    // Find user by email - use safe where clause
    const emailWhere = buildNocoDBWhere('email', 'eq', sanitizedEmail);
    const response = await nocodb.get('/users', {
      params: { where: emailWhere, limit: 1 },
    });

    const user = response?.data?.list?.[0];

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);

      // Save reset token to user record
      const userId = user.Id || user.id;
      await nocodb.patch(`/users/${userId}`, {
        resetToken,
        resetTokenExpiry: resetTokenExpiry.toISOString(),
      });

      // Send reset email (best effort)
      try {
        await sendPasswordResetEmail({ email: sanitizedEmail, token: resetToken });
      } catch (emailError) {
        logError('Failed to send password reset email', emailError, req);
        // Don't fail the request, token is still saved
      }
    }

    // Always return success message (security: prevent email enumeration)
    res.json({
      message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút',
    });
  } catch (error) {
    logError('Forgot password error', error, req);
    res.status(500).json({ error: 'Lỗi xử lý yêu cầu đặt lại mật khẩu' });
  }
});

// Step 2: Confirm password reset with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token và mật khẩu mới là bắt buộc' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    // Validate token format (64 char hex string)
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ error: 'Token không hợp lệ' });
    }

    const nocodb = getNocoDBClient();

    // Find user by reset token - use safe where clause
    const tokenWhere = buildNocoDBWhere('resetToken', 'eq', token);
    const response = await nocodb.get('/users', {
      params: { where: tokenWhere, limit: 1 },
    });

    const user = response?.data?.list?.[0];
    if (!user) {
      return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Check token expiry
    if (user.resetTokenExpiry) {
      const expiryDate = new Date(user.resetTokenExpiry);
      if (expiryDate < new Date()) {
        return res.status(400).json({ error: 'Token đã hết hạn. Vui lòng yêu cầu lại' });
      }
    }

    // Update password and clear reset token (one-time use)
    const userId = user.Id || user.id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await nocodb.patch(`/users/${userId}`, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.json({ message: 'Đã đặt lại mật khẩu thành công. Vui lòng đăng nhập lại' });
  } catch (error) {
    logError('Reset password error', error, req);
    res.status(500).json({ error: 'Lỗi đặt lại mật khẩu' });
  }
});

export { router as authRouter };

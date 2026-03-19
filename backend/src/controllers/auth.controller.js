import pkg from '@prisma/client';
const { OtpType, Role } = pkg;
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { sendOtpMail, sendTemporaryPasswordMail } from '../services/mail.service.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { addMinutes, generateOtp } from '../utils/otp.js';

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  avatarUrl: z.string().min(1).optional().nullable(),
});

function mapUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    role: user.role.toLowerCase(),
    isVerified: user.isVerified,
    coinBalance: user.coinBalance,
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

function generateTemporaryPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function register(req, res) {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: await hashPassword(data.password),
        role: Role.USER,
      },
    });

    const code = generateOtp();
    await prisma.otpCode.create({
      data: {
        code,
        type: OtpType.VERIFY_ACCOUNT,
        expiresAt: addMinutes(new Date(), 10),
        userId: user.id,
      },
    });

    try {
      await sendOtpMail({ to: user.email, fullName: user.fullName, code });
    } catch (_mailError) {
      return res.status(201).json({
        message: 'Đã tạo tài khoản nhưng chưa gửi được OTP vì thiếu cấu hình Gmail',
        userId: user.id,
      });
    }

    res.status(201).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra Gmail để lấy OTP.', userId: user.id });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Đăng ký thất bại' });
  }
}

export async function verifyAccount(req, res) {
  try {
    const schema = z.object({ email: z.string().email(), otp: z.string().length(6) });
    const { email, otp } = schema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const codeRecord = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        type: OtpType.VERIFY_ACCOUNT,
        code: otp,
        verifiedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!codeRecord || codeRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    await prisma.$transaction([
      prisma.otpCode.update({ where: { id: codeRecord.id }, data: { verifiedAt: new Date() } }),
      prisma.user.update({ where: { id: user.id }, data: { isVerified: true } }),
    ]);

    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    const token = signToken(freshUser);
    res.json({
      message: 'Xác thực tài khoản thành công',
      token,
      user: mapUser(freshUser),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Xác thực thất bại' });
  }
}

export async function login(req, res) {
  try {
    const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
    const { email, password } = schema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác thực OTP' });
    }

    res.json({
      token: signToken(user),
      user: mapUser(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Đăng nhập thất bại' });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Nếu email tồn tại, mật khẩu tạm thời đã được gửi về Gmail.' });
    }

    const temporaryPassword = generateTemporaryPassword();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(temporaryPassword),
        mustChangePassword: true,
      },
    });

    try {
      await sendTemporaryPasswordMail({ to: user.email, fullName: user.fullName, temporaryPassword });
    } catch (_mailError) {
      return res.status(400).json({ message: 'Chưa gửi được Gmail. Hãy kiểm tra cấu hình GMAIL_USER và GMAIL_APP_PASSWORD trong backend/.env' });
    }

    return res.json({ message: 'Mật khẩu mới đã được gửi về Gmail. Sau khi đăng nhập, bạn sẽ được yêu cầu đổi mật khẩu.' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cấp lại mật khẩu' });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Mật khẩu mới cần khác mật khẩu hiện tại' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        mustChangePassword: false,
      },
    });

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể đổi mật khẩu' });
  }
}

export async function me(req, res) {
  const { id, email, fullName, role, isVerified, createdAt, coinBalance, mustChangePassword, avatarUrl } = req.user;
  res.json({ id, email, fullName, role: role.toLowerCase(), isVerified, createdAt, coinBalance, mustChangePassword, avatarUrl });
}

export async function updateProfile(req, res) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const payload = {
      ...(typeof data.fullName === 'string' ? { fullName: data.fullName.trim() } : {}),
      ...(Object.prototype.hasOwnProperty.call(data, 'avatarUrl') ? { avatarUrl: data.avatarUrl || null } : {}),
    };

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: payload,
    });

    res.json({ message: 'Cập nhật hồ sơ thành công', user: mapUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật hồ sơ' });
  }
}

export async function adminUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: { orders: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role.toLowerCase(),
      isVerified: user.isVerified,
      coinBalance: user.coinBalance,
      createdAt: user.createdAt,
      ordersCount: user.orders.length,
      mustChangePassword: Boolean(user.mustChangePassword),
    })));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thể tải danh sách người dùng' });
  }
}

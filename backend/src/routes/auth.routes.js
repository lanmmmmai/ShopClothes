import { Router } from 'express';
import { adminUsers, changePassword, forgotPassword, login, me, register, updateProfile, verifyAccount } from '../controllers/auth.controller.js';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/register', register);
router.post('/verify-otp', verifyAccount);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', authRequired, changePassword);
router.get('/me', authRequired, me);
router.patch('/profile', authRequired, updateProfile);
router.get('/admin/users', authRequired, requireRole('ADMIN'), adminUsers);
export default router;

import { Router } from 'express';
import { createTask, createVoucher, getAdminRewards, updateSettings, updateTask, updateVoucher } from '../controllers/admin-reward.controller.js';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authRequired, requireRole('ADMIN'));
router.get('/', getAdminRewards);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.post('/vouchers', createVoucher);
router.patch('/vouchers/:id', updateVoucher);
router.put('/settings', updateSettings);

export default router;

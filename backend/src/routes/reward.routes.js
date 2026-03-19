import { Router } from 'express';
import { claimTask, redeemVoucher, rewardDashboard, spinVoucher } from '../controllers/reward.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authRequired);
router.get('/dashboard', rewardDashboard);
router.post('/tasks/:taskId/claim', claimTask);
router.post('/vouchers/:voucherId/redeem', redeemVoucher);
router.post('/spin', spinVoucher);

export default router;

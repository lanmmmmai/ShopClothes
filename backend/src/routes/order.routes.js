import { Router } from 'express';
import { adminOrderDetail, adminOrders, createOrder, createOrderChatMessage, getOrderChatMessages, myOrders, requestBankingOtp, updateOrderStatus } from '../controllers/order.controller.js';
import { authRequired, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authRequired);
router.get('/admin', requireRole('ADMIN'), adminOrders);
router.get('/admin/:id', requireRole('ADMIN'), adminOrderDetail);
router.patch('/admin/:id/status', requireRole('ADMIN'), updateOrderStatus);
router.get('/:id/chat', getOrderChatMessages);
router.post('/:id/chat', createOrderChatMessage);
router.post('/request-banking-otp', requestBankingOtp);
router.post('/', createOrder);
router.get('/mine', myOrders);
export default router;

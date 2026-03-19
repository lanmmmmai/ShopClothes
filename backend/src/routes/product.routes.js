import { Router } from 'express';
import { authRequired, optionalAuth, requireRole } from '../middleware/auth.middleware.js';
import { createProduct, deleteProduct, getProduct, listCategories, listProducts, updateProduct } from '../controllers/product.controller.js';

const router = Router();
router.get('/', optionalAuth, listProducts);
router.get('/categories', listCategories);
router.get('/:id', optionalAuth, getProduct);
router.post('/', authRequired, requireRole('ADMIN'), createProduct);
router.put('/:id', authRequired, requireRole('ADMIN'), updateProduct);
router.delete('/:id', authRequired, requireRole('ADMIN'), deleteProduct);
export default router;

import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/image', authRequired, uploadImage);

export default router;

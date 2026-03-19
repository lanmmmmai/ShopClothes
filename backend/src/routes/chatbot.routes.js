import { Router } from 'express';
import { askChatbot } from '../controllers/chatbot.controller.js';

const router = Router();
router.post('/', askChatbot);
export default router;

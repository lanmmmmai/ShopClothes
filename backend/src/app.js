import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import adminRewardRoutes from './routes/admin-reward.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const allowlist = new Set(env.clientUrls);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../uploads');

export const app = express();
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowlist.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.raw({ type: ['image/*', 'application/octet-stream'], limit: '10mb' }), uploadRoutes);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'chic-threads-backend' });
});

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Chic Threads backend is running', allowedOrigins: env.clientUrls });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin/rewards', adminRewardRoutes);

app.use((error, _req, res, _next) => {
  const isCorsError = typeof error?.message === 'string' && error.message.startsWith('CORS blocked');
  res.status(isCorsError ? 403 : 500).json({ message: error.message || 'Server error' });
});

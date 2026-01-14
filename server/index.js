import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth.js';
import { nocodbRouter } from './routes/nocodb.js';
import { n8nRouter } from './routes/n8n.js';
import { authenticateToken } from './middleware/auth.js';
import { validateEnv } from './utils/env.js';

dotenv.config();

// Validate environment variables on startup
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: { error: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth routes (public) - with rate limiting
app.use('/api/auth', authLimiter, authRouter);

// N8n webhook routes (public, but should be protected in production)
app.use("/api/n8n", n8nRouter);

// NocoDB proxy routes (protected)
// Note: CSRF protection not needed if using Authorization header
// If using cookie-based auth only, add csrfProtection middleware here
app.use('/api/nocodb', authenticateToken, nocodbRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

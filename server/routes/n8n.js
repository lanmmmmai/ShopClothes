import express from 'express';
import axios from 'axios';
import { logError } from '../utils/logging.js';

const router = express.Router();

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

// Proxy n8n webhook requests
router.post('/webhook/:webhookPath', async (req, res) => {
  try {
    const { webhookPath } = req.params;
    const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;

    const response = await axios.post(url, req.body);
    res.json(response.data);
  } catch (error) {
    logError('n8n webhook error', error, req);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Lỗi gọi n8n webhook',
    });
  }
});

export { router as n8nRouter };

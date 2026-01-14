import express from 'express';
import axios from 'axios';
import { logError } from '../utils/logging.js';

const router = express.Router();

const NOCODB_BASE_URL = process.env.NOCODB_BASE_URL || 'http://localhost:8080';
const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
const NOCODB_PROJECT = process.env.NOCODB_PROJECT;

// Proxy all NocoDB requests
router.all('*', async (req, res) => {
  try {
    const path = req.path;
    const method = req.method.toLowerCase();
    const url = `${NOCODB_BASE_URL}/api/v1/db/data/v1/${NOCODB_PROJECT}${path}`;

    const config = {
      method,
      url,
      headers: {
        'xc-token': NOCODB_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    if (['post', 'put', 'patch'].includes(method) && req.body) {
      config.data = req.body;
    }

    if (Object.keys(req.query).length > 0) {
      config.params = req.query;
    }

    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    logError('NocoDB proxy error', error, req);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.msg || 'Lỗi kết nối NocoDB',
    });
  }
});

export { router as nocodbRouter };

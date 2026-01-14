import axios from "axios";

/**
 * n8n webhook client (through backend API)
 * Create workflow:
 *  - Webhook POST path: welcome-email
 *  - Gmail Send: To {{$json.email}}
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function sendWelcomeEmail({ email, username }) {
  return axios.post(`${API_BASE_URL}/n8n/webhook/welcome-email`, { email, username }, {
    withCredentials: true,
  });
}

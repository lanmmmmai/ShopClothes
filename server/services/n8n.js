import axios from 'axios';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

export async function sendWelcomeEmail({ email, username }) {
  const url = `${N8N_BASE_URL}/webhook/welcome-email`;
  return axios.post(url, { email, username });
}

export async function sendPasswordResetEmail({ email, token }) {
  const url = `${N8N_BASE_URL}/webhook/password-reset`;
  return axios.post(url, { email, token });
}

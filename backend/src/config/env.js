import dotenv from 'dotenv';
dotenv.config();

const defaultClientUrls = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
];

const clientUrls = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map((item) => item.trim()).filter(Boolean)
  : process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((item) => item.trim()).filter(Boolean)
    : defaultClientUrls;

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
  clientUrls,
};

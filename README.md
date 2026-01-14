<<<<<<< HEAD
# ShopClothes
=======
# Shop Thời Trang (React + Vite + Tailwind)

Ứng dụng quản lý shop thời trang với authentication, tích hợp NocoDB và n8n.

## Yêu cầu hệ thống

- Node.js 18+ (khuyến nghị Node 20+)
- npm hoặc yarn
- NocoDB (để quản lý dữ liệu)
- n8n (tùy chọn, cho email notifications)

## Cài đặt

### 1. Cài đặt dependencies

```bash
# Cài đặt frontend dependencies
npm install

# Cài đặt backend dependencies
cd server
npm install
cd ..
```

### 2. Cấu hình môi trường

#### Frontend (.env)

Tạo file `.env` ở thư mục gốc (hoặc copy từ `.env.example`):

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (server/.env)

Tạo file `.env` trong thư mục `server` (hoặc copy từ `server/.env.example`):

```bash
cd server
cp .env.example .env
cd ..
```

Chỉnh sửa `server/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Configuration - QUAN TRỌNG: Đổi trong production!
JWT_SECRET=your-strong-random-secret-here
JWT_EXPIRES_IN=7d

# NocoDB Configuration
NOCODB_BASE_URL=http://localhost:8080
NOCODB_TOKEN=your-nocodb-api-token
NOCODB_PROJECT=your-project-id

# n8n Configuration (optional)
N8N_BASE_URL=http://localhost:5678
```

### 3. Cấu hình NocoDB

#### Development

1. Cài đặt NocoDB (Docker hoặc npm):

```bash
# Sử dụng Docker (khuyến nghị)
docker run -d --name nocodb -p 8080:8080 nocodb/nocodb:latest

# Hoặc cài đặt qua npm
npm install -g nocodb
npx nocodb
```

2. Tạo project và lấy API token:
   - Truy cập http://localhost:8080
   - Tạo project mới
   - Vào Settings > API Token để lấy token
   - Copy Project ID từ URL (ví dụ: `noco/xxx/yyy` -> ID là phần cuối)

3. Tạo table `users` với các cột:
   - `username` (SingleLineText)
   - `email` (Email)
   - `password` (SingleLineText) - sẽ được hash bằng bcrypt
   - `role` (SingleLineText, default: "user")

4. Cập nhật `NOCODB_TOKEN` và `NOCODB_PROJECT` trong `server/.env`

#### Production

- Sử dụng NocoDB self-hosted hoặc NocoDB Cloud
- Đảm bảo HTTPS cho NocoDB
- Sử dụng reverse proxy (nginx) với authentication
- Token NocoDB chỉ được lưu ở backend, không bao giờ expose ra frontend

### 4. Cấu hình n8n (Tùy chọn)

n8n được dùng để gửi email welcome khi user đăng ký.

#### Development

```bash
# Sử dụng Docker
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# Hoặc npm
npm install -g n8n
n8n start
```

Truy cập http://localhost:5678 và tạo workflow:
- Webhook trigger: `/webhook/welcome-email`
- Nhận `email` và `username`
- Gửi email (SMTP hoặc service như SendGrid)

#### Production

- Sử dụng n8n self-hosted với HTTPS
- Hoặc sử dụng n8n Cloud
- Cấu hình SMTP credentials an toàn

### 5. Chạy ứng dụng

#### Development

Mở 2 terminal:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

#### Production

```bash
# Build frontend
npm run build

# Chạy backend
cd server
npm start
```

Sử dụng PM2 hoặc systemd để chạy backend như service.

## Cấu trúc dự án

```
.
├── src/                    # Frontend React app
│   ├── auth/              # Authentication (Context, API, ProtectedRoute)
│   ├── components/        # React components
│   │   └── layout/       # Layout components (Layout, Sidebar, Button, Table)
│   ├── pages/            # Page components
│   │   └── generated/    # Generated pages (customers, report, etc.)
│   ├── services/         # API services
│   └── test/             # Tests
├── server/               # Backend Express API
│   ├── middleware/       # Auth middleware
│   ├── routes/          # API routes (auth, nocodb, n8n)
│   ├── services/        # External service integrations
│   └── test/            # Tests
└── README.md
```

## Authentication

Ứng dụng sử dụng JWT-based authentication với httpOnly cookies:

- **Backend**: Xử lý login/register, hash password (bcrypt), tạo JWT
- **Frontend**: Chỉ giữ session state (user info), token được lưu trong httpOnly cookie
- **NocoDB Token**: Chỉ ở backend, không bao giờ expose ra frontend
- **Authorization**: Kiểm tra quyền ở server middleware

### User Roles

- `admin`: Full access
- `staff`: Access to customers, reports, schedule
- `user`: Basic access

## Development

### Linting & Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Backend tests
cd server
npm test
```

### Pre-commit Hooks

Project sử dụng husky + lint-staged để tự động lint và format code trước khi commit.

## Security Notes

1. **JWT_SECRET**: Luôn đổi trong production, sử dụng strong random string
2. **NocoDB Token**: Không bao giờ commit vào git, chỉ lưu trong `.env`
3. **Cookies**: Sử dụng httpOnly, secure (HTTPS only), sameSite strict
4. **CORS**: Chỉ cho phép frontend URL trong production
5. **Password**: Tất cả passwords được hash bằng bcrypt (cost factor 10)

## Troubleshooting

### Backend không kết nối được NocoDB

- Kiểm tra `NOCODB_BASE_URL` có đúng không
- Kiểm tra NocoDB có đang chạy không (http://localhost:8080)
- Kiểm tra `NOCODB_TOKEN` và `NOCODB_PROJECT` có đúng không

### Frontend không kết nối được Backend

- Kiểm tra backend có đang chạy không (http://localhost:3001)
- Kiểm tra `VITE_API_URL` trong `.env`
- Kiểm tra CORS settings trong `server/index.js`

### Authentication không hoạt động

- Kiểm tra cookies có được gửi không (DevTools > Application > Cookies)
- Kiểm tra JWT_SECRET có match giữa các request không
- Kiểm tra httpOnly cookie settings

## License

Private project
>>>>>>> c225fb7 (init project)

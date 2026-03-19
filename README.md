## Cấu trúc mới

```bash
.
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src
│       ├── controllers
│       ├── middleware
│       ├── routes
│       ├── services
│       └── server.js
└── src
    ├── hooks/useAuth.tsx
    ├── components/AIStylist.tsx
    ├── pages/auth/*
    └── pages/shop/Checkout.tsx
```

## Biến môi trường backend

Tạo file `backend/.env` từ `backend/.env.example`:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-change-me"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
GMAIL_USER="yourgmail@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
CLIENT_URL="http://localhost:5173"
```

## Chạy frontend

```bash
npm install
npm run build
npm run dev
```

## Chạy backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

> Ghi chú: trong môi trường đóng gói này tôi đã viết sẵn mã nguồn backend và Prisma schema. Tuy nhiên bước `npm install` của backend có thể cần chạy trên máy của bạn để tải Prisma engine đầy đủ trước khi `generate/migrate`.

## Tài khoản admin seed sẵn

```text
Email: admin@shop.local
Mật khẩu: Admin@123
```

## API chính

- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/orders`
- `GET /api/orders/mine`
- `POST /api/chatbot`
- `GET /api/rewards/dashboard`
- `POST /api/rewards/tasks/:taskId/claim`
- `POST /api/rewards/vouchers/:voucherId/redeem`
- `POST /api/rewards/spin`
- `GET /api/admin/rewards`
- `POST /api/admin/rewards/tasks`
- `POST /api/admin/rewards/vouchers`
- `PUT /api/admin/rewards/settings`

## Phần đã chỉnh ở frontend

- `useAuth.tsx`: gọi backend thật, lưu JWT vào `localStorage`
- `Signup.tsx`: thêm bước nhập OTP Gmail
- `Login.tsx`: đăng nhập bằng API
- `Checkout.tsx`: gửi đơn hàng xuống backend và email bill
- `AIStylist.tsx`: gọi chatbot OpenAI qua backend

## Lưu ý

Dự án gốc còn nhiều trang admin/shop đang dùng mock data. Tôi đã ưu tiên chuyển các phần cốt lõi mà bạn yêu cầu: **xác thực, phân quyền, chatbot, đơn hàng, schema và email**. Nếu muốn, bước tiếp theo nên là nối toàn bộ danh sách sản phẩm/đơn hàng/admin dashboard sang API backend mới.


## Sửa lỗi kết nối frontend-backend

Bản zip này đã sửa lỗi `Failed to fetch` khi frontend chạy ở `http://localhost:8080` còn backend ở `http://localhost:4000`.

### Điểm đã sửa
- Frontend mặc định gọi `/api` thay vì hardcode `http://localhost:4000/api`
- Vite đã thêm proxy `/api -> http://localhost:4000`
- Backend CORS cho phép cả `localhost:8080`, `localhost:5173`, `127.0.0.1:8080`, `127.0.0.1:5173`
- Có thể tùy chỉnh bằng `CLIENT_URLS` trong `backend/.env`

### Chạy đúng
Terminal 1:
```bash
cd backend
npm install
npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate dev --schema=./prisma/schema.prisma
npm run prisma:seed
npm run dev
```

Terminal 2:
```bash
npm install
npm run dev
```

Mở frontend tại `http://localhost:8080`.

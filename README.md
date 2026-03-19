## Cấu trúc

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

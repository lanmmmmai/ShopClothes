# Hướng dẫn sử dụng NocoDB

## Cấu trúc

Frontend → Backend API Proxy → NocoDB

- **Frontend**: Gọi `/api/nocodb/*` qua `src/services/nocodb.js`
- **Backend**: Proxy requests tới NocoDB với token (token chỉ ở backend)
- **NocoDB**: Trả về data

## Setup

### 1. Backend `.env` (server/.env)

```env
NOCODB_BASE_URL=http://localhost:8080
NOCODB_TOKEN=your-token-here
NOCODB_PROJECT=your-project-id
```

### 2. Frontend `.env` (root/.env)

```env
VITE_API_URL=http://localhost:3001/api
```

**⚠️ QUAN TRỌNG**: KHÔNG đặt `VITE_NOCODB_TOKEN` hoặc `VITE_NOCODB_PROJECT` trong frontend `.env`!

## Sử dụng trong Frontend

### Import service

```javascript
import { nocodb } from '../services/nocodb';
```

### CRUD Operations

#### 1. GET - Lấy danh sách

```javascript
// Lấy tất cả records
const response = await nocodb.get('/customers');
const customers = response.data.list || response.data;

// Với pagination
const response = await nocodb.get('/customers', {
  params: {
    limit: 10,
    offset: 0,
  },
});

// Với filter (backend sẽ sanitize)
// Lưu ý: Backend cần sử dụng buildNocoDBWhere() để sanitize
const response = await nocodb.get('/customers', {
  params: {
    where: '(email,eq,test@example.com)',
  },
});
```

#### 2. GET - Lấy một record

```javascript
const response = await nocodb.get(`/customers/${id}`);
const customer = response.data;
```

#### 3. POST - Tạo mới

```javascript
const newCustomer = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123456789',
  gender: 'Nam',
};

const response = await nocodb.post('/customers', newCustomer);
const created = response.data;
```

#### 4. PATCH - Update

```javascript
const updates = {
  phone: '0987654321',
};

const response = await nocodb.patch(`/customers/${id}`, updates);
const updated = response.data;
```

#### 5. DELETE - Xóa

```javascript
await nocodb.delete(`/customers/${id}`);
```

### Ví dụ Component hoàn chỉnh

```javascript
import React, { useState, useEffect } from 'react';
import { nocodb } from '../services/nocodb';

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const response = await nocodb.get('/customers');
      setCustomers(response.data.list || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xác nhận xóa?')) return;
    try {
      await nocodb.delete(`/customers/${id}`);
      await loadCustomers(); // Reload
    } catch (err) {
      alert('Không thể xóa');
    }
  }

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.Id}>
          <h3>{customer.name}</h3>
          <p>{customer.email}</p>
          <button onClick={() => handleDelete(customer.Id)}>Xóa</button>
        </div>
      ))}
    </div>
  );
}
```

## NocoDB Response Format

NocoDB trả về data theo format:

```javascript
// GET list
{
  list: [
    { Id: 1, name: "...", email: "..." },
    { Id: 2, name: "...", email: "..." }
  ],
  pageInfo: {
    totalRows: 100,
    page: 1,
    pageSize: 25,
    isFirstPage: true,
    isLastPage: false
  }
}

// GET single
{
  Id: 1,
  name: "...",
  email: "..."
}
```

## Lưu ý

1. **Authentication**: Tất cả requests đều cần user đã login (có session cookie)
2. **Error Handling**: Luôn wrap trong try-catch
3. **Field Names**: NocoDB có thể trả về `Id` (capital I) hoặc `id` (lowercase)
4. **Backend Sanitization**: Backend sẽ sanitize queries để tránh SQL injection

## Troubleshooting

### "Network Error" hoặc "401 Unauthorized"
- Kiểm tra backend server có chạy không (`http://localhost:3001/health`)
- Kiểm tra user đã login chưa
- Kiểm tra cookies có được gửi không (DevTools > Application > Cookies)

### "403 Forbidden"
- Kiểm tra user có quyền truy cập không
- Kiểm tra route có được protect đúng không

### "500 Internal Server Error"
- Kiểm tra `server/.env` có đúng `NOCODB_TOKEN` và `NOCODB_PROJECT` không
- Kiểm tra NocoDB có đang chạy không (`http://localhost:8080`)
- Xem server logs để biết lỗi chi tiết

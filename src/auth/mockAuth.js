// Simple localStorage-based auth (demo)
const USERS_KEY = "users";
const CURRENT_KEY = "auth_user";

const defaultUsers = [
  { id: "u1", username: "admin", password: "admin123", role: "admin" },
  { id: "u2", username: "staff", password: "staff123", role: "staff" },
  { id: "u3", username: "user",  password: "user123",  role: "user"  },
];

export function seedUsers() {
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(username, password) {
  seedUsers();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const found = users.find(u => u.username === username && u.password === password);
  if (!found) throw new Error("Sai tài khoản hoặc mật khẩu");
  const sessionUser = { id: found.id, username: found.username, role: found.role };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function register({ username, password, role = "user" }) {
  seedUsers();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  if (users.some(u => u.username === username)) throw new Error("Tên đăng nhập đã tồn tại");
  const newUser = { id: `u${Date.now()}`, username, password, role };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const sessionUser = { id: newUser.id, username: newUser.username, role: newUser.role };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

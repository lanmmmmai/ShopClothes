import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, UserRound, ShieldCheck, Sparkles } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  coinBalance: number;
  isVerified: boolean;
  createdAt: string;
  ordersCount: number;
  avatarUrl?: string | null;
  mustChangePassword?: boolean;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [emailFilter, setEmailFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => {
    apiFetch<AdminUser[]>('/auth/admin/users').then(setUsers).catch((err) => setError(err instanceof Error ? err.message : 'Không tải được người dùng'));
  }, []);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = !search.trim() || `${user.fullName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesEmail = emailFilter === 'all' || user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isVerified : !user.isVerified);
    const matchesTag = tagFilter === 'all' || (tagFilter === 'vip' ? user.coinBalance >= 300 : user.ordersCount > 0);
    return matchesSearch && matchesEmail && matchesRole && matchesStatus && matchesTag;
  }), [users, search, emailFilter, roleFilter, statusFilter, tagFilter]);

  const activeUsers = users.filter((user) => user.isVerified).length;
  const adminUsers = users.filter((user) => user.role === 'admin').length;
  const mustChangeCount = users.filter((user) => user.mustChangePassword).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Quản lý tài khoản</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Giữ cùng tinh thần giao diện với mục voucher: nền sáng, điểm nhấn hồng nhẹ, chia khối rõ ràng nhưng vẫn gọn mắt.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 rounded-2xl">Nhập khẩu</Button>
          <Button className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-2 h-4 w-4" /> Thêm tài khoản</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border bg-gradient-to-br from-primary/10 via-background to-amber-50 p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><UserRound className="w-5 h-5" /><span className="font-semibold">Người dùng đang hoạt động</span></div>
          <p className="mt-4 text-4xl font-bold">{activeUsers}</p>
          <p className="mt-2 text-sm text-muted-foreground">Tài khoản đã xác thực và đang dùng hệ thống.</p>
        </div>
        <div className="rounded-[28px] border bg-background p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><ShieldCheck className="w-5 h-5" /><span className="font-semibold">Quản trị viên</span></div>
          <p className="mt-4 text-4xl font-bold">{adminUsers}</p>
          <p className="mt-2 text-sm text-muted-foreground">Nhóm có quyền quản lý vận hành và dữ liệu cửa hàng.</p>
        </div>
        <div className="rounded-[28px] border bg-background p-6 shadow-soft">
          <div className="flex items-center gap-3 text-primary"><Sparkles className="w-5 h-5" /><span className="font-semibold">Chờ đổi mật khẩu</span></div>
          <p className="mt-4 text-4xl font-bold">{mustChangeCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Số tài khoản đang bị ép đổi mật khẩu tạm thời.</p>
        </div>
      </div>

      <div className="rounded-[28px] border bg-background p-6 shadow-soft space-y-5">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Tìm kiếm tài khoản</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nhập tên hoặc email" className="h-14 pl-12 rounded-2xl text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Lọc email</p>
            <Select value={emailFilter} onValueChange={setEmailFilter}><SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="gmail">gmail</SelectItem><SelectItem value="example">example</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Vai trò</p>
            <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="admin">Quản trị viên</SelectItem><SelectItem value="user">Nhân viên</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="active">Hoạt động</SelectItem><SelectItem value="inactive">Tạm nghỉ</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tag</p>
            <Select value={tagFilter} onValueChange={setTagFilter}><SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem><SelectItem value="vip">VIP</SelectItem><SelectItem value="buyers">Có đơn hàng</SelectItem></SelectContent></Select>
          </div>
          <Button className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">Tìm kiếm</Button>
        </div>
      </div>

      <div className="rounded-[28px] border bg-background p-4 shadow-soft overflow-x-auto">
        {error ? <div className="p-6 text-red-500">{error}</div> : (
          <table className="w-full text-left min-w-[980px]">
            <thead>
              <tr className="text-base font-semibold text-muted-foreground">
                <th className="p-4">Tài khoản</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Xu / đơn hàng</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const initials = user.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={user.id} className="border-t align-middle">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 text-primary font-semibold flex items-center justify-center">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <div>
                          <p className="font-semibold text-base">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground mt-1">Tham gia {formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`rounded-xl px-3 py-1 text-sm ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.isVerified ? 'Hoạt động' : 'Tạm nghỉ'}</Badge>
                        {user.mustChangePassword ? <Badge className="rounded-xl px-3 py-1 text-sm bg-rose-100 text-rose-700">Đổi mật khẩu</Badge> : null}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.coinBalance} xu · {user.ordersCount} đơn</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" className="bg-blue-500 hover:bg-blue-600 rounded-xl"><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" className="rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filteredUsers.length && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground text-lg">Không có tài khoản phù hợp.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;

import type { Product, ProductFilters, Order, User, Category, Voucher, Notification } from '@/types';
import { mockProducts, mockOrders, mockUsers, mockCategories, mockVouchers, mockNotifications } from '@/data/mock';

// Simulated API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll(filters: ProductFilters = {}): Promise<{ data: Product[]; total: number }> {
    await delay();
    let results = [...mockProducts].filter(p => p.is_active);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.category) results = results.filter(p => p.category_id === filters.category);
    if (filters.minPrice) results = results.filter(p => (p.sale_price || p.price) >= filters.minPrice!);
    if (filters.maxPrice) results = results.filter(p => (p.sale_price || p.price) <= filters.maxPrice!);
    if (filters.rating) results = results.filter(p => p.rating >= filters.rating!);
    if (filters.colors?.length) results = results.filter(p => p.colors.some(c => filters.colors!.includes(c)));
    if (filters.sizes?.length) results = results.filter(p => p.sizes.some(s => filters.sizes!.includes(s)));

    switch (filters.sort) {
      case 'price_asc': results.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)); break;
      case 'price_desc': results.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)); break;
      case 'popular': results.sort((a, b) => b.sold_count - a.sold_count); break;
      case 'newest': default: results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    const total = results.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    results = results.slice((page - 1) * limit, page * limit);

    return { data: results, total };
  },

  async getBySlug(slug: string): Promise<Product | undefined> {
    await delay();
    return mockProducts.find(p => p.slug === slug);
  },

  async getById(id: string): Promise<Product | undefined> {
    await delay();
    return mockProducts.find(p => p.id === id);
  },

  async getFeatured(): Promise<Product[]> {
    await delay();
    return mockProducts.filter(p => p.is_active).sort((a, b) => b.sold_count - a.sold_count).slice(0, 4);
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    await delay();
    return mockProducts.filter(p => p.category_id === categoryId && p.is_active);
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await delay();
    return mockCategories;
  },
  async getBySlug(slug: string): Promise<Category | undefined> {
    await delay();
    return mockCategories.find(c => c.slug === slug);
  },
};

export const orderService = {
  async getAll(): Promise<Order[]> {
    await delay();
    return mockOrders;
  },
  async getById(id: string): Promise<Order | undefined> {
    await delay();
    return mockOrders.find(o => o.id === id);
  },
  async getByUser(userId: string): Promise<Order[]> {
    await delay();
    return mockOrders.filter(o => o.user_id === userId);
  },
};

export const userService = {
  async getAll(): Promise<User[]> {
    await delay();
    return mockUsers;
  },
  async getCurrentUser(): Promise<User> {
    await delay();
    return mockUsers[0];
  },
};

export const voucherService = {
  async getAll(): Promise<Voucher[]> {
    await delay();
    return mockVouchers;
  },
  async validate(code: string): Promise<Voucher | null> {
    await delay();
    const v = mockVouchers.find(v => v.code === code && v.is_active);
    return v || null;
  },
};

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    await delay();
    return mockNotifications;
  },
};

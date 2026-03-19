export type UserRole = 'admin' | 'staff' | 'user';
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'COD' | 'BANKING' | 'STRIPE' | 'VNPAY';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  loyalty_points: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_hex: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category_id: string;
  category?: Category;
  stock_quantity: number;
  images: string[];
  colors: string[];
  color_hexes: string[];
  sizes: string[];
  variants: ProductVariant[];
  detail_fields: Record<string, string>;
  reviews: Review[];
  rating: number;
  review_count: number;
  sold_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  is_default: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  subtotal?: number;
  shipping_fee?: number;
  discount_amount?: number;
  payment_method: PaymentMethod;
  payment_status?: 'PENDING' | 'PAID' | 'FAILED';
  shipping_address: Address;
  voucher_id?: string;
  voucher_code?: string;
  loyalty_points_used: number;
  reward_coins?: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface LoyaltyCoin {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  order_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  is_read: boolean;
  created_at: string;
  order_id?: string;
  action_url?: string;
}

export interface ChatMessage {
  id: string;
  order_id?: string;
  sender: 'user' | 'admin';
  sender_name?: string;
  content: string;
  created_at: string;
  is_read?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  colors?: string[];
  sizes?: string[];
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

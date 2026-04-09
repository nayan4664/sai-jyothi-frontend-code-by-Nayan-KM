import type { OrderDetails } from './order';

export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export interface AdminBook {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
  language: string;
  stock: number;
  reviewCount: number;
}

export interface AdminBookPayload {
  title: string;
  author: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
  language: string;
  stock: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type AdminOrder = OrderDetails;

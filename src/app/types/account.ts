import type { Book } from './book';

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  role: string;
}

export interface ProfilePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
  userName: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface WishlistItem extends Book {
  addedAt: string;
}

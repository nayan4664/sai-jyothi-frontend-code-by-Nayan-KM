import type {
  PasswordChangePayload,
  Profile,
  ProfilePayload,
  Review,
  ReviewPayload,
  WishlistItem,
} from '../types/account';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:8080/api';

interface ApiErrorResponse {
  message?: string;
  validationErrors?: Record<string, string>;
}

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload.validationErrors && Object.keys(payload.validationErrors).length > 0) {
        message = Object.values(payload.validationErrors)[0] ?? message;
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      // Ignore parse errors.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

interface BackendWishlistItem {
  bookId: number;
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
  addedAt: string;
}

const mapWishlistItem = (item: BackendWishlistItem): WishlistItem => ({
  id: item.bookId,
  title: item.title,
  author: item.author,
  price: item.price,
  category: item.category,
  rating: item.rating,
  image: item.image,
  description: item.description,
  isbn: item.isbn,
  pages: item.pages,
  publisher: item.publisher,
  language: item.language,
  addedAt: item.addedAt,
});

export const accountApi = {
  async getProfile(token: string): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseJson<Profile>(response);
  },

  async updateProfile(token: string, payload: ProfilePayload): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return parseJson<Profile>(response);
  },

  async changePassword(token: string, payload: PasswordChangePayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    await parseJson<void>(response);
  },

  async getWishlist(token: string): Promise<WishlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await parseJson<BackendWishlistItem[]>(response);
    return payload.map(mapWishlistItem);
  },

  async addWishlistItem(token: string, bookId: number): Promise<WishlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await parseJson<BackendWishlistItem[]>(response);
    return payload.map(mapWishlistItem);
  },

  async removeWishlistItem(token: string, bookId: number): Promise<WishlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await parseJson<BackendWishlistItem[]>(response);
    return payload.map(mapWishlistItem);
  },

  async getReviews(bookId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`);
    return parseJson<Review[]>(response);
  },

  async createReview(token: string, bookId: number, payload: ReviewPayload): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return parseJson<Review>(response);
  },

  async updateReview(token: string, bookId: number, reviewId: number, payload: ReviewPayload): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return parseJson<Review>(response);
  },

  async deleteReview(token: string, bookId: number, reviewId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await parseJson<void>(response);
  },
};

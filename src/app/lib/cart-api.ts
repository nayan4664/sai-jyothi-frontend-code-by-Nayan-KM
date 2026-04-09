import type { Book } from '../types/book';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:8080/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export interface CartItem extends Book {
  quantity: number;
  lineTotal: number;
}

export interface CartResponse {
  userId: number;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

interface ApiErrorResponse {
  message?: string;
  validationErrors?: Record<string, string>;
}

interface BackendCartItem {
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
  quantity: number;
  lineTotal: number;
}

interface BackendCartResponse {
  userId: number;
  items: BackendCartItem[];
  itemCount: number;
  subtotal: number;
}

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

  return response.json() as Promise<T>;
};

const mapCartResponse = (response: BackendCartResponse): CartResponse => ({
  userId: response.userId,
  itemCount: response.itemCount,
  subtotal: response.subtotal,
  items: response.items.map((item) => ({
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
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  })),
});

export const cartApi = {
  async getCart(token: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return mapCartResponse(await parseJson<BackendCartResponse>(response));
  },

  async addOrUpdateItem(token: string, bookId: number, quantity: number): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ bookId, quantity }),
    });

    return mapCartResponse(await parseJson<BackendCartResponse>(response));
  },

  async removeItem(token: string, bookId: number): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return mapCartResponse(await parseJson<BackendCartResponse>(response));
  },

  async clearCart(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  },
};

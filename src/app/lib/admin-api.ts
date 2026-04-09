import type { DashboardStats, AdminBook, AdminBookPayload, AdminOrder, AdminUser } from '../types/admin';
import type { OrderDetails } from '../types/order';

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

  return response.json() as Promise<T>;
};

interface BackendOrderItem {
  bookId: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

interface BackendOrder {
  id: number;
  orderId: string;
  status: string;
  total: number;
  shippingCost: number;
  orderDate: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
  };
  items: BackendOrderItem[];
}

const mapOrder = (order: BackendOrder): OrderDetails => ({
  id: order.id,
  orderId: order.orderId,
  status: order.status,
  total: order.total,
  shippingCost: order.shippingCost,
  orderDate: order.orderDate,
  customerInfo: order.customerInfo,
  items: order.items.map((item) => ({
    id: item.bookId,
    title: item.title,
    author: item.author,
    category: item.category,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    description: '',
    rating: 0,
    isbn: '',
    pages: 0,
    publisher: '',
    language: '',
  })),
});

export const adminApi = {
  async getDashboardStats(token: string): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return parseJson<DashboardStats>(response);
  },

  async getBooks(token: string): Promise<AdminBook[]> {
    const response = await fetch(`${API_BASE_URL}/admin/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return parseJson<AdminBook[]>(response);
  },

  async createBook(token: string, payload: AdminBookPayload): Promise<AdminBook> {
    const response = await fetch(`${API_BASE_URL}/admin/books`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    return parseJson<AdminBook>(response);
  },

  async updateBook(token: string, bookId: number, payload: AdminBookPayload): Promise<AdminBook> {
    const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    return parseJson<AdminBook>(response);
  },

  async deleteBook(token: string, bookId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
  },

  async getOrders(token: string): Promise<AdminOrder[]> {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await parseJson<BackendOrder[]>(response);
    return orders.map(mapOrder);
  },

  async updateOrderStatus(token: string, orderId: number, status: string): Promise<AdminOrder> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });

    const order = await parseJson<BackendOrder>(response);
    return mapOrder(order);
  },

  async getUsers(token: string): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return parseJson<AdminUser[]>(response);
  },

  async updateUserRole(token: string, userId: number, role: string): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ role }),
    });

    return parseJson<AdminUser>(response);
  },
};

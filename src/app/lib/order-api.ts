import type { OrderDetails } from '../types/order';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:8080/api';

interface ApiErrorResponse {
  message?: string;
  validationErrors?: Record<string, string>;
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

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export interface CheckoutPayload {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

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
  customerInfo: CheckoutPayload;
  items: BackendOrderItem[];
  tracking?: {
    trackingCode: string;
    currentLabel: string;
    estimatedDeliveryText: string;
    carrier: string;
    trackingAddress: string;
    milestones: Array<{
      label: string;
      description: string;
      completed: boolean;
    }>;
  };
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
  tracking: order.tracking,
});

export const orderApi = {
  async checkout(token: string, payload: CheckoutPayload): Promise<OrderDetails> {
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });

    const order = await parseJson<BackendOrder>(response);
    return mapOrder(order);
  },

  async getOrders(token: string): Promise<OrderDetails[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await parseJson<BackendOrder[]>(response);
    return orders.map(mapOrder);
  },

  async getOrder(token: string, orderId: number): Promise<OrderDetails> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const order = await parseJson<BackendOrder>(response);
    return mapOrder(order);
  },
};

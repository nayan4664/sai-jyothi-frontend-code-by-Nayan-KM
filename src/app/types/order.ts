import type { Book } from './book';

export interface CartLineItem extends Book {
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
}

export interface TrackingMilestone {
  label: string;
  description: string;
  completed: boolean;
}

export interface TrackingInfo {
  trackingCode: string;
  currentLabel: string;
  estimatedDeliveryText: string;
  carrier: string;
  trackingAddress: string;
  milestones: TrackingMilestone[];
}

export interface OrderDetails {
  id?: number;
  items: CartLineItem[];
  total: number;
  shippingCost: number;
  customerInfo: CustomerInfo;
  orderDate: string;
  orderId: string;
  status?: string;
  tracking?: TrackingInfo;
}

export const isOrderDetails = (value: unknown): value is OrderDetails => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const order = value as Partial<OrderDetails>;
  return (
    typeof order.total === 'number' &&
    typeof order.shippingCost === 'number' &&
    typeof order.orderDate === 'string' &&
    typeof order.orderId === 'string' &&
    Array.isArray(order.items) &&
    !!order.customerInfo &&
    typeof order.customerInfo.fullName === 'string' &&
    typeof order.customerInfo.email === 'string' &&
    typeof order.customerInfo.phone === 'string' &&
    typeof order.customerInfo.address === 'string' &&
    typeof order.customerInfo.city === 'string' &&
    typeof order.customerInfo.state === 'string' &&
    typeof order.customerInfo.pincode === 'string'
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PackageCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { orderApi } from '../lib/order-api';
import type { OrderDetails } from '../types/order';

export const Orders: React.FC = () => {
  const { authToken } = useAuth();
  const { language, t, orderStatusLabel, locale, categoryLabel } = useLanguage();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const copy =
    language === 'hi'
      ? {
          title: 'मेरे ऑर्डर',
          loading: 'आपके ऑर्डर लोड हो रहे हैं...',
          loadError: 'आपके ऑर्डर लोड नहीं हो सके।',
          empty: 'अभी तक कोई ऑर्डर नहीं',
          emptyText: 'पहले चेकआउट के बाद आपका ऑर्डर इतिहास यहां दिखेगा।',
          track: 'अपनी हाल की खरीद और डिलीवरी की जानकारी एक ही जगह ट्रैक करें।',
          orderedOn: 'ऑर्डर किया गया',
          qty: 'मात्रा',
          deliveryDetails: 'डिलीवरी विवरण',
          paymentMethod: 'भुगतान विधि',
        }
      : {
          title: 'My Orders',
          loading: 'Loading your orders...',
          loadError: 'Could not load your orders.',
          empty: 'No orders yet',
          emptyText: 'Your order history will appear here after your first checkout.',
          track: 'Track your recent purchases and delivery details in one place.',
          orderedOn: 'Ordered on',
          qty: 'Qty',
          deliveryDetails: 'Delivery Details',
          paymentMethod: 'Payment Method',
        };

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!authToken) {
        if (isActive) {
          setOrders([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await orderApi.getOrders(authToken);
        if (isActive) {
          setOrders(response);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : copy.loadError);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [authToken, copy.loadError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.title}</h1>
          <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">{copy.loading}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.title}</h1>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{copy.empty}</h1>
          <p className="text-lg text-gray-600 mb-8">{copy.emptyText}</p>
          <Link
            to="/books"
            className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {t('common.browseBooks')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{copy.title}</h1>
            <p className="mt-2 text-gray-600">{copy.track}</p>
          </div>
          <Link
            to="/books"
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 transition"
          >
            {t('common.continueShopping')}
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order.id ?? order.orderId} className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="border-b border-gray-100 bg-slate-50 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{order.orderId}</p>
                  <p className="text-sm text-gray-600">
                    {copy.orderedOn} {new Date(order.orderDate).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    <PackageCheck className="mr-2 h-4 w-4" />
                    {orderStatusLabel(order.status ?? 'PLACED')}
                  </span>
                  <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={`${order.orderId}-${item.id}`} className="flex gap-4 rounded-xl bg-gray-50 p-4">
                        <img src={item.image} alt={item.title} className="h-24 w-16 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-gray-900">{item.title}</h2>
                          <p className="text-sm text-gray-600">{t('common.by')} {item.author}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {copy.qty}: {item.quantity} · {t('common.category')}: {categoryLabel(item.category)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-bold text-gray-900 mb-3">{copy.deliveryDetails}</h3>
                    <p className="font-semibold text-gray-900">{order.customerInfo.fullName}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                    <p className="mt-3 text-sm text-gray-600">
                      {order.customerInfo.address}, {order.customerInfo.city}
                      <br />
                      {order.customerInfo.state} - {order.customerInfo.pincode}
                    </p>
                    <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
                      <p>{copy.paymentMethod}: <span className="font-medium text-gray-900 uppercase">{order.customerInfo.paymentMethod}</span></p>
                      <p className="mt-1">{t('common.shipping')}: {order.shippingCost === 0 ? t('common.free') : `₹${order.shippingCost}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

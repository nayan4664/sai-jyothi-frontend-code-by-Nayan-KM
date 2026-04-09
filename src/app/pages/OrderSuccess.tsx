import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Package, Home, PartyPopper, Sparkles } from 'lucide-react';
import { CartLineItem, isOrderDetails, OrderDetails } from '../types/order';
import { useLanguage } from '../contexts/LanguageContext';

export const OrderSuccess: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const navigate = useNavigate();
  const { language, t, orderStatusLabel, locale } = useLanguage();

  const confettiPieces = [
    { left: '6%', color: '#22c55e', delay: '0s', duration: '4.5s', drift: '-30px' },
    { left: '14%', color: '#06b6d4', delay: '0.8s', duration: '5.4s', drift: '42px' },
    { left: '22%', color: '#f59e0b', delay: '0.3s', duration: '4.8s', drift: '-18px' },
    { left: '31%', color: '#ef4444', delay: '1.1s', duration: '5.8s', drift: '28px' },
    { left: '40%', color: '#8b5cf6', delay: '0.5s', duration: '5.1s', drift: '-36px' },
    { left: '50%', color: '#14b8a6', delay: '1.4s', duration: '4.7s', drift: '16px' },
    { left: '60%', color: '#ec4899', delay: '0.9s', duration: '5.2s', drift: '-22px' },
    { left: '69%', color: '#3b82f6', delay: '0.2s', duration: '5.7s', drift: '34px' },
    { left: '78%', color: '#10b981', delay: '1.6s', duration: '4.9s', drift: '-28px' },
    { left: '88%', color: '#f97316', delay: '0.6s', duration: '5.5s', drift: '20px' },
    { left: '95%', color: '#eab308', delay: '1.2s', duration: '4.6s', drift: '-14px' },
  ];

  const copy =
    language === 'hi'
      ? {
          happyAlert: 'खुशी की सूचना',
          confirmed: 'ऑर्डर सफलतापूर्वक कन्फर्म हो गया!',
          preparing: 'आपका ऑर्डर प्राप्त हो गया है। हम डिलीवरी की तैयारी कर रहे हैं।',
          placed: 'ऑर्डर सफलतापूर्वक किया गया!',
          thanks: 'आपके ऑर्डर के लिए धन्यवाद। हम इसे जल्द प्रोसेस करेंगे।',
          orderDetails: 'ऑर्डर विवरण',
          orderId: 'ऑर्डर आईडी',
          date: 'तारीख',
          deliveryInfo: 'डिलीवरी जानकारी',
          orderedItems: 'ऑर्डर किए गए आइटम',
          quantity: 'मात्रा',
          subtotal: 'उप-योग',
          totalPaid: 'कुल भुगतान',
          estimatedDelivery: 'अनुमानित डिलीवरी',
          eta: 'आपका ऑर्डर 5-7 कार्यदिवस में डिलीवर होगा। ट्रैकिंग जानकारी ईमेल से भेजी जाएगी।',
          needHelp: 'ऑर्डर में मदद चाहिए?',
        }
      : {
          happyAlert: 'Happy Alert',
          confirmed: 'Order Confirmed Successfully!',
          preparing: 'Your order has been placed and confirmed. We are getting everything ready for delivery.',
          placed: 'Order Placed Successfully!',
          thanks: "Thank you for your order. We've received your order and will process it soon.",
          orderDetails: 'Order Details',
          orderId: 'Order ID',
          date: 'Date',
          deliveryInfo: 'Delivery Information',
          orderedItems: 'Ordered Items',
          quantity: 'Quantity',
          subtotal: 'Subtotal',
          totalPaid: 'Total Paid',
          estimatedDelivery: 'Estimated Delivery',
          eta: "Your order will be delivered within 5-7 business days. We'll send you tracking information via email.",
          needHelp: 'Need help with your order?',
        };

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (!savedOrder) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const parsedOrder: unknown = JSON.parse(savedOrder);
      if (!isOrderDetails(parsedOrder)) {
        localStorage.removeItem('lastOrder');
        navigate('/', { replace: true });
        return;
      }

      setOrderDetails(parsedOrder);
    } catch {
      localStorage.removeItem('lastOrder');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  if (!orderDetails) {
    return null;
  }

  const orderDate = new Date(orderDetails.orderDate);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_38%,_#f8fafc)] py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confettiPieces.map((piece, index) => (
          <span
            key={`${piece.left}-${index}`}
            className="confetti-piece"
            style={
              {
                left: piece.left,
                backgroundColor: piece.color,
                '--confetti-delay': piece.delay,
                '--confetti-duration': piece.duration,
                '--confetti-drift': piece.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-[1px] shadow-2xl shadow-emerald-200/70">
          <div className="relative rounded-[calc(1.5rem-1px)] bg-white/95 px-6 py-5 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-5 top-4 h-16 w-16 rounded-full bg-emerald-200/70 blur-2xl" />
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-200/70 blur-2xl" />
            </div>
            <div className="relative flex items-start gap-4">
              <div className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
                <PartyPopper className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {copy.happyAlert}
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{copy.confirmed}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{copy.preparing}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce shadow-lg shadow-green-200">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{copy.placed}</h1>
          <p className="text-lg text-gray-600">{copy.thanks}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-white/70">
          <div className="border-b pb-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{copy.orderDetails}</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {orderStatusLabel(orderDetails.status ?? 'PLACED')}
              </span>
            </div>
            <div className="text-gray-600">
              <p><strong>{copy.orderId}:</strong> {orderDetails.orderId}</p>
              <p><strong>{copy.date}:</strong> {orderDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">{copy.deliveryInfo}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold">{orderDetails.customerInfo.fullName}</p>
              <p className="text-gray-600">{orderDetails.customerInfo.email}</p>
              <p className="text-gray-600">{orderDetails.customerInfo.phone}</p>
              <p className="text-gray-600 mt-2">
                {orderDetails.customerInfo.address}, {orderDetails.customerInfo.city}
                <br />
                {orderDetails.customerInfo.state} - {orderDetails.customerInfo.pincode}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">{copy.orderedItems}</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item: CartLineItem) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{t('common.by')} {item.author}</p>
                    <p className="text-sm text-gray-600">{copy.quantity}: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>{copy.subtotal}</span>
                <span>₹{orderDetails.total - orderDetails.shippingCost}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('common.shipping')}</span>
                <span className={orderDetails.shippingCost === 0 ? 'text-green-600' : ''}>
                  {orderDetails.shippingCost === 0 ? t('common.free') : `₹${orderDetails.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>{copy.totalPaid}</span>
                <span>₹{orderDetails.total}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Package className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">{copy.estimatedDelivery}</p>
                  <p className="text-sm text-blue-700">{copy.eta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('common.home')}
          </Link>
          <Link
            to="/books"
            className="flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {t('common.continueShopping')}
          </Link>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">{copy.needHelp}</p>
          <p>
            <a href="mailto:support@saijyothi.com" className="text-blue-600 hover:underline">
              support@saijyothi.com
            </a>{' '}
            |{' '}
            <a href="tel:+919876543210" className="text-blue-600 hover:underline">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

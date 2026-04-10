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
          happyAlert: 'à¤–à¥à¤¶à¥€ à¤•à¥€ à¤¸à¥‚à¤šà¤¨à¤¾',
          confirmed: 'à¤‘à¤°à¥à¤¡à¤° à¤¸à¤«à¤²à¤¤à¤¾à¤ªà¥‚à¤°à¥à¤µà¤• à¤•à¤¨à¥à¤«à¤°à¥à¤® à¤¹à¥‹ à¤—à¤¯à¤¾!',
          preparing: 'à¤†à¤ªà¤•à¤¾ à¤‘à¤°à¥à¤¡à¤° à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥‹ à¤—à¤¯à¤¾ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤•à¥€ à¤¤à¥ˆà¤¯à¤¾à¤°à¥€ à¤•à¤° à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚à¥¤',
          placed: 'à¤‘à¤°à¥à¤¡à¤° à¤¸à¤«à¤²à¤¤à¤¾à¤ªà¥‚à¤°à¥à¤µà¤• à¤•à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾!',
          thanks: 'à¤†à¤ªà¤•à¥‡ à¤‘à¤°à¥à¤¡à¤° à¤•à¥‡ à¤²à¤¿à¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤¹à¤® à¤‡à¤¸à¥‡ à¤œà¤²à¥à¤¦ à¤ªà¥à¤°à¥‹à¤¸à¥‡à¤¸ à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤',
          orderDetails: 'à¤‘à¤°à¥à¤¡à¤° à¤µà¤¿à¤µà¤°à¤£',
          orderId: 'à¤‘à¤°à¥à¤¡à¤° à¤†à¤ˆà¤¡à¥€',
          date: 'à¤¤à¤¾à¤°à¥€à¤–',
          deliveryInfo: 'à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€',
          orderedItems: 'à¤‘à¤°à¥à¤¡à¤° à¤•à¤¿à¤ à¤—à¤ à¤†à¤‡à¤Ÿà¤®',
          quantity: 'à¤®à¤¾à¤¤à¥à¤°à¤¾',
          subtotal: 'à¤‰à¤ª-à¤¯à¥‹à¤—',
          totalPaid: 'à¤•à¥à¤² à¤­à¥à¤—à¤¤à¤¾à¤¨',
          estimatedDelivery: 'à¤…à¤¨à¥à¤®à¤¾à¤¨à¤¿à¤¤ à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€',
          eta: 'à¤†à¤ªà¤•à¤¾ à¤‘à¤°à¥à¤¡à¤° 5-7 à¤•à¤¾à¤°à¥à¤¯à¤¦à¤¿à¤µà¤¸ à¤®à¥‡à¤‚ à¤¡à¤¿à¤²à¥€à¤µà¤° à¤¹à¥‹à¤—à¤¾à¥¤ à¤Ÿà¥à¤°à¥ˆà¤•à¤¿à¤‚à¤— à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤ˆà¤®à¥‡à¤² à¤¸à¥‡ à¤­à¥‡à¤œà¥€ à¤œà¤¾à¤à¤—à¥€à¥¤',
          needHelp: 'à¤‘à¤°à¥à¤¡à¤° à¤®à¥‡à¤‚ à¤®à¤¦à¤¦ à¤šà¤¾à¤¹à¤¿à¤?',
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

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-lg shadow-green-200 animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">{copy.placed}</h1>
          <p className="text-lg text-gray-600">{copy.thanks}</p>
        </div>

        <div className="mb-6 rounded-3xl border border-white/70 bg-white p-8 shadow-xl">
          <div className="mb-6 border-b pb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{copy.orderDetails}</h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                {orderStatusLabel(orderDetails.status ?? 'PLACED')}
              </span>
            </div>
            <div className="text-gray-600">
              <p><strong>{copy.orderId}:</strong> {orderDetails.orderId}</p>
              <p>
                <strong>{copy.date}:</strong>{' '}
                {orderDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-bold text-gray-900">{copy.deliveryInfo}</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="font-semibold">{orderDetails.customerInfo.fullName}</p>
              <p className="text-gray-600">{orderDetails.customerInfo.email}</p>
              <p className="text-gray-600">{orderDetails.customerInfo.phone}</p>
              <p className="mt-2 text-gray-600">
                {orderDetails.customerInfo.address}, {orderDetails.customerInfo.city}
                <br />
                {orderDetails.customerInfo.state} - {orderDetails.customerInfo.pincode}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-bold text-gray-900">{copy.orderedItems}</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item: CartLineItem) => (
                <div key={item.id} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                  <img src={item.image} alt={item.title} className="h-24 w-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t('common.by')} {item.author}
                    </p>
                    <p className="text-sm text-gray-600">{copy.quantity}: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>{copy.subtotal}</span>
                <span>₹{(orderDetails.total - orderDetails.shippingCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('common.shipping')}</span>
                <span className={orderDetails.shippingCost === 0 ? 'text-green-600' : ''}>
                  {orderDetails.shippingCost === 0 ? t('common.free') : `₹${orderDetails.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-xl font-bold text-gray-900">
                <span>{copy.totalPaid}</span>
                <span>₹{orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start">
                <Package className="mr-3 mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">{copy.estimatedDelivery}</p>
                  <p className="text-sm text-blue-700">{orderDetails.tracking?.estimatedDeliveryText ?? copy.eta}</p>
                </div>
              </div>
            </div>

            {orderDetails.tracking && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Tracking Code: {orderDetails.tracking.trackingCode}</p>
                <p className="mt-1 text-sm text-slate-600">Carrier: {orderDetails.tracking.carrier}</p>
                <p className="mt-1 text-sm text-slate-600">Tracking address: {orderDetails.tracking.trackingAddress}</p>
                <div className="mt-4 space-y-2">
                  {orderDetails.tracking.milestones.map((milestone) => (
                    <div key={milestone.label} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          milestone.completed ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <div>
                        <p className="font-medium text-slate-900">{milestone.label}</p>
                        <p className="text-slate-600">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home className="mr-2 h-5 w-5" />
            {t('common.home')}
          </Link>
          <Link
            to="/books"
            className="flex items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            {t('common.continueShopping')}
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Tracking
          </Link>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">{copy.needHelp}</p>
          <p>
            <a href="mailto:support@saijyothi.com" className="text-blue-600 hover:underline">
              support@saijyothi.com
            </a>{' '}
            |{' '}
            <a href="tel:+919923693506" className="text-blue-600 hover:underline">
              +91 9923693506
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

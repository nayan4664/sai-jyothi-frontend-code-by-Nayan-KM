import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Wallet, Building2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import { orderApi, type CheckoutPayload } from '../lib/order-api';

type CheckoutField = keyof CheckoutPayload;

const validators: Record<CheckoutField, (value: string) => string> = {
  fullName: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'Full name is required.';
    if (!/^[A-Za-z][A-Za-z .'-]{1,254}$/.test(normalized)) return 'Enter a valid full name.';
    return '';
  },
  email: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return 'Enter a valid email address.';
    return '';
  },
  phone: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'Phone number is required.';
    if (!/^(\+91[- ]?)?[6-9]\d{9}$/.test(normalized)) return 'Enter a valid 10-digit Indian phone number.';
    return '';
  },
  address: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'Address is required.';
    if (normalized.length < 10) return 'Address must be at least 10 characters.';
    return '';
  },
  city: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'City is required.';
    if (!/^[A-Za-z][A-Za-z .'-]{1,254}$/.test(normalized)) return 'Enter a valid city name.';
    return '';
  },
  state: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'State is required.';
    if (!/^[A-Za-z][A-Za-z .'-]{1,254}$/.test(normalized)) return 'Enter a valid state name.';
    return '';
  },
  pincode: (value) => {
    const normalized = value.trim();
    if (!normalized) return 'PIN code is required.';
    if (!/^\d{6}$/.test(normalized)) return 'PIN code must be exactly 6 digits.';
    return '';
  },
  paymentMethod: (value) => (!value ? 'Payment method is required.' : ''),
};

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart, isCartReady } = useCart();
  const { user, authToken } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutPayload>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const copy =
    language === 'hi'
      ? {
          checkout: 'चेकआउट',
          contact: 'संपर्क जानकारी',
          fullName: 'पूरा नाम',
          email: 'ईमेल',
          phone: 'फोन नंबर',
          shippingAddress: 'शिपिंग पता',
          address: 'पता',
          city: 'शहर',
          state: 'राज्य',
          pincode: 'पिन कोड',
          paymentMethod: 'भुगतान विधि',
          cashOnDelivery: 'कैश ऑन डिलीवरी',
          payOnReceive: 'ऑर्डर मिलने पर भुगतान करें',
          card: 'क्रेडिट/डेबिट कार्ड',
          cardDemo: 'सुरक्षित भुगतान (केवल डेमो)',
          upi: 'यूपीआई / नेट बैंकिंग',
          upiDemo: 'यूपीआई या इंटरनेट बैंकिंग से भुगतान करें (केवल डेमो)',
          orderSummary: 'ऑर्डर सारांश',
          subtotal: 'उप-योग',
          qty: 'मात्रा',
          placeOrder: 'ऑर्डर करें',
          terms: 'ऑर्डर करके आप हमारे नियम और शर्तों से सहमत होते हैं',
          loadingCart: 'आपका कार्ट लोड हो रहा है...',
          addressPlaceholder: 'सड़क का पता, अपार्टमेंट, आदि',
        }
      : {
          checkout: 'Checkout',
          contact: 'Contact Information',
          fullName: 'Full Name',
          email: 'Email',
          phone: 'Phone Number',
          shippingAddress: 'Shipping Address',
          address: 'Address',
          city: 'City',
          state: 'State',
          pincode: 'PIN Code',
          paymentMethod: 'Payment Method',
          cashOnDelivery: 'Cash on Delivery',
          payOnReceive: 'Pay when you receive the order',
          card: 'Credit/Debit Card',
          cardDemo: 'Secure payment (Demo only)',
          upi: 'UPI / Net Banking',
          upiDemo: 'Pay via UPI or Internet Banking (Demo only)',
          orderSummary: 'Order Summary',
          subtotal: 'Subtotal',
          qty: 'Qty',
          placeOrder: 'Place Order',
          terms: 'By placing your order, you agree to our Terms & Conditions',
          loadingCart: 'Loading your cart...',
          addressPlaceholder: 'Street address, apartment, suite, etc.',
        };

  const statusCopy =
    language === 'hi'
      ? {
          emptyCartToast: 'आपका कार्ट खाली है। चेकआउट से पहले किताबें जोड़ें।',
          cartEmptyError: 'आपका कार्ट खाली है।',
          fixFields: 'कृपया हाइलाइट किए गए चेकआउट फ़ील्ड ठीक करें।',
          loginAgain: 'चेकआउट जारी रखने के लिए फिर से लॉगिन करें।',
          orderPlaced: 'ऑर्डर सफलतापूर्वक किया गया!',
          checkoutError: 'चेकआउट पूरा नहीं हो सका।',
        }
      : {
          emptyCartToast: 'Your cart is empty. Add books before checkout.',
          cartEmptyError: 'Your cart is empty.',
          fixFields: 'Please fix the highlighted checkout fields.',
          loginAgain: 'Please login again to continue checkout.',
          orderPlaced: 'Order placed successfully!',
          checkoutError: 'Could not complete checkout.',
        };

  const getFieldClassName = (field: CheckoutField) =>
    `w-full rounded-lg border bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 caret-gray-900 focus:outline-none focus:ring-2 ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
    }`;

  const shippingCost = cartTotal >= 500 ? 0 : 50;
  const total = cartTotal + shippingCost;

  useEffect(() => {
    if (!isCartReady || isSubmittingOrder) return;
    if (cart.length > 0) return;
    toast.info(statusCopy.emptyCartToast);
    navigate('/cart', { replace: true });
  }, [cart.length, isCartReady, isSubmittingOrder, navigate, statusCopy.emptyCartToast]);

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name,
      email: current.email || user.email,
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const field = name as CheckoutField;
    const nextValue =
      field === 'phone'
        ? value.replace(/[^\d+ -]/g, '').slice(0, 14)
        : field === 'pincode'
          ? value.replace(/\D/g, '').slice(0, 6)
          : value;

    setFormData((current) => ({ ...current, [field]: nextValue }));

    if (touchedFields[field]) {
      setErrors((current) => ({ ...current, [field]: validators[field](nextValue) }));
    }
  };

  const handleBlur = (field: CheckoutField) => {
    setTouchedFields((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validators[field](formData[field]) }));
  };

  const validateForm = () => {
    const nextErrors = Object.fromEntries(
      (Object.keys(formData) as CheckoutField[]).map((field) => [field, validators[field](formData[field])])
    ) as Partial<Record<CheckoutField, string>>;
    setErrors(nextErrors);
    setTouchedFields({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      paymentMethod: true,
    });
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error(statusCopy.cartEmptyError);
      navigate('/cart');
      return;
    }
    if (!validateForm()) {
      toast.error(statusCopy.fixFields);
      return;
    }

    setIsSubmittingOrder(true);
    try {
      if (!authToken) {
        toast.error(statusCopy.loginAgain);
        setIsSubmittingOrder(false);
        navigate('/login', { replace: true, state: { from: { pathname: '/checkout' } } });
        return;
      }

      const payload: CheckoutPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        paymentMethod: formData.paymentMethod,
      };

      const orderDetails = await orderApi.checkout(authToken, payload);
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      await clearCart();
      toast.success(statusCopy.orderPlaced);
      navigate('/order-success');
    } catch (error) {
      setIsSubmittingOrder(false);
      toast.error(error instanceof Error ? error.message : statusCopy.checkoutError);
    }
  };

  if (!isCartReady) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.checkout}</h1>
          <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">{copy.loadingCart}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.checkout}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{copy.contact}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.fullName} *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} onBlur={() => handleBlur('fullName')} className={getFieldClassName('fullName')} placeholder="John Doe" />
                    {touchedFields.fullName && errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.email} *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} onBlur={() => handleBlur('email')} className={getFieldClassName('email')} placeholder="you@example.com" />
                    {touchedFields.email && errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.phone} *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} onBlur={() => handleBlur('phone')} className={getFieldClassName('phone')} placeholder="+91 98765 43210" />
                    {touchedFields.phone && errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{copy.shippingAddress}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.address} *</label>
                    <textarea name="address" required value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} rows={3} className={`${getFieldClassName('address')} resize-none`} placeholder={copy.addressPlaceholder} />
                    {touchedFields.address && errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.city} *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} onBlur={() => handleBlur('city')} className={getFieldClassName('city')} placeholder={copy.city} />
                      {touchedFields.city && errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.state} *</label>
                      <input type="text" name="state" required value={formData.state} onChange={handleChange} onBlur={() => handleBlur('state')} className={getFieldClassName('state')} placeholder={copy.state} />
                      {touchedFields.state && errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{copy.pincode} *</label>
                      <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} onBlur={() => handleBlur('pincode')} className={getFieldClassName('pincode')} placeholder="123456" />
                      {touchedFields.pincode && errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{copy.paymentMethod}</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                    <Wallet className="h-6 w-6 ml-3 mr-3 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{copy.cashOnDelivery}</span>
                      <p className="text-sm text-gray-600">{copy.payOnReceive}</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                    <CreditCard className="h-6 w-6 ml-3 mr-3 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{copy.card}</span>
                      <p className="text-sm text-gray-600">{copy.cardDemo}</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} className="w-5 h-5 text-blue-600" />
                    <Building2 className="h-6 w-6 ml-3 mr-3 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{copy.upi}</span>
                      <p className="text-sm text-gray-600">{copy.upiDemo}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{copy.orderSummary}</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                        <p className="text-xs text-gray-600">{copy.qty}: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>{copy.subtotal}</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t('common.shipping')}</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? t('common.free') : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                    <span>{t('common.total')}</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  {copy.placeOrder}
                </button>

                <p className="mt-4 text-xs text-gray-600 text-center">{copy.terms}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

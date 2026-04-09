import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Sparkles, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useBooks } from '../contexts/BooksContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import type { Book } from '../types/book';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, addToCart, isCartReady } = useCart();
  const { books } = useBooks();
  const { language, t, categoryLabel } = useLanguage();
  const navigate = useNavigate();

  const copy =
    language === 'hi'
      ? {
          popular: 'आप जैसे पाठकों में लोकप्रिय',
          sameAuthorGenre: (category: string) => `उसी लेखक और ${categoryLabel(category)} शैली से`,
          moreFrom: (author: string) => `${author} की और पुस्तकें`,
          becauseYouLike: (category: string) => `क्योंकि आपको ${categoryLabel(category)} पसंद है`,
          loading: 'कार्ट लोड हो रहा है...',
          empty: 'आपका कार्ट खाली है',
          addBooks: 'शुरू करने के लिए कुछ पुस्तकें जोड़ें!',
          cartTitle: 'शॉपिंग कार्ट',
          orderSummary: 'ऑर्डर सारांश',
          items: 'आइटम',
          addMore: (amount: number) => `मुफ्त डिलीवरी पाने के लिए ₹${amount} और जोड़ें!`,
          checkout: 'चेकआउट पर जाएं',
          recommendations: 'आपको यह भी पसंद आ सकता है',
          suggestionText: 'आपके कार्ट में मौजूद पुस्तकों के आधार पर सुझाव।',
          noRemove: 'कार्ट से आइटम हटाया नहीं जा सका।',
        }
      : {
          popular: 'Popular with readers like you',
          sameAuthorGenre: (category: string) => `Same author and ${category} genre`,
          moreFrom: (author: string) => `More from ${author}`,
          becauseYouLike: (category: string) => `Because you like ${category}`,
          loading: 'Loading cart...',
          empty: 'Your cart is empty',
          addBooks: 'Add some books to get started!',
          cartTitle: 'Shopping Cart',
          orderSummary: 'Order Summary',
          items: 'Items',
          addMore: (amount: number) => `Add ₹${amount} more to get free delivery!`,
          checkout: 'Proceed to Checkout',
          recommendations: 'You may also like',
          suggestionText: 'Suggestions based on books currently in your cart (author and genre match).',
          noRemove: 'Could not remove item from cart.',
        };

  const recommendations = useMemo(() => {
    if (cart.length === 0) {
      return [];
    }

    const cartIds = new Set(cart.map((item) => item.id));
    const preferredAuthors = new Set(cart.map((item) => item.author));
    const preferredCategories = new Set(cart.map((item) => item.category));

    return books
      .filter((book) => !cartIds.has(book.id))
      .map((book) => {
        const authorMatch = preferredAuthors.has(book.author);
        const categoryMatch = preferredCategories.has(book.category);

        let score = 0;
        let reason = copy.popular;

        if (authorMatch) score += 3;
        if (categoryMatch) score += 2;

        if (authorMatch && categoryMatch) {
          score += 2;
          reason = copy.sameAuthorGenre(book.category);
        } else if (authorMatch) {
          reason = copy.moreFrom(book.author);
        } else if (categoryMatch) {
          reason = copy.becauseYouLike(book.category);
        }

        return { ...book, score, reason };
      })
      .filter((book) => book.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, 4);
  }, [books, cart, copy]);

  const handleAddRecommendation = async (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    try {
      await addToCart(book);
      toast.success(`${book.title} ${t('common.addedToCart')}`, { duration: 500 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update cart.');
    }
  };

  const handleQuantityChange = async (bookId: number, quantity: number) => {
    try {
      await updateQuantity(bookId, quantity);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update cart.');
    }
  };

  const handleRemove = async (bookId: number) => {
    try {
      await removeFromCart(bookId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.noRemove);
    }
  };

  if (!isCartReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{copy.loading}</h2>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{copy.empty}</h2>
          <p className="text-gray-600 mb-8">{copy.addBooks}</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {t('common.browseBooks')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('common.continueShopping')}
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{copy.cartTitle}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6">
                <Link to={`/book/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition"
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <Link to={`/book/${item.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition mb-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-2">{t('common.by')} {item.author}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {categoryLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => void handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => void handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-gray-900">₹{item.price * item.quantity}</span>
                      <button
                        onClick={() => void handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{copy.orderSummary}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>{copy.items} ({cartCount})</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('common.shipping')}</span>
                  <span className="text-green-600">{cartTotal >= 500 ? t('common.free') : '₹50'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>{t('common.total')}</span>
                  <span>₹{cartTotal >= 500 ? cartTotal : cartTotal + 50}</span>
                </div>
              </div>

              {cartTotal < 500 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
                  {copy.addMore(500 - cartTotal)}
                </div>
              )}

              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {copy.checkout}
              </Link>

              <Link
                to="/books"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold mt-4"
              >
                {t('common.continueShopping')}
              </Link>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center mb-5">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">{copy.recommendations}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">{copy.suggestionText}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full">
                      {book.reason}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-1">
                      {categoryLabel(book.category)}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{t('common.by')} {book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                      <button
                        type="button"
                        onClick={(e) => void handleAddRecommendation(e, book)}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {t('common.add')}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
